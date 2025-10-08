import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
  Reservation,
  ReservationCategory,
  ReservationModel,
  ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { TripStoreModel } from '@/models/stores/TripStore'
import {
  api,
  CreateReservationProps,
  DeleteReservationProps,
} from '@/services/api'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import { toCalendarString } from '@/utils/date'
import { copyImageToLocalStorage } from '@/utils/storage'
import { differenceInDays, eachDayOfInterval, startOfDay } from 'date-fns'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { MarkedDates } from 'react-native-calendars/src/types'

const ConfirmRequiringReservationModel = types
  .model('ConfirmRequiringReservation')
  .props({
    isFlaggedToAdd: types.optional(types.boolean, true),
    reservation: types.reference(ReservationModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async toggleIsFlaggedToAdd() {
      store.setProp('isFlaggedToAdd', !store.isFlaggedToAdd)
    },
  }))

export interface ConfirmRequiringReservation
  extends Instance<typeof ConfirmRequiringReservationModel> {}

export const ReservationStoreModel = types
  .model('ReservationStore')
  .props({
    // id: types.string,d
    tripStore: types.maybe(types.reference(TripStoreModel)),
    reservation: types.map(ReservationModel),
    confirmRequiringReservation: types.array(ConfirmRequiringReservationModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    /**
     * Fetch a trip with given id.
     */
    async fetch() {
      if (store.tripStore) {
        const response = await api.getReservation(store.tripStore.id)
        if (response.kind === 'ok') {
          const data = response.data
          store.setProp('reservation', data.reservation)
        } else {
          console.error(
            `Error fetching Reservation: ${JSON.stringify(response)}`,
          )
        }
      }
    },
    addReservation(reservation: Reservation) {
      return store.reservation.put(reservation)
    },
    clearConfirmRequiringList() {
      console.log('CLEAR')
      store.confirmRequiringReservation.clear()
    },
    addConfirmRequiringList(reservation: Reservation) {
      store.confirmRequiringReservation.push(
        ConfirmRequiringReservationModel.create({
          reservation: reservation.id,
        }),
      )
    },
  }))
  .actions(store => ({
    createCustomReservation(category?: ReservationCategory) {
      const reservation = store.addReservation(
        ReservationModel.create({
          category: 'GENERAL',
          generalReservation: {
            title: '새 예약',
          },
        }),
      )
      if (category) {
        reservation.setCategory(category)
      }
      return reservation
    },
    async createFromText(tripId: string, text: string) {
      store.clearConfirmRequiringList()
      return api.createReservationFromText(tripId, text).then(response => {
        if (response.kind === 'ok') {
          console.log(response.data)
          response.data.forEach(reservation => {
            store.addConfirmRequiringList(
              store.addReservation(ReservationModel.create(reservation)),
            )
          })
        }
        return response
      })
    },
    // createCustomReservation(category: ReservationCategory) {
    //   let title = ''

    //   switch (category) {
    //     case 'ACCOMODATION':
    //       title = '새 숙박 예약'
    //       break
    //     case 'FLIGHT_BOOKING':
    //       title = '새 항공권 예약'
    //       break
    //     case 'FLIGHT_TICKET':
    //       title = '새 모바일 탑승권'
    //       break
    //     default:
    //       title = '새 예약'
    //       break
    //   }

    //   const newReservation = ReservationModel.create({
    //     category: category,
    //     title: title,
    //   })
    //   return store.addReservation(newReservation)
    // },
    /**
     * Patch(update) a reservation.
     */
    patch(reservationDTO: Partial<ReservationSnapshot>) {
      enqueueAction(APIAction.PATCH_RESERVATION, {
        id: reservationDTO.id,
        reservationDTO: reservationDTO,
      } as CreateReservationProps)
    },
    /**
     * Delete a reservation.
     */
    delete(id: string) {
      store.reservation.delete(id)
      enqueueAction(APIAction.DELETE_TODO, { id } as DeleteReservationProps)
    },
    async addFlightTicket(localOSFileUri: string) {
      console.log('[addFlightTicket]')
      if (!!store.tripStore) {
        console.log('[addFlightTicket] Calling api')
        api
          .uploadFlightTicket(store.tripStore.id, localOSFileUri)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              try {
                const createdReservation: Reservation = JSON.parse(
                  response.body,
                )
                // Copy image to local app storage and patch its uri to the reservation DB.
                copyImageToLocalStorage(localOSFileUri).then(
                  localAppStorageFileUri => {
                    if (!!localAppStorageFileUri && !!store.tripStore)
                      api
                        .setLocalAppStorageFileUri(
                          store.tripStore.id,
                          createdReservation.id,
                          localAppStorageFileUri,
                        )
                        .then(response => {
                          if (response.kind == 'ok') {
                            store.reservation.set(
                              response.data.id,
                              response.data,
                            )
                          }
                        })
                  },
                )
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError)
                throw parseError
              }
            }
          })
      }
    },
  }))
  .views(store => ({
    get accomodation(): Reservation[] {
      return [...store.reservation.values()].filter(
        r => r.category === 'ACCOMODATION',
      )
    },
    get reservationSections() {
      if (store.tripStore) {
        const reservations: Reservation[] = Array.from(
          store.reservation.values(),
        )
        // .concat(
        //   Array.from(store.tripStore.accomodation.values()).map(acc => ({
        //     id: `acc-${acc.id}`,
        //     dateTimeIsoString: acc.checkinStartTimeIsoString,
        //     type: 'accomodation',
        //     title: acc.title,
        //     link: acc.links.length > 0 ? acc.links[0].url : null,
        //     localAppStorageFileUri: '',
        //     serverFileUri: '',
        //     accomodation: acc.id,
        //   })),
        // )
        return [{ title: 'reservation', data: reservations }]
      }
    },
    get reservationsToDelete(): Reservation[] {
      return store.confirmRequiringReservation
        .filter(r => !r.isFlaggedToAdd)
        .map(r => r.reservation)
    },
  }))
  .views(store => ({
    get reservedNights() {
      return store.accomodation
        .map(r => {
          const d =
            r.accomodation?.checkinDate && r.accomodation?.checkoutDate
              ? differenceInDays(
                  startOfDay(r.accomodation.checkoutDate),
                  startOfDay(r.accomodation.checkinDate),
                )
              : 0
          console.log('ACC', d)
          return d
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        }, 0)
    },
    get accomodationTodoStatusText() {
      return store.tripStore?.endDate && store.tripStore?.startDate
        ? `${this.reservedNights}박/${differenceInDays(startOfDay(store.tripStore?.endDate), startOfDay(store.tripStore?.startDate))}박`
        : null
    },
    get orderedAccomodationReservations() {
      return [...store.accomodation.values()]
        .filter(r => r.accomodation !== null)
        .sort((a, b) =>
          a.accomodation?.checkinDate
            ? b.accomodation?.checkinDate
              ? a.accomodation.checkinDate?.getDate() -
                b.accomodation.checkinDate.getDate()
              : -1
            : 1,
        )
    },
    get indexedUniqueTitles() {
      return [
        ...new Set(
          this.orderedAccomodationReservations.map(item => item.title),
        ),
      ]
    },
    get accomodationCalendarDotMarkedDates() {
      const markedDates: {
        [key: string]: {
          marked: true
          dotColorKey: number
        }
      } = {}
      this.orderedAccomodationReservations.forEach((r, accIndex) => {
        const start = r.accomodation?.checkinDate
        const end = r.accomodation?.checkoutDate
        const intervalDays =
          start && end ? eachDayOfInterval({ start, end }).slice(0, -1) : []
        intervalDays.forEach((date, index) => {
          const dateString = toCalendarString(date)
          if (!Object.keys(markedDates).includes(dateString)) {
            markedDates[toCalendarString(date)] = {
              dotColorKey: accIndex,
              marked: true,
            }
          }
        })
      })
      return markedDates
    },
    get accomodationCalendarMarkedDatesWithColorIndex() {
      const markedDates: {
        [key: string]: {
          periods: {
            startingDay: boolean
            endingDay: boolean
            colorIndex: number
          }[]
        }
      } = {}
      this.orderedAccomodationReservations.forEach((r, accIndex) => {
        const start = r.accomodation?.checkinDate
        const end = r.accomodation?.checkoutDate
        const intervalDays =
          start && end ? eachDayOfInterval({ start, end }).slice(0, -1) : []
        intervalDays.forEach((date, index) => {
          const dateString = toCalendarString(date)
          if (!Object.keys(markedDates).includes(dateString)) {
            markedDates[toCalendarString(date)] = { periods: [] }
          }
          markedDates[toCalendarString(date)].periods.push({
            startingDay: index === 0,
            endingDay: index === intervalDays.length - 1,
            //   selected: true,
            colorIndex: accIndex,
          })
        })
      })
      return markedDates
    },
    get calendarMarkedDateEntries() {
      return this.orderedAccomodationReservations
        .map(item => {
          const start = item.accomodation?.checkinDate
          const end = item.accomodation?.checkoutDate
          const intervalDays =
            start && end ? eachDayOfInterval({ start, end }).slice(0, -1) : []
          return intervalDays.map((date, index) => [
            toCalendarString(date),
            {
              startingDay: index === 0,
              endingDay: index === intervalDays.length - 1,
              selected: true,
              colorIndex: this.indexedUniqueTitles.indexOf(item.title),
            },
          ])
        })
        .flat() as [
        string,
        {
          startingDay: boolean
          endingDay: boolean
          selected: boolean
          colorIndex: number
        },
      ][]
    },
  }))
//   .actions(store => ())
export interface ReservationStore
  extends Instance<typeof ReservationStoreModel> {}
export interface ReservationStoreSnapshot
  extends SnapshotOut<typeof ReservationStoreModel> {}
