import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import { api, GoogleUserDTO } from '@/services/api'
import { withDbSync } from '@/tasks/BackgroundTask'
import { KakaoProfile } from '@react-native-seoul/kakao-login'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ResourceQuotaStoreModel } from './ResourceQuotaStore'
import { UserStoreModel, UserStoreSnapshotIn } from './UserStore'

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
        userStore: types.maybeNull(UserStoreModel),
        resourceQuotaStore: types.optional(ResourceQuotaStoreModel, {}),
    })
    .actions(withSetPropAction)
    .views(store => ({
        get isAuthenticated() {
            return store.userStore !== null
        },
    }))
    .actions(store => ({
        setUser: (userStore: UserStoreSnapshotIn) => {
            store.setProp('userStore', UserStoreModel.create(userStore))
        },
    }))
    .actions(store => ({
        async kakaoLogin(idToken: string, profile: KakaoProfile) {
            console.log(
                `[UserStore.kakaoLogin] idToken=${idToken} profile=${JSON.stringify(profile)}`,
            )
            return api.kakaoLogin(idToken, profile).then(response => {
                console.log(
                    `[UserStore.kakaoLogin] response=${response.kind} ${JSON.stringify(response)}`,
                )
                if (response.kind === 'ok') {
                    store.setUser(response.data)
                    return response
                }
            })
        },
        async googleLogin(googleUser: GoogleUserDTO) {
            return api.googleLogin(googleUser).then(response => {
                if (response.kind == 'ok') {
                    store.setUser(response.data)
                    return response
                }
                return response
            })
        },
        async adminGoogleLoginWithIdToken({ idToken }: { idToken: string }) {
            return api.adminGoogleLoginWithIdToken(idToken).then(response => {
                if (response.kind == 'ok') {
                    store.setUser(response.data)
                    return store.resourceQuotaStore.fetch().then(response => {
                        if (response.kind === 'ok') {
                            return store.userStore
                                ?.fetchActiveTrip({})
                                .then(response => {
                                    return response
                                })
                        } else return { kind: response.kind }
                    })
                }
                return response
            })
        },
        async webBrowserLogin() {
            return api.webBrowserLogin().then(response => {
                console.log(
                    `[api.webBrowserLogin] response=${JSON.stringify(response)}`,
                )
                if (response.kind === 'ok') {
                    // applySnapshot(store.userStore, response.data)
                    store.setUser(response.data)
                    return store.resourceQuotaStore.fetch().then(response => {
                        if (response.kind === 'ok') {
                            return store.userStore
                                ?.fetchActiveTrip({})
                                .then(response => {
                                    return response
                                })
                        } else return { kind: response.kind }
                    })
                } else return { kind: response.kind }
            })
        },
        async guestLogin() {
            return api.guestLogin().then(response => {
                console.log(
                    `[api.guestLogin] response=${JSON.stringify(response)}`,
                )
                if (response.kind === 'ok') {
                    // applySnapshot(store.userStore, response.data)
                    store.setUser(response.data)
                    return store.resourceQuotaStore.fetch().then(response => {
                        if (response.kind === 'ok') {
                            return store.userStore
                                ?.fetchActiveTrip({})
                                .then(response => {
                                    return response
                                })
                        } else return { kind: response.kind }
                    })
                } else return { kind: response.kind }
            })
        },
        logout: withDbSync(() => {
            store.setProp('userStore', null)
        }),
    }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
