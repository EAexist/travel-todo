/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {BackButton} from '@/components/Header'
import theme from '@/rneui/theme'
import * as Screens from '@/screens'
import {useThemeProvider} from '@/utils/useAppTheme'
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import {Header, ThemeProvider, useTheme} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {ComponentProps} from 'react'
import Config from '../config'
import {useStores} from '../models'
import {navigationRef, useBackButtonHandler} from './navigationUtilities'
import {FabProvider} from '@/components/Fab'
import {LoginScreen} from '@/screens/Login/LoginScreen'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {MainTabNavigator, MainTabParamList} from './MainTabNavigator'
import {GestureHandlerRootViewWrapper} from '@/components/BottomSheetModal'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import {Platform, View, ViewStyle} from 'react-native'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TripStackProps = {tripId: string}
export type TodoStackProps = TripStackProps & {todoId: string}
export type FlightSettingStackProps = TodoStackProps & {
  callerName: 'TodolistSetting' | 'TodolistAdd'
}

export type AppStackParamList = {
  // 🔥 Your screens go here

  /* Login */
  Login: {}

  /* Create Trip */
  Welcome: {}
  DestinationSetting: TripStackProps
  DestinationSearch: TripStackProps
  ScheduleSetting: TripStackProps
  TitleSetting: TripStackProps
  TodolistSetting: TripStackProps

  /* Main */
  Main: NavigatorScreenParams<MainTabParamList> & TripStackProps
  //   Main: TripStackProps

  /* Edit Trip */
  //   Todolist: TripStackProps
  TodolistAdd: TripStackProps
  TodolistDelete: TripStackProps
  TodolistReorder: TripStackProps

  /* Accomodation */
  AccomodationPlan: TripStackProps & {accomodationId: string}
  Accomodation: TripStackProps & {accomodationId: string}
  AccomodationNote: TripStackProps & {accomodationId: string}
  CreateAccomodation: TripStackProps

  //   Reservation: TripStackProps & {reservationId: string}
  FullScreenImage: TripStackProps & {
    reservationId: string
    localAppStorageFileUri: string
  }

  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
} & TodoAppStackParamList

