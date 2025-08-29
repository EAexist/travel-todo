import {FC, useCallback} from 'react'
//
import {Container} from '@/components/Fab'
import {GoogleLoginButton} from '@/components/Login/GoogleLoginButton'
import {LoginButton} from '@/components/Login/LoginButton'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {AppStackScreenProps, navigate} from '@/navigators'
import {useLoadingScreen} from '@/screens/LoadingScreen'
import {loadString, saveString} from '@/utils/storage'
import {useHeader} from '@/utils/useHeader'
import {
  getProfile,
  KakaoOAuthToken,
  login,
} from '@react-native-seoul/kakao-login'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {Image, Text} from '@rneui/themed'
import * as appLogo from 'assets/images/app/logo.png'
import {observer} from 'mobx-react-lite'
import {Platform, View} from 'react-native'

export const LoginScreen: FC<AppStackScreenProps<'Login'>> = observer(() => {
  const {userStore, withApiStatus} = useStores()

  const handleKakaoLoginPress = useCallback(async () => {
    console.log(`[handleKakaoLoginPress]`)
    const token: KakaoOAuthToken = await login()
    // .then(token =>
    //   console.log(`[handleKakaoLoginPress] token=${token}`),
    // )
    console.log(`[handleKakaoLoginPress] token=${token}`)
    const profile = await getProfile()
    console.log(`[handleKakaoLoginPress] profile=${profile}`)
    await userStore.kakaoLogin(token.idToken, profile)
  }, [])

  useHeader({backButtonShown: false})
  useLoadingScreen({onSuccess: () => navigate('Welcome')})

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_CLIENT_ID_WEB}>
      <Screen>
        {/* <View style={{}}> */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flex: 1,
          }}>
          <Image
            source={appLogo}
            containerStyle={{}}
            style={{width: 96, height: 96}}
          />
          <Text style={{fontWeight: 700, fontSize: 36, letterSpacing: -1}}>
            TRIP TODO
          </Text>
        </View>
        {/* </View> */}
        <View style={{alignItems: 'center'}}>
          <View style={{width: '100%', maxWidth: 440}}>
            <Container fixed={false}>
              {/* <KakaoLoginButton onPress={handleKakaoLoginPress} /> */}
              <GoogleLoginButton />
              {Platform.OS === 'web' && (
                <LoginButton
                  onPress={async () => {
                    await withApiStatus(userStore.guestLogin)
                  }}
                  title="로그인 없이 사용해보기"
                />
              )}
            </Container>
          </View>
        </View>
      </Screen>
    </GoogleOAuthProvider>
  )
})

const saveIdToken = async (idToken: string) => {
  saveString('googleIdToken', idToken)
}

const getIdToken = async () => {
  return loadString('googleIdToken')
}
