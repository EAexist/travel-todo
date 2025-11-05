import { FC, useCallback, useState } from 'react'
//
import { Container } from '@/components/Fab'
import { LoginButton } from '@/components/Login/LoginButton'
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthStackScreenProps } from '@/navigators'
import { useLoadingScreen } from '@/screens/Loading'
import { loadString, saveString } from '@/utils/storage'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import {
    getProfile,
    KakaoOAuthToken,
    login,
} from '@react-native-seoul/kakao-login'
import {
    StackActions,
    useFocusEffect,
    useNavigation,
} from '@react-navigation/native'
import { Image, Text } from '@rneui/themed'
import * as appLogo from 'assets/images/app/logo.png'
import { observer } from 'mobx-react-lite'
import { View } from 'react-native'

export const LoginScreen: FC<AuthStackScreenProps<'Login'>> = observer(({}) => {
    const rootStore = useStores()
    const { guestLoginWithApiStatus } = useActionsWithApiStatus()

    const navigation = useNavigation()

    const handleKakaoLoginPress = useCallback(async () => {
        console.log(`[handleKakaoLoginPress]`)
        const token: KakaoOAuthToken = await login()
        // .then(token =>
        //   console.log(`[handleKakaoLoginPress] token=${token}`),
        // )
        console.log(`[handleKakaoLoginPress] token=${token}`)
        const profile = await getProfile()
        console.log(`[handleKakaoLoginPress] profile=${profile}`)
        await rootStore.kakaoLogin(token.idToken, profile)
    }, [])

    const handleSuccess = useCallback(() => {
        navigation.dispatch(StackActions.replace('App'))
    }, [navigation])

    useHeader({ backButtonShown: false })
    useLoadingScreen({ onSuccess: handleSuccess })

    const [isLoginSuccess, setIsLoginSuccess] = useState(false)

    const handleGuest = useCallback(async () => {
        await guestLoginWithApiStatus({
            onSuccess: () => setIsLoginSuccess(true),
        })
    }, [guestLoginWithApiStatus])

    useFocusEffect(
        useCallback(() => {
            if (isLoginSuccess) {
                navigation.dispatch(StackActions.replace('Home', {}))
            }
        }, [isLoginSuccess]),
    )

    return (
        <Screen>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    flex: 1,
                }}>
                <Image source={appLogo} style={{ width: 96, height: 96 }} />
                <Text
                    style={{
                        fontWeight: 700,
                        fontSize: 36,
                        letterSpacing: -1,
                    }}>
                    TRIP TODO
                </Text>
            </View>
            {/* </View> */}
            <View style={{ alignItems: 'center' }}>
                <View style={{ width: '100%', maxWidth: 440 }}>
                    <Container fixed={false}>
                        {/* <KakaoLoginButton onPress={handleKakaoLoginPress} /> */}
                        {/* <GoogleLoginButton /> */}
                        <LoginButton
                            onPress={handleGuest}
                            title="로그인 없이 사용해보기"
                        />
                    </Container>
                </View>
            </View>
        </Screen>
    )
})

const saveIdToken = async (idToken: string) => {
    saveString('googleIdToken', idToken)
}

const getIdToken = async () => {
    return loadString('googleIdToken')
}
