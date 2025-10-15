import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
    Reservation,
    ReservationCategory,
    ReservationModel,
    ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import {
    api,
    CreateReservationProps,
    DeleteReservationProps,
    mapToReservation,
} from '@/services/api'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import { toCalendarString } from '@/utils/date'
import { differenceInDays, eachDayOfInterval, startOfDay } from 'date-fns'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'

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
        // tripStore: types.reference(TripStoreModel),
        reservations: types.map(ReservationModel),
        confirmRequiringReservation: types.optional(
            types.array(ConfirmRequiringReservationModel),
            [],
        ),
    })
    .actions(withSetPropAction)
    .actions(store => ({
        /**
         * Fetch a trip with given id.
         */
        // async fetch() {
        //   if (store.tripStore) {
        //     const response = await api.getReservation(store.tripStore.id)
        //     if (response.kind === 'ok') {
        //       const data = response.data
        //       store.setProp('reservation', data.reservation)
        //     } else {
        //       console.error(
        //         `Error fetching Reservation: ${JSON.stringify(response)}`,
        //       )
        //     }
        //   }
        // },
        addReservation(reservation: Reservation) {
            return store.reservations.put(reservation)
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
        /**
         * Patch(update) a reservation.
         */
        patch(reservationDTO: Partial<ReservationSnapshot>) {
            enqueueAction(APIAction.PATCH_RESERVATION, {
                reservationDTO: reservationDTO,
            } as CreateReservationProps)
        },
        /**
         * Delete a reservation.
         */
        delete(id: string) {
            store.reservations.delete(id)
            enqueueAction(APIAction.DELETE_RESERVATION, {
                id,
            } as DeleteReservationProps)
        },
        // async addFlightTicket(localOSFileUri: string) {
        //   console.log('[addFlightTicket]')
        //   if (!!store.tripStore) {
        //     console.log('[addFlightTicket] Calling api')
        //     api
        //       .uploadFlightTicket(store.tripStore.id, localOSFileUri)
        //       .then(response => {
        //         if (response.status >= 200 && response.status < 300) {
        //           try {
        //             const createdReservation: Reservation = JSON.parse(
        //               response.body,
        //             )
        //             // Copy image to local app storage and patch its uri to the reservation DB.
        //             copyImageToLocalStorage(localOSFileUri).then(
        //               localAppStorageFileUri => {
        //                 if (!!localAppStorageFileUri && !!store.tripStore)
        //                   api
        //                     .setLocalAppStorageFileUri(
        //                       store.tripStore.id,
        //                       createdReservation.id,
        //                       localAppStorageFileUri,
        //                     )
        //                     .then(response => {
        //                       if (response.kind == 'ok') {
        //                         store.reservations.set(
        //                           response.data.id,
        //                           response.data,
        //                         )
        //                       }
        //                     })
        //               },
        //             )
        //           } catch (parseError) {
        //             console.error('Error parsing JSON:', parseError)
        //             throw parseError
        //           }
        //         }
        //       })
        //   }
        // },
    }))
    .views(store => ({
        get accomodation(): Reservation[] {
            return [...store.reservations.values()].filter(
                r => r.category === 'ACCOMODATION',
            )
        },
        get reservationSections() {
            const reservations: Reservation[] = Array.from(
                store.reservations.values(),
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
                        r.accomodation?.checkinDate &&
                        r.accomodation?.checkoutDate
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
                    this.orderedAccomodationReservations.map(
                        item => item.title,
                    ),
                ),
            ]
        },
        get firstCheckinDate() {
            return new Date(
                Math.min(
                    ...store.accomodation
                        .map(r => r.accomodation?.checkinDate?.getTime())
                        .filter(r => r != undefined),
                ),
            )
        },
        get lastCheckoutDate() {
            return new Date(
                Math.max(
                    ...store.accomodation
                        .map(r => r.accomodation?.checkoutDate?.getTime())
                        .filter(r => r != undefined),
                ),
            )
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
                    start && end
                        ? eachDayOfInterval({ start, end }).slice(0, -1)
                        : []
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
                    start && end
                        ? eachDayOfInterval({ start, end }).slice(0, -1)
                        : []
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
                        start && end
                            ? eachDayOfInterval({ start, end }).slice(0, -1)
                            : []
                    return intervalDays.map((date, index) => [
                        toCalendarString(date),
                        {
                            startingDay: index === 0,
                            endingDay: index === intervalDays.length - 1,
                            selected: true,
                            colorIndex: this.indexedUniqueTitles.indexOf(
                                item.title,
                            ),
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
