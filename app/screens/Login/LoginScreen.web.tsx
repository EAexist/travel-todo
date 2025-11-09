import { useFabLayout } from '@/components/Fab'
import { Lottie } from '@/components/Lottie'
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthStackScreenProps } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { Text, useTheme } from '@rneui/themed'
import myAnimationData from 'assets/lottie/todo.json'
import { FC, useEffect } from 'react'
import { View, ViewStyle } from 'react-native'

export const LoginScreen: FC<AuthStackScreenProps<'Login'>> = ({}) => {
    const rootStore = useStores()

    useEffect(() => {
        rootStore.webBrowserLogin()
    }, [])

    useHeader({
        backButtonShown: false,
    })

    const {
        theme: { colors },
    } = useTheme()

    useFabLayout()

    return (
        <Screen>
            <View style={$statusViewStyle}>
                <View>
                    <Lottie
                        options={{ animationData: myAnimationData }}
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
                <Text style={{ fontSize: 14, textAlign: 'center' }}>
                    {`여행 준비중...`}
                </Text>
            </View>
        </Screen>
    )
}
const $statusViewStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}
