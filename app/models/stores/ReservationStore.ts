import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
  Reservation,
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
import { copyImageToLocalStorage } from '@/utils/storage'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const ReservationStoreModel = types
  .model('ReservationStore')
  .props({
    // id: types.string,
    tripStore: types.maybe(types.reference(TripStoreModel)),
    reservation: types.map(ReservationModel),
    confirmRequiringReservation: types.array(types.reference(ReservationModel)),
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
  }))
  .actions(store => ({
    createCustomReservation() {
      return store.addReservation(
        ReservationModel.create({
          category: 'GENERAL',
          generalReservation: {
            title: '새 예약',
          },
        }),
      )
    },
    async createFromText(tripId: string, text: string) {
      return api.createReservationFromText(tripId, text).then(response => {
        if (response.kind === 'ok') {
          const confirmRequiringReservationId = response.data.map(
            reservation => {
              return store.addReservation(ReservationModel.create(reservation))
                .id
            },
          )
          store.setProp(
            'confirmRequiringReservation',
            confirmRequiringReservationId,
          )
        }
        return response
      })
    },
    // createCustomReservation(category: ReservationCategory) {
    //   let title = ''

    //   switch (category) {
    //     case 'ACCOMODATION':
    //       title = '새 숙소 예약'
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
  }))
//   .actions(store => ())
export interface ReservationStore
  extends Instance<typeof ReservationStoreModel> {}
export interface ReservationStoreSnapshot
  extends SnapshotOut<typeof ReservationStoreModel> {}
