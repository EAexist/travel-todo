import { FC, useState } from 'react'
//
import { Container } from '@/components/Fab'
import { GoogleLoginButton } from '@/components/Login/GoogleLoginButton.web'
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthStackScreenProps } from '@/navigators'
import { loadString, saveString } from '@/utils/storage'
import { useActionWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { useNavigation } from '@react-navigation/native'
import { CredentialResponse } from '@react-oauth/google'
import { Image, Text } from '@rneui/themed'
import * as appLogo from 'assets/images/app/logo.png'
import { observer } from 'mobx-react-lite'
import { View } from 'react-native'
import { LoadingBoundary } from '../Loading/LoadingBoundary'

export const AdminScreen: FC<AuthStackScreenProps<'Admin'>> = observer(({}) => {
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
            })
        }
    }
    return (
        <LoadingBoundary>
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

const saveIdToken = async (idToken: string) => {
    saveString('googleIdToken', idToken)
}

const getIdToken = async () => {
    return loadString('googleIdToken')
}
