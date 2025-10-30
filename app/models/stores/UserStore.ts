import { api, GoogleUserDTO } from '@/services/api'
import {
    APIAction,
    enqueueAction,
    sync_db,
    withDbSync,
} from '@/tasks/BackgroundTask'
import { KakaoProfile } from '@react-native-seoul/kakao-login'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
    TripStoreModel,
    TripStoreSnapshot,
    TripSummary,
    TripSummaryModel,
} from './TripStore'

export const UserStoreModel = types
    .model('UserStore')
    .props({
        id: types.identifier,
        nickname: types.maybeNull(types.string),
        activeTrip: types.maybeNull(TripStoreModel),
        tripSummary: types.array(TripSummaryModel),
    })
    .actions(withSetPropAction)
    .actions(store => ({
        setUser(user: UserStoreSnapshot) {
            store.setProp('id', user.id)
            store.setProp('nickname', user.nickname)
            store.setProp('tripSummary', user.tripSummary || [])
        },
        setTrip(trip: TripStoreSnapshot | null) {
            store.setProp('activeTrip', trip)
        },
        setTripSummary(tripSummary: TripSummary[]) {
            store.tripSummary.clear()
            store.tripSummary.push(...tripSummary)
        },
    }))
    .actions(store => ({
        // setAuthToken(value?: string) {
        //   store.authToken = value
        // },
        // fetchUserAccount: async () => {
        //     if ((await sync_db()) > 0) {
        //         const response = await api.getUserAccount()
        //         if (response.kind === 'ok') {
        //             console.log(
        //                 `[UserStore.fetchUserAccount] response=${JSON.stringify(response.data)}`,
        //             )
        //             store.setUser(response.data)
        //         } else {
        //             console.error(
        //                 `Error fetching User: ${JSON.stringify(response)}`,
        //             )
        //         }
        //     }
        // },
        fetchActiveTrip: withDbSync(async () => {
            console.log(`[UserStore.fetchActiveTrip]`)
            const response = await api.getActiveTrip(store.id)
            if (response.kind === 'ok') {
                console.log(
                    `[UserStore.fetchActiveTrip] ok, response.data=${JSON.stringify(response.data)}`,
                )
                store.setTrip(response.data)
            } else {
                console.error(
                    `Error fetching Trip: ${JSON.stringify(response)}`,
                )
            }
            return { kind: response.kind }
        }),
        fetchTripSummary: withDbSync(async () => {
            const response = await api.getTripSummary(store.id)
            if (response.kind === 'ok') {
                console.log(
                    `[UserStore.fetchTripSummary] ok, response.data=${JSON.stringify(response.data)}`,
                )
                store.setTripSummary(response.data.tripSummary)
            } else {
                console.error(
                    `Error fetching User: ${JSON.stringify(response)}`,
                )
            }
            return { kind: response.kind }
        }),
        // fetchTripByLocation: async (location: string) => {
        //     console.log(`[UserStore.fetchTripByLocation] location=${location}`)
        //     const response = await api.getTripByLocation(location)
        //     if (response.kind === 'ok') {
        //         store.setProp('tripStore', response.data as TripStoreSnapshot)
        //     } else {
        //         console.error(
        //             `Error fetching Trip: ${JSON.stringify(response)}`,
        //         )
        //     }
        //     return response
        // },
    }))
    .actions(store => ({
        setActiveTrip: withDbSync(async (tripId: string) => {
            console.log('[UserStore.setActiveTrip]')
            return api.setActiveTrip(store.id, tripId).then(async response => {
                console.log(
                    `[UserStore.setActiveTrip] response=${JSON.stringify(response)}`,
                )
                if (response.kind === 'ok') {
                    store.setTrip(
                        response.data,
                        // TripStoreModel.create(response.data),
                    )
                }
                return { kind: response.kind }
            })
        }),
    }))
    .actions(store => ({
        createTrip: withDbSync(async () => {
            console.log('[UserStore.createTrip]')
            return api.createTrip({ userId: store.id }).then(async response => {
                console.log(
                    `[UserStore.createTrip] response=${JSON.stringify(response)}`,
                )
                if (response.kind === 'ok') {
                    store.setProp('tripSummary', response.data.tripSummary)
                    return store.fetchActiveTrip({}).then(response => {
                        return response
                    })
                }
                return response
            })
        }),
        deleteTrip: (tripId: string) => {
            console.log('[UserStore.deleteTrip]')
            const trip = store.tripSummary.find(t => t.id === tripId)
            if (trip) {
                store.tripSummary.remove(trip)
                enqueueAction(APIAction.DELETE_TRIP, { tripId })
            }
        },
        // async kakaoLogin(idToken: string, profile: KakaoProfile) {
        //     console.log(
        //         `[UserStore.kakaoLogin] idToken=${idToken} profile=${JSON.stringify(profile)}`,
        //     )
        //     return api.kakaoLogin(idToken, profile).then(response => {
        //         console.log(
        //             `[UserStore.kakaoLogin] response=${response.kind} ${JSON.stringify(response)}`,
        //         )
        //         if (response.kind === 'ok') {
        //             store.setUser(response.data)
        //             return response
        //         }
        //     })
        // },
        // async googleLogin(googleUser: GoogleUserDTO) {
        //     return api.googleLogin(googleUser).then(response => {
        //         console.log(
        //             `[api.googleLogin] response=${JSON.stringify(response)}`,
        //         )
        //         if (response.kind == 'ok') {
        //             store.setUser(response.data)
        //             return response
        //         }
        //         return response
        //     })
        // },
        // async googleLoginWithIdToken(idToken: string) {
        //     api.googleLoginWithIdToken(idToken).then(response => {
        //         console.log(
        //             `[api.googleLogin] response=${JSON.stringify(response)}`,
        //         )
        //         if (response.kind == 'ok') {
        //             store.setUser(response.data)
        //             return response
        //         }
        //         return response
        //     })
        // },
        // async guestLogin() {
        //     return api.guestLogin().then(response => {
        //         console.log(
        //             `[api.guestLogin] response=${JSON.stringify(response)}`,
        //         )
        //         if (response.kind == 'ok') {
        //             store.setUser(response.data)
        //             return store.fetchActiveTrip().then(response => {
        //                 return response
        //             })
        //         }
        //         return response
        //     })
        // },
    }))
    .views(store => ({
        get maxNumberOfTrip() {
            return 5
        },
    }))
    .views(store => ({
        get currentTrip() {
            return store.tripSummary[store.tripSummary.length - 1]
        },
        get otherTripSummaryList() {
            return [
                ...store.tripSummary
                    .filter(t => t.id !== store.activeTrip?.id)
                    .sort(),
            ].sort(
                (
                    { createDateIsoString: createDateIsoStringA },
                    { createDateIsoString: createDateIsoStringB },
                ) => {
                    const dateA = new Date(createDateIsoStringA)
                    const dateB = new Date(createDateIsoStringB)
                    return dateB.getTime() - dateA.getTime()
                },
            )
        },
        get activeTripSumamry() {
            return store.tripSummary.filter(
                t => t.id === store.activeTrip?.id,
            )[0]
        },
        get hasReachedTripNumberLimit() {
            return store.tripSummary.length == store.maxNumberOfTrip
        },
    }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
