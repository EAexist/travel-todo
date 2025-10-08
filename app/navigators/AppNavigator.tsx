/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { GestureHandlerRootViewWrapper } from '@/components/BottomSheetModal'
import { FabProvider } from '@/components/Fab'
import { BackButton } from '@/components/Header'
import { ReservationCategory } from '@/models/Reservation/Reservation'
import theme from '@/rneui/theme'
import * as Screens from '@/screens'
import { EditTripScreen } from '@/screens/EditTrip/EditTripScreen'
import { LoginScreen } from '@/screens/Login/LoginScreen'
import { ReservationCreateScreen } from '@/screens/Reservation/Create/ReservationCreateScreen'
import { TripListScreen } from '@/screens/TripListScreen'
import { ApiStatusProvider } from '@/utils/useApiStatus'
import { useThemeProvider } from '@/utils/useAppTheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { Header, ThemeProvider, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { ComponentProps } from 'react'
import { Platform, View, ViewStyle } from 'react-native'
import Config from '../config'
import { useStores } from '../models'
import { MainTabNavigator, MainTabParamList } from './MainTabNavigator'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'

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
export type TripStackProps = { tripId: string }
export type TodoStackProps = TripStackProps & { todoId: string }
export type ReservationStackProps = TripStackProps & { reservationId: string }

export type FlightSettingStackProps = TodoStackProps & {
  callerName: 'TodolistSetting' | 'TodolistAdd'
}

export type AppStackParamList = {
  /* Common */
  Loading: { pendingIndicatorTitle?: string[]; onProblem?: () => void }
  RequireConnection: { title?: string }

  Login: {}
  Welcome: {}
  TripList: {}

  /* Eidt Trip */
  EditTrip: TripStackProps
  EditTripDestination: TripStackProps
  EditTripSchedule: TripStackProps
  EditTripTitle: TripStackProps

  /* Create Trip */
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
  AccomodationPlan: TripStackProps & { accomodationId: string }
  Accomodation: TripStackProps & { accomodationId: string }
  AccomodationNote: TripStackProps & { accomodationId: string }
  CreateAccomodation: TripStackProps

  /* Reservation */
  ReservationEditList: TripStackProps
  ReservationDelete: TripStackProps
  ReservationCreate: TripStackProps & { defaultCategory?: ReservationCategory }
  ReservationCreateFromText: TripStackProps
  ReservationConfirmFromText: TripStackProps & { reservationIdList: string[] }
  ReservationNotFoundFromText: TripStackProps
  FullScreenImage: TripStackProps & {
    reservationId: string
    localAppStorageFileUri: string
  }

  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
} & TodoAppStackParamList &
  ReservationAppStackParamList

