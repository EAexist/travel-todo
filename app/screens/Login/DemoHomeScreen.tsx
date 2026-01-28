import * as Fab from '@/components/Fab'
import { Lottie } from '@/components/Lottie'
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthenticatedStackScreenProps } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { Text, useTheme } from '@rneui/themed'
import myAnimationData from 'assets/lottie/todo.json'
import { FC } from 'react'
import { View, ViewStyle } from 'react-native'

export const DemoHomeScreen: FC<
    AuthenticatedStackScreenProps<'DemoHome'>
> = ({ }) => {
    const rootStore = useStores()

    // useEffect(() => {
    //     rootStore.webBrowserLogin()
    // }, [])

    useHeader({
        backButtonShown: false,
    })

    const {
        theme: { colors },
    } = useTheme()

    return (
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
                <Text style={{ fontSize: 14, textAlign: 'center' }}>{` `}</Text>
            </View>
            <Fab.Container>
                <Fab.NextButton
                    color={colors.brand}
                    title={'앱 미리보기'}
                    navigateProps={{
                        name: 'TripList',
                    }}
                />
            </Fab.Container>
        </Screen>
    )
}

const $statusViewStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}
