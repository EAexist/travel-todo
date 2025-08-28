import {api, GoogleUserDTO} from '@/services/api'
import {KakaoProfile} from '@react-native-seoul/kakao-login'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from '../helpers/withSetPropAction'

export const UserStoreModel = types
  .model('UserStore')
  .props({
    // authToken: types.maybe(types.string),
    id: types.maybeNull(types.string),
    nickname: types.maybe(types.string),
    trip: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views(store => ({
    get isAuthenticated() {
      console.log(`[UserStore.isAuthenticated] store.id=${store.id}`)
      return !!store.id
    },
  }))
  .actions(store => ({
    setUser(user: UserStoreSnapshot) {
      store.setProp('id', user.id)
      store.setProp('nickname', user.nickname)
      store.setProp('trip', user.trip)
    },
  }))
  .actions(store => ({
    // setAuthToken(value?: string) {
    //   store.authToken = value
    // },
    // logout() {
    //   store.authToken = undefined
    // },
    login(user: UserStoreSnapshot) {
      store.setUser(user)
      if (!!store.id) {
        console.log(`[UserStore.login] !!store.id=${!!store.id}`)
        api.authenticate(store.id.toString())
      }
      //   console.log(`[UserStore.login] end`)
    },
  }))
  .actions(store => ({
    // async localLogin() {
    //     const user: UserStoreSnapshot =
    //     store.setUser()
    // },
    fetchUserAccount: async () => {
      const response = await api.getUserAccount()
      if (response.kind === 'ok') {
        console.log(
          `[UserStore.fetchUserAccount] response=${JSON.stringify(response.data)}`,
        )
        store.setUser(response.data)
      } else {
        console.error(`Error fetching User: ${JSON.stringify(response)}`)
      }
    },
    async kakaoLogin(idToken: string, profile: KakaoProfile) {
      console.log(
        `[UserStore.kakaoLogin] idToken=${idToken} profile=${JSON.stringify(profile)}`,
      )
      return api.kakaoLogin(idToken, profile).then(response => {
        console.log(
          `[UserStore.kakaoLogin] response=${response.kind} ${JSON.stringify(response)}`,
        )
        if (response.kind === 'ok') {
          store.login(response.data)
        }
      })
    },
    async googleLogin(googleUser: GoogleUserDTO) {
      return api.googleLogin(googleUser).then(response => {
        console.log(`[api.googleLogin] response=${JSON.stringify(response)}`)
        if (response.kind == 'ok') {
          store.login(response.data)
        }
        return response.kind
      })
    },
    async googleLoginWithIdToken(idToken: string) {
      api.googleLoginWithIdToken(idToken).then(response => {
        console.log(`[api.googleLogin] response=${JSON.stringify(response)}`)
        if (response.kind == 'ok') {
          store.login(response.data)
        }
        return response.kind
      })
    },
    async guestLogin() {
      return api.guestLogin().then(response => {
        console.log(`[api.guestLogin] response=${JSON.stringify(response)}`)
        if (response.kind == 'ok') {
          store.login(response.data)
        }
        return response.kind
      })
    },
  }))
  .views(store => ({
    get currentTrip() {
      return store.trip[store.trip.length - 1]
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