export type TodoAppStackParamList = {
  /* Confirm */
  //   ConfirmReservationTodo: TodoStackProps
  ConfirmPassport: TodoStackProps
  ConfirmFlight: TodoStackProps
  ConfirmFlightTicket: TodoStackProps
  /* Edit Todo */
  TodoTitle: TodoStackProps
  TodoNote: TodoStackProps
  TodoCreate: FlightSettingStackProps & {isInitializing: boolean}
  TodoEdit: TodoStackProps

  /* Flight */
  DepartureAirportSetting: FlightSettingStackProps
  ArrivalAirportSetting: FlightSettingStackProps
  DepartureAirportEdit: FlightSettingStackProps
  ArrivalAirportEdit: FlightSettingStackProps
  RoundTripSetting: FlightSettingStackProps
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const Tab = createBottomTabNavigator()

const AppStack = observer(function AppStack() {
  const {
    userStore: {isAuthenticated},
  } = useStores()

  const {
    theme: {colors},
  } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <Header
            leftComponent={<BackButton />}
            containerStyle={{marginTop: '8%'}}
          />
        ),
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? 'Welcome' : 'Login'}>
      {isAuthenticated ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Welcome" component={Screens.New.Welcome} />
            <Stack.Screen
              name="DestinationSetting"
              component={Screens.New.DestinationSetting}
            />
            <Stack.Screen
              name="ScheduleSetting"
              component={Screens.New.ScheduleSetting}
            />
            <Stack.Screen
              name="DestinationSearch"
              component={Screens.New.DestinationSearch}
            />
            <Stack.Screen
              name="TitleSetting"
              component={Screens.New.TitleSetting}
            />
            <Stack.Screen
              name="TodolistSetting"
              component={Screens.New.TodolistSetting}
            />
          </Stack.Group>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Group>
            <Stack.Screen name="TodolistAdd" component={Screens.Todolist.Add} />
            <Stack.Screen
              name="TodolistReorder"
              component={Screens.Todolist.Reorder}
            />
            <Stack.Screen
              name="TodolistDelete"
              component={Screens.Todolist.Delete}
            />
          </Stack.Group>
          <Stack.Screen
            name="ConfirmPassport"
            component={Screens.Confirm.Passport}
          />
          <Stack.Screen
            name="ConfirmFlight"
            component={Screens.Confirm.Flight}
          />
          <Stack.Screen
            name="ConfirmFlightTicket"
            component={Screens.Confirm.FlightTicket}
          />
          <Stack.Screen
            name="AccomodationPlan"
            component={Screens.Accomodation.Plan}
          />
          <Stack.Screen
            name="Accomodation"
            component={Screens.Accomodation.Detail}
          />
          <Stack.Screen
            name="AccomodationNote"
            component={Screens.Accomodation.Note}
          />
          <Stack.Screen
            name="CreateAccomodation"
            component={Screens.Accomodation.Create}
          />
          <Stack.Screen name="TodoCreate" component={Screens.Todo.Create} />
          <Stack.Screen name="TodoEdit" component={Screens.Todo.Edit} />
          <Stack.Screen name="TodoNote" component={Screens.Todo.Note} />
          <Stack.Screen name="TodoTitle" component={Screens.Todo.Title} />
          <Stack.Screen
            name="DepartureAirportSetting"
            component={Screens.Todo.Flight.DepartureAirportSetting}
          />
          <Stack.Screen
            name="ArrivalAirportSetting"
            component={Screens.Todo.Flight.ArrivalAirportSetting}
          />
          <Stack.Screen
            name="DepartureAirportEdit"
            component={Screens.Todo.Flight.DepartureAirportEdit}
          />
          <Stack.Screen
            name="ArrivalAirportEdit"
            component={Screens.Todo.Flight.ArrivalAirportEdit}
          />
          <Stack.Screen
            name="RoundTripSetting"
            component={Screens.Todo.Flight.RoundTripSetting}
          />
          <>
            <Stack.Screen
              name="FullScreenImage"
              component={Screens.Reservation.FullScreenImage}
            />
          </>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<
    ComponentProps<typeof NavigationContainer<AppStackParamList>>
  > {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const {
    themeScheme,
    navigationTheme,
    setThemeContextOverride,
    ThemeProvider: AppThemeProvider,
  } = useThemeProvider()

  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  return (
    <AppThemeProvider value={{themeScheme, setThemeContextOverride}}>
      <ThemeProvider theme={theme}>
        <View style={$outerContainerStyle}>
          <View style={$innerContainerStyle}>
            <GestureHandlerRootViewWrapper>
              <BottomSheetModalProvider>
                <NavigationContainer
                  ref={navigationRef}
                  theme={{
                    ...navigationTheme,
                    colors: {
                      ...navigationTheme.colors,
                      background: 'white',
                    },
                  }}
                  {...props}>
                  <FabProvider>
                    <Screens.ErrorBoundary catchErrors={Config.catchErrors}>
                      <AppStack />
                    </Screens.ErrorBoundary>
                  </FabProvider>
                </NavigationContainer>
              </BottomSheetModalProvider>
            </GestureHandlerRootViewWrapper>
          </View>
        </View>
      </ThemeProvider>
    </AppThemeProvider>
  )
})

const $outerContainerStyle: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  ...(Platform.OS === 'web' ? {} : {}),
}
const $innerContainerStyle: ViewStyle = {
  ...(Platform.OS === 'web'
    ? {
        // width: 480,
        width: '100%',
        // maxWidth: 480,
        flex: 1,
        backgroundColor: 'white',
        boxShadow: '0 0 20px #0000000d',
      }
    : {}),
}
