import { LoginButton } from '@/components/Login/LoginButton'
import { useUserStore } from '@/models'
import { saveString } from '@/utils/storage'
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { ButtonProps } from '@rneui/themed'
import * as g from 'assets/images/third-party/g.png'
import { FC, useCallback, useEffect } from 'react'
import { StyleSheet } from 'react-native'

export const GoogleLoginButtonBase: FC<ButtonProps> = props => {
    return (
        <LoginButton
            title={'구글로 시작하기'}
            buttonStyle={$googleButtonStyle.buttonStyle}
            titleStyle={$googleButtonStyle.titleStyle}
            symbolSource={g}
            {...props}
        />
    )
}

/* https://developers.google.com/identity/branding-guidelines */
const $googleButtonStyle = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#FFFFFF',
        borderColor: '#747775',
        borderWidth: 1,
        paddingVertical: 10,
    },
    titleStyle: { color: '#1F1F1F' },
})

export const GoogleLoginButton: FC<ButtonProps> = props => {
    const userStore = useUserStore()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '428235231680-j847tt5013n612lk39j8rjp6gih61fsd.apps.googleusercontent.com',
        })
    }, [])

    const handleGoogleLoginPress = useCallback(async () => {
        try {
            const { type, data } = await GoogleSignin.signIn()
            const idToken = data?.idToken
            if (type === 'success' && !!data.idToken) {
                userStore.googleLogin(data.user).then(() => {
                    saveString('googleIdToken', data?.idToken as string)
                })
            } else {
                // sign in was cancelled by user
                setTimeout(() => {
                    console.log('cancelled')
                }, 500)
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                console.log('error', error.message)
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        console.log(
                            'in progress',
                            'operation (eg. sign in) already in progress',
                        )
                        break
                    // case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    //   // android only
                    //   console.log('play services not available or outdated')
                    //   break
                    default:
                        console.log('Something went wrong: ', error.toString())
                }
                //   this.setState({
                //     error,
                //   })
            } else {
                alert(`an error that's not related to google sign in occurred`)
            }
        }
    }, [])

    return <GoogleLoginButtonBase onPress={handleGoogleLoginPress} {...props} />
}
