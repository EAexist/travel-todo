import {api} from '@/services/api'
import {copyImageToLocalStorage} from '@/utils/storage'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {TripStoreModel} from '@/models/stores/TripStore'
import {AccomodationModel} from '@/models/Accomodation'
import {withSetPropAction} from '@/models/helpers/withSetPropAction'
import {v4 as uuidv4} from 'uuid'

export const ReservationModel = types.model('Reservation').props({
  id: types.optional(types.identifier, () => uuidv4()),
  dateTimeISOString: types.string,
  type: types.string,
  title: types.string,
  link: types.maybeNull(types.string),
  localAppStorageFileUri: types.maybeNull(types.string),
  serverFileUri: types.maybeNull(types.string),
  accomodation: types.maybeNull(types.reference(AccomodationModel)),
})
export interface Reservation extends Instance<typeof ReservationModel> {}
export interface ReservationSnapshot
  extends SnapshotOut<typeof ReservationModel> {}
export const ReservationStoreModel = types
  .model('ReservationStore')
  .props({
    // id: types.string,
    tripStore: types.maybe(types.reference(TripStoreModel)),
    reservation: types.map(ReservationModel),
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
    addReservation(reservation: ReservationSnapshot) {
      store.reservation.set(reservation.id, reservation)
    },
    // syncOrderInCategory(category: string) {
    //   store.todolist.get(category)?.sort((a, b) => a.orderKey - b.orderKey)
    // },
  }))
  .actions(store => ({
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
        const reservations: ReservationSnapshot[] = (
          Array.from(store.reservation.values()) as ReservationSnapshot[]
        ).concat(
          Array.from(store.tripStore.accomodation.values()).map(acc => ({
            id: `acc-${acc.id}`,
            dateTimeISOString: acc.checkinStartTimeISOString,
            type: 'accomodation',
            title: acc.title,
            link: acc.links.length > 0 ? acc.links[0].url : null,
            localAppStorageFileUri: '',
            serverFileUri: '',
            accomodation: acc.id,
          })),
        )
        return [{title: 'reservation', data: reservations}]
      }
    },
  }))
//   .actions(store => ())
export interface ReservationStore
  extends Instance<typeof ReservationStoreModel> {}
export interface ReservationStoreSnapshot
  extends SnapshotOut<typeof ReservationStoreModel> {}
