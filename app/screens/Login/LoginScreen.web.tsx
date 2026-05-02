import { useFabLayout } from '@/components/Fab'
import { Lottie } from '@/components/Lottie'
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthStackScreenProps } from '@/navigators'
import {
    ApiStatus,
    useActionWithApiStatus,
    useApiStatus,
} from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { Text, useTheme } from '@rneui/themed'
import myAnimationData from 'assets/lottie/todo.json'
import { FC, useEffect } from 'react'
import { View, ViewStyle } from 'react-native'

export const LoginScreen: FC<AuthStackScreenProps<'Login'>> = ({ }) => {
    const rootStore = useStores()

    const webBrowserLoginWithIdToken = useActionWithApiStatus(
        rootStore.webBrowserLogin,
    )

    useEffect(() => {
        if (!rootStore.isAuthenticated) {
            webBrowserLoginWithIdToken({})
        }
    }, [rootStore.isAuthenticated])

    useHeader({
        backButtonShown: false,
    })

    const {
        theme: { colors },
    } = useTheme()

    useFabLayout()

    const { apiStatus } = useApiStatus()

    const isServiceUnavailable =
        apiStatus === ApiStatus.ERROR || apiStatus === ApiStatus.NO_CONNECTION

    useEffect(() => {
        console.log(apiStatus)
    }, [apiStatus])

    return (
        <Screen>
            <View style={$statusViewStyle}>
                <View>
                    <Lottie
                        options={{
                            animationData: myAnimationData,
                        }}
                        height={64}
                        width={64}
                        isStopped={isServiceUnavailable}
                    />
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
                </View>
                <View style={{ height: 64 }}>
                    {isServiceUnavailable ? (
                        <Text
                            style={{
                                fontSize: 14,
                                lineHeight: 14 * 1.5,
                                textAlign: 'center',
                            }}>
                            {`지금은 서비스를 사용할 수 없어요\n잠시 후 다시 시도해주세요`}
                        </Text>
                    ) : (
                        <Text style={{ fontSize: 14, textAlign: 'center' }}>
                            {`여행 준비중...`}
                        </Text>
                    )}
                </View>
            </View>
        </Screen>
    )
}
const $statusViewStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
}
