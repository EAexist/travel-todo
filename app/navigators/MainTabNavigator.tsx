import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { TextStyle, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/components/Icon'
import { useTripStore } from '@/models'
import { typography } from '@/rneui/theme'
import * as MainScreens from '@/screens/Main'
import { useHeader } from '@/utils/useHeader'
import { Button, useTheme } from '@rneui/themed'
import { FC, useLayoutEffect } from 'react'
import {
    AuthenticatedStackScreenProps,
    MainTabParamList,
} from './navigationTypes'
import { useNavigate } from './navigationUtilities'

const Tab = createBottomTabNavigator<MainTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */

function TabBar(props: BottomTabBarProps) {
    return (
        <Button
            onPress={() => {
                // Navigate using the `navigation` prop that you received
                props.navigation.navigate('SomeScreen')
            }}>
            Go somewhere
        </Button>
    )
}

export const MainTabNavigator: FC<AuthenticatedStackScreenProps<'Main'>> = ({
    route,
}) => {
    const trip = useTripStore()

    const { bottom } = useSafeAreaInsets()
    //   const {
    //     themed,
    //     theme: {colors},
    //   } = useAppTheme()

    const { theme } = useTheme()

    const { navigateWithTrip } = useNavigate()

    useLayoutEffect(() => {
        if (!trip.isInitialized) {
            navigateWithTrip('DestinationSetting')
        }
    }, [trip.isInitialized])

    useHeader({ headerShown: false })
    return (
        trip.isInitialized && (
            <Tab.Navigator
                // tabBar={TabBar}

                screenOptions={{
                    // headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: $tabBarStyle,
                    tabBarActiveTintColor: theme.colors.active,
                    tabBarInactiveTintColor: theme.colors.inactive,
                    tabBarLabelStyle: $tabBarLabel,
                    tabBarItemStyle: $tabBarItemStyle,
                }}>
                <Tab.Screen
                    name="Todolist"
                    initialParams={{ tripId: trip.id }}
                    component={MainScreens.Todolist}
                    options={{
                        tabBarLabel: '여행 준비',
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                type="material"
                                name="checklist"
                                color={
                                    focused
                                        ? theme.colors.active
                                        : theme.colors.inactive
                                }
                                size={24}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="ReservationList"
                    initialParams={{ tripId: trip.id }}
                    component={MainScreens.ReservationList}
                    options={{
                        tabBarLabel: '예약',
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                type="material"
                                name="qr-code"
                                color={
                                    focused
                                        ? theme.colors.active
                                        : theme.colors.inactive
                                }
                                size={24}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="TripDashboard"
                    initialParams={{ tripId: trip.id }}
                    component={MainScreens.TripDashboard}
                    options={{
                        tabBarLabel: '더보기',
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                type="material"
                                name="more-horiz"
                                color={
                                    focused
                                        ? theme.colors.active
                                        : theme.colors.inactive
                                }
                                size={24}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        )
    )
}

const $tabBarHeight = 68

// const $sceneStyle: ViewStyle = {
//   //   paddingBottom: $tabBarHeight,
// }
const $tabBarStyle: ViewStyle = {
    height: $tabBarHeight,
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
}

const $tabBarItemStyle: ViewStyle = {
    //   paddingBottom: 12,
}

const $tabBarLabel: TextStyle = {
    ...typography.pretendard.semiBold,
    fontSize: 11,
    lineHeight: 11 * 1.2,
    letterSpacing: 0.4,
}
