import { FC, useState } from 'react'
//
import { Container } from '@/components/Fab'
import { GoogleLoginButton } from '@/components/Login/GoogleLoginButton.web'
import { Lottie } from '@/components/Lottie'
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthStackScreenProps } from '@/navigators'
import { saveString } from '@/utils/storage'
import { useActionWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { useNavigation } from '@react-navigation/native'
import { CredentialResponse } from '@react-oauth/google'
import { Text, useTheme } from '@rneui/themed'
import myAnimationData from 'assets/lottie/todo.json'
import { observer } from 'mobx-react-lite'
import { View, ViewStyle } from 'react-native'
import { LoadingBoundary } from '../Loading/LoadingBoundary'

export const AdminScreen: FC<AuthStackScreenProps<'Admin'>> = observer(({ }) => {
    const rootStore = useStores()

    const adminGoogleLoginWithIdToken = useActionWithApiStatus<{
        idToken: string
    }>(rootStore.adminGoogleLoginWithIdToken, () => setIsLoginSuccess(true))

    const navigation = useNavigation()

    useHeader({ backButtonShown: false })

    const [isLoginSuccess, setIsLoginSuccess] = useState(false)

    const handleGoogleLoginSuccess = (
        credentialResponse: CredentialResponse,
    ) => {
        if (credentialResponse.credential) {
            adminGoogleLoginWithIdToken({
                idToken: credentialResponse.credential,
            }).then(() => {
                saveString(
                    'googleIdToken',
                    credentialResponse.credential as string,
                )
            }).catch(error => console.error(error))
        }
    }
    const {
        theme: { colors },
    } = useTheme()

    return (
        <LoadingBoundary>
            <Screen>
                <View style={$statusViewStyle}>
                    <View>
                        <Lottie
                            options={{
                                loop: false,
                                autoplay: false,
                                animationData: myAnimationData,
                            }}
                            height={64}
                            width={64}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                        }}>
                        <Text h1 h1Style={{ color: colors.brand }}>
                            트레블
                        </Text>
                        <Text h1>투두</Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 14,
                            textAlign: 'center',
                        }}>{` `}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: '100%', maxWidth: 440 }}>
                        <Container fixed={false}>
                            <GoogleLoginButton
                                onSuccess={handleGoogleLoginSuccess}
                            />
                        </Container>
                    </View>
                </View>
            </Screen>
        </LoadingBoundary>
    )
})

const $statusViewStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}
