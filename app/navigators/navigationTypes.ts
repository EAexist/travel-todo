/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { ReservationCategory } from '@/models/Reservation/Reservation'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
    CompositeScreenProps,
    NavigationContainer,
    NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ComponentProps } from 'react'
import { WebDemoStackParamList } from './WebDemoStackTypes'

export type AppStackParamList = {
    /* Common */
    Loading: {}
    RequireConnection: { title?: string }
    Auth: NavigatorScreenParams<AuthStackParamList>
    App: NavigatorScreenParams<AuthenticatedStackParamList>
    NotFound: {}
    WebDemo?: NavigatorScreenParams<WebDemoStackParamList>
}

/* Auth */
export type AuthStackParamList = {
    Login: {}
    Admin: {}
}

/* Authenticated */
export type AuthenticatedStackParamList = {
    DemoHome: {}
    Home: {}
    TripList: {}
    TripDelete: {}

    /* Main */
    Main: NavigatorScreenParams<MainTabParamList> & TripStackProps

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
    ReservationCreate: TripStackProps & {
        category?: ReservationCategory
    }
    ReservationCreateFromText: TripStackProps & {
        category?: ReservationCategory
    }
    ReservationConfirmFromText: TripStackProps & { reservationIdList: string[] }
    ReservationNotFoundFromText: TripStackProps
    FullScreenImage: TripStackProps & {
        reservationId: string
        localAppStorageFileUri: string
    }
} & TodoAuthenticatedStackParamList &
    ReservationAuthenticatedStackParamList

export type ReservationAuthenticatedStackParamList = {
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
export type TodoAuthenticatedStackParamList = {
    /* Confirm */
    //   ConfirmReservationTodo: TodoStackProps
    ConfirmPassport: TodoStackProps
    ConfirmVisitJapan: TodoStackProps
    ConfirmFlight: TodoStackProps
    ConfirmFlightTicket: TodoStackProps

    /* Create Todo */
    CreateCustomTodo: FlightSettingStackProps & { isInitializing: boolean }
    CreateFlightTodo: FlightSettingStackProps & { isInitializing: boolean }
    CreateFlightTicketTodo: FlightSettingStackProps & {
        isInitializing: boolean
    }

    /* Edit Todo */
    TodoNote: TodoStackProps
    TodoEdit: TodoStackProps

    /* Flight */
    DepartureAirportSetting: FlightSettingStackProps
    ArrivalAirportSetting: FlightSettingStackProps
    DepartureAirportEdit: FlightSettingStackProps
    ArrivalAirportEdit: FlightSettingStackProps
    RoundTripSetting: FlightSettingStackProps
}

export type MainTabParamList = {
    TripDashboard: TripStackProps
    Todolist: TripStackProps
    ReservationList: TripStackProps
}

export type TripStackProps = { tripId: string }
export type TodoStackProps = TripStackProps & { todoId: string }
export type ReservationStackProps = TripStackProps & { reservationId: string }

export type FlightSettingStackProps = TodoStackProps & {
    callerName: 'TodolistSetting' | 'TodolistAdd'
}

export type AppStackScreenProps<T extends keyof AppStackParamList> =
    NativeStackScreenProps<AppStackParamList, T>

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>

export type AuthenticatedStackScreenProps<
    T extends keyof AuthenticatedStackParamList,
> = NativeStackScreenProps<AuthenticatedStackParamList, T>
export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        AuthenticatedStackScreenProps<keyof AuthenticatedStackParamList>
    >

export interface NavigationProps
    extends Partial<
        ComponentProps<typeof NavigationContainer<AppStackParamList>>
    > { }