export type ReservationAppStackParamList = {
  /* Create Reservation */
  Reservation: ReservationStackProps
  CustomReservationCreate: ReservationStackProps
  ReservationEdit: ReservationStackProps
  ReservationLinkEdit: ReservationStackProps
  ReservationNoteEdit: ReservationStackProps
  //   CreateFlightBookingReservation: ReservationStackProps & {
  //     isInitializing: boolean
  //   }
  //   CreateFlightTicketReservation: ReservationStackProps & {
  //     isInitializing: boolean
  //   }

  /* Edit Reservation */
  //   EditReservationTitle: ReservationStackProps
  //   ReservationLink: ReservationStackProps
  //   EditReservation: ReservationStackProps
}
export type TodoAppStackParamList = {
  /* Confirm */
  //   ConfirmReservationTodo: TodoStackProps
  ConfirmPassport: TodoStackProps
  ConfirmFlight: TodoStackProps
  ConfirmFlightTicket: TodoStackProps

  /* Create Todo */
  CreateCustomTodo: FlightSettingStackProps & { isInitializing: boolean }
  CreateFlightTodo: FlightSettingStackProps & { isInitializing: boolean }
  CreateFlightTicketTodo: FlightSettingStackProps & { isInitializing: boolean }

  /* Edit Todo */
  TodoTitle: TodoStackProps
  TodoNote: TodoStackProps
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
    userStore: { isAuthenticated },
  } = useStores()

  const {
    theme: { colors },
  } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <Header
            leftComponent={<BackButton />}
            // containerStyle={{ marginTop: '8%' }}
          />
        ),
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? 'Welcome' : 'Login'}>
      <Stack.Screen name="TripList" component={TripListScreen} />
      <Stack.Screen name="Loading" component={Screens.Loading} />
      <Stack.Screen
        name="RequireConnection"
        component={Screens.RequireConnection}
      />
      <Stack.Screen name="Welcome" component={Screens.CreateTrip.Welcome} />
      <Stack.Group>
        <Stack.Screen
          name="DestinationSetting"
          component={Screens.CreateTrip.DestinationSetting}
        />
        <Stack.Screen
          name="ScheduleSetting"
          component={Screens.CreateTrip.ScheduleSetting}
        />
        <Stack.Screen
          name="DestinationSearch"
          component={Screens.CreateTrip.DestinationSearch}
        />
        <Stack.Screen
          name="TitleSetting"
          component={Screens.CreateTrip.TitleSetting}
        />
        <Stack.Screen
          name="TodolistSetting"
          component={Screens.CreateTrip.TodolistSetting}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="EditTrip" component={EditTripScreen} />
        <Stack.Screen
          name="EditTripDestination"
          component={Screens.EditTrip.EditTripDestination}
        />
        <Stack.Screen
          name="EditTripSchedule"
          component={Screens.EditTrip.EditTripSchedule}
        />
        <Stack.Screen
          name="EditTripTitle"
          component={Screens.EditTrip.EditTripTitle}
        />
      </Stack.Group>
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
      <Stack.Group>
        <Stack.Screen
          name="ReservationCreate"
          component={ReservationCreateScreen}
        />
        <Stack.Screen
          name="Reservation"
          component={Screens.Reservation.Detail}
        />
        <Stack.Screen
          name="ReservationCreateFromText"
          component={Screens.Reservation.Create.FromText}
        />
        <Stack.Screen
          name="ReservationConfirmFromText"
          component={Screens.Reservation.Create.Confirm}
        />
        <Stack.Screen
          name="ReservationNotFoundFromText"
          component={Screens.Reservation.Create.NotFound}
        />
        <Stack.Screen
          name="CustomReservationCreate"
          component={Screens.Reservation.Create.Custom}
        />
        <Stack.Screen
          name="ReservationEdit"
          component={Screens.Reservation.Edit}
        />
        <Stack.Screen
          name="ReservationLinkEdit"
          component={Screens.Reservation.LinkEdit}
        />
        <Stack.Screen
          name="ReservationNoteEdit"
          component={Screens.Reservation.NoteEdit}
        />
        <Stack.Screen
          name="ReservationEditList"
          component={Screens.Reservation.EditList}
        />
        <Stack.Screen
          name="ReservationDelete"
          component={Screens.Reservation.Delete}
        />
      </Stack.Group>
      <Stack.Screen
        name="ConfirmPassport"
        component={Screens.Confirm.Passport}
      />
      <Stack.Screen name="ConfirmFlight" component={Screens.Confirm.Flight} />
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
      <Stack.Screen
        name="CreateCustomTodo"
        component={Screens.Todo.Create.Custom}
      />
      <Stack.Screen
        name="CreateFlightTodo"
        component={Screens.Todo.Create.Flight}
      />
      <Stack.Screen
        name="CreateFlightTicketTodo"
        component={Screens.Todo.Create.FlightTicket}
      />
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
      <Stack.Screen
        name="FullScreenImage"
        component={Screens.Reservation.FullScreenImage}
      />
      {/* Loading
      <Stack.Screen name="Loading" component={Screens.Loading} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Flight" component={LoginScreen} /> */}
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
    <AppThemeProvider value={{ themeScheme, setThemeContextOverride }}>
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
                  <ApiStatusProvider>
                    <FabProvider>
                      <Screens.ErrorBoundary catchErrors={Config.catchErrors}>
                        <AppStack />
                      </Screens.ErrorBoundary>
                    </FabProvider>
                  </ApiStatusProvider>
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
        // backgroundColor: 'red',
        // boxShadow: '0 0 20px #0000000d',
      }
    : {}),
}
