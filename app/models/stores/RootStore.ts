import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import { api } from '@/services/api'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ReservationStoreModel } from './ReservationStore'
import { TripStoreModel, TripStoreSnapshot } from './TripStore'
import { UserStoreModel } from './UserStore'

// const GeneralApiProblemType = types.custom<
//   GeneralApiProblem,
//   GeneralApiProblem
// >({
//   fromSnapshot(value: GeneralApiProblem): GeneralApiProblem {
//     return value
//   },
//   toSnapshot(value: GeneralApiProblem): GeneralApiProblem {
//     return value
//   },
// })
/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    userStore: types.optional(UserStoreModel, { id: null }),
    // userStore: types.optional(UserStoreModel, {id: '0'}),
    tripStore: types.maybeNull(TripStoreModel),
    reservationStore: types.optional(ReservationStoreModel, {}),
    // apiStatus: types.enumeration<ApiStatus>(
    //   'ApiStatus',
    //   Object.values(ApiStatus),
    // ),
  })
  .actions(withSetPropAction)
  //   .actions(rootStore => ({
  //     fetchUserAccount: async () => {
  //       console.log('[RootStore] fetchUser()')
  //       if (rootStore.userStore.id) {
  //         const response = await api.getUserAccount(rootStore.userStore.id)
  //         if (response.kind === 'ok') {
  //           rootStore.setProp('userStore', response.data as UserStoreSnapshot)
  //         } else {
  //           console.error(`Error fetching User: ${JSON.stringify(response)}`)
  //         }
  //       }
  //     },
  //   }))
  .actions(store => ({}))
  .actions(store => ({
    fetchTrip: async (tripId: string) => {
      console.log(`[RootStore.fetchTrip] tripId=${tripId}`)
      const response = await api.getTrip(tripId)
      if (response.kind === 'ok') {
        store.setProp('tripStore', response.data as TripStoreSnapshot)
      } else {
        console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
      }
      return response.kind
    },
    async createTrip() {
      return store.userStore.createTrip().then(kind => {
        if (kind === 'ok') {
          return this.fetchTrip(store.userStore.tripSummary[0].id).then(
            kind => {
              return kind
            },
          )
        } else return kind
      })
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
