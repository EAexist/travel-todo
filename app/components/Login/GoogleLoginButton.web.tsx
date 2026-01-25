import { useStores } from '@/models'
import {
    GoogleLogin,
    GoogleLoginProps,
    GoogleOAuthProvider
} from '@react-oauth/google'
import { ButtonProps } from '@rneui/themed'
import { FC, useCallback, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'

export const GoogleLoginButton: FC<
    ButtonProps & Pick<GoogleLoginProps, 'onSuccess'>
> = ({ onSuccess }) => {
    const rootStore = useStores()
    const [width, setWidth] = useState(0)

    // const handlegoogleLoginSuccess = (
    //     credentialResponse: CredentialResponse,
    // ) => {
    //     if (credentialResponse.credential) {
    //         rootStore
    //             .googleLoginWithIdToken(credentialResponse.credential)
    //             .then(() => {
    //                 saveString(
    //                     'googleIdToken',
    //                     credentialResponse.credential as string,
    //                 )
    //             })
    //     }
    // }
    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            setWidth(event.nativeEvent.layout.width)
            console.log(event.nativeEvent.layout.width)
        },
        [setWidth],
    )
    return (
        <View onLayout={handleLayout}>
            <GoogleOAuthProvider
                clientId={
                    // Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIENT_ID_WEB
                    process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_WEB as string
                }>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={() => {
                        console.log('Login Failed')
                    }}
                    size="large"
                    shape="pill"
                    width={width}
                // width={400}
                // width={width.toString()}
                />
            </GoogleOAuthProvider>
        </View>
    )
}
