import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import { api, ApiResult, GoogleUserDTO } from '@/services/api'
import { sync_db } from '@/tasks/BackgroundTask'
import { KakaoProfile } from '@react-native-seoul/kakao-login'
import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withDbSync } from '../helpers/withDbSync'
import { ResourceQuotaStoreModel } from './ResourceQuotaStore'
import { UserStoreModel, UserStoreSnapshotIn } from './UserStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types
    .model('RootStore')
    .props({
        userStore: types.maybeNull(UserStoreModel),
        resourceQuotaStore: types.optional(ResourceQuotaStoreModel, {}),
        isSynced: types.optional(types.boolean, true),
    })
    .actions(withSetPropAction)
    .views((self) => ({
        get isAuthenticated() {
            return self.userStore !== null
        },
    }))
    .actions((self) => ({
        ensureSync: flow(function* () {
            if (self.isSynced) return { success: true }
            const result = yield sync_db()
            if (result === true) {
                self.isSynced = true
                return { success: true }
            }
            return { success: true }
        }) as () => Promise<{
            success: boolean
        }>
    }))
    .actions((self) => ({
        setUser: (userStore: UserStoreSnapshotIn) => {
            self.setProp('userStore', UserStoreModel.create(userStore))
        },
    }))
    .actions((self) => ({
        kakaoLogin: flow(function* ({ idToken, profile }: { idToken: string, profile: KakaoProfile }) {
            return api.kakaoLogin(idToken, profile).then(response => {
                if (response.kind === 'ok') {
                    self.setUser(response.data)
                }
                return response
            })
        }),
        googleLogin: flow(function* ({ googleUser }: { googleUser: GoogleUserDTO }) {
            return api.googleLogin(googleUser).then(response => {
                if (response.kind == 'ok') {
                    self.setUser(response.data)
                }
                return response
            })
        }),
        adminGoogleLoginWithIdToken: flow(function* ({ idToken }: { idToken: string }) {
            const authRes: ApiResult<UserStoreSnapshotIn> = yield api.adminGoogleLoginWithIdToken(idToken)
            if (authRes.kind !== 'ok') return authRes

            self.setUser(authRes.data)

            if (self.userStore === null) {
                throw new Error("Failed to initialize UserStore")
            }

            const quotaRes: ApiResult<void> = yield self.resourceQuotaStore.fetch()
            if (quotaRes.kind !== 'ok') return quotaRes
            return yield self.userStore.fetchActiveTrip()
        }),
        webBrowserLogin: flow(function* () {
            const authResponse: ApiResult<UserStoreSnapshotIn> = yield api.webBrowserLogin()
            if (authResponse.kind !== 'ok') return authResponse

            self.setUser(authResponse.data)

            if (self.userStore === null) {
                throw new Error("Failed to initialize UserStore")
            }

            const quotaResponse: ApiResult<VoidFunction> = yield self.resourceQuotaStore.fetch()
            if (quotaResponse.kind !== 'ok') return quotaResponse

            const activeTripResponse = yield self.userStore.fetchActiveTrip()
            if (activeTripResponse.kind !== 'ok') return activeTripResponse
            return
        }),
        logout: flow(function* () {
            return yield withDbSync(self, async () => {
                self.setProp('userStore', null)
            })
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
