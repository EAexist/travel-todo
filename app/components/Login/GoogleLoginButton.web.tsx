import { useUserStore } from '@/models'
import { saveString } from '@/utils/storage'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { ButtonProps } from '@rneui/themed'
import { FC, useCallback, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'

export const GoogleLoginButton: FC<ButtonProps> = props => {
    const userStore = useUserStore()
    const [width, setWidth] = useState(0)

    const handlegoogleLoginSuccess = (
        credentialResponse: CredentialResponse,
    ) => {
        if (credentialResponse.credential) {
            userStore
                .googleLoginWithIdToken(credentialResponse.credential)
                .then(() => {
                    saveString(
                        'googleIdToken',
                        credentialResponse.credential as string,
                    )
                })
        }
    }
    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            setWidth(event.nativeEvent.layout.width)
            console.log(event.nativeEvent.layout.width)
        },
        [setWidth],
    )
    return (
        <View onLayout={handleLayout}>
            <GoogleLogin
                onSuccess={handlegoogleLoginSuccess}
                onError={() => {
                    console.log('Login Failed')
                }}
                size="large"
                shape="pill"
                width={width}
                // width={400}
                // width={width.toString()}
            />
        </View>
    )
}
