import {
  BottomTabBarProps,
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {CompositeScreenProps} from '@react-navigation/native'
import {TextStyle, ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {useAppTheme} from '@/utils/useAppTheme'

import {
  AppStackParamList,
  AppStackScreenProps,
  TripStackProps,
} from './AppNavigator'
import {Icon} from '@/components/Icon'
import * as MainScreens from '@/screens/Main'
import {FC} from 'react'
import {Button, useTheme} from '@rneui/themed'
import {typography} from '@/rneui/theme'
import {useHeader} from '@/utils/useHeader'
import {GestureHandlerRootViewWrapper} from '@/components/BottomSheetModal'

export type MainTabParamList = {
  TripDashboard: TripStackProps
  Todolist: TripStackProps
  Reservation: TripStackProps
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

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

export const MainTabNavigator: FC<AppStackScreenProps<'Main'>> = ({route}) => {
  const {tripId} = route.params
  const {bottom} = useSafeAreaInsets()
  //   const {
  //     themed,
  //     theme: {colors},
  //   } = useAppTheme()

  const {theme} = useTheme()

  useHeader({headerShown: false})
  return (
    // <GestureHandlerRootViewWrapper>
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
        initialParams={{tripId: tripId}}
        component={MainScreens.Todolist}
        options={{
          tabBarLabel: '할 일',
          tabBarIcon: ({focused}) => (
            <Icon
              name="checklist"
              color={focused ? theme.colors.active : theme.colors.inactive}
              size={28}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Reservation"
        initialParams={{tripId: tripId}}
        component={MainScreens.Reservation}
        options={{
          tabBarLabel: '예약',
          tabBarIcon: ({focused}) => (
            <Icon
              name="qr-code"
              color={focused ? theme.colors.active : theme.colors.inactive}
              size={28}
            />
          ),
        }}
      />
    </Tab.Navigator>
    // </GestureHandlerRootViewWrapper>
  )
}

const $tabBarStyle: ViewStyle = {
  height: 68,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
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
