import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {UserStoreModel, UserStoreSnapshot} from './UserStore'
import {TripStoreModel, TripStoreSnapshot} from './TripStore'
import {TodoModel} from '@/models/Todo'
import {ReservationStoreModel} from './ReservationStore'
import {withSetPropAction} from '@/models/helpers/withSetPropAction'
import {api} from '@/services/api'
import {GeneralApiProblem} from '@/services/api/apiProblem'

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

export enum ApiStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  NO_CONNECTION = 'no_connection',
}

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    userStore: types.optional(UserStoreModel, {id: null}),
    // userStore: types.optional(UserStoreModel, {id: '0'}),
    tripStore: types.maybeNull(TripStoreModel),
    reservationStore: types.optional(ReservationStoreModel, {}),
    apiStatus: types.enumeration<ApiStatus>(
      'ApiStatus',
      Object.values(ApiStatus),
    ),
    //   reservationStore: types.maybe(ReservationStoreModel),
    // roundTripStore: types.optional(TodoModel, {
    //   id: '',
    //   type: 'flight',
    //   category: 'reservation',
    //   title: '',
    //   icon: {
    //     name: '✈️',
    //     type: 'tossface',
    //   },
    //   note: '',
    //   isFlaggedToDelete: false,
    //   orderKey: -1,
    //   completeDateISOString: null,
    //   presetId: null,
    //   departure: null,
    //   arrival: null,
    // }),
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
  .actions(store => ({
    setApiStatusIdle() {
      store.setProp('apiStatus', ApiStatus.IDLE)
    },
    handleResponseStatus(kind: string) {
      if (store.apiStatus == ApiStatus.PENDING)
        switch (kind) {
          case 'ok':
            store.setProp('apiStatus', ApiStatus.SUCCESS)
            break
          case 'timeout':
          case 'cannot-connect':
            store.setProp('apiStatus', ApiStatus.NO_CONNECTION)
            break
          default:
            store.setProp('apiStatus', ApiStatus.ERROR)
            break
        }
    },
  }))
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
        if (kind === 'ok' && store.userStore.trip[-1].id) {
          return this.fetchTrip(store.userStore.trip[-1].id).then(kind => {
            return kind
          })
        } else return kind
      })
    },
    async withApiStatus<T>(action: (args: T) => Promise<string>) {
      return (args: T) => {
        store.setProp('apiStatus', ApiStatus.PENDING)
        action(args).then((kind: string) => {
          store.handleResponseStatus(kind)
        })
      }
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
