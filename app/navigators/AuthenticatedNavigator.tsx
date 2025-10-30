/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import * as Screens from '@/screens'
import { EditTripScreen } from '@/screens/EditTrip/EditTripScreen'
import { ReservationCreateScreen } from '@/screens/Reservation/Create/ReservationCreateScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Header, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { MainTabNavigator } from './MainTabNavigator'
import { AuthenticatedStackParamList } from './navigationTypes'
import { BackButton } from '@/components/Header'

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const AuthenticatedStack =
    createNativeStackNavigator<AuthenticatedStackParamList>()

export const AuthenticatedNavigator = observer(function AuthenicatedStack() {
    const {
        theme: { colors },
    } = useTheme()

    return (
        <AuthenticatedStack.Navigator
            screenOptions={{
                header: () => <Header leftComponent={<BackButton />} />,
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
            initialRouteName={'Home'}>
            <AuthenticatedStack.Screen
                name="TripList"
                component={Screens.TripList.List}
            />
            <AuthenticatedStack.Screen
                name="TripDelete"
                component={Screens.TripList.Delete}
            />
            <AuthenticatedStack.Screen
                name="Home"
                component={Screens.CreateTrip.Home}
            />
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen
                    name="DestinationSetting"
                    component={Screens.CreateTrip.DestinationSetting}
                />
                <AuthenticatedStack.Screen
                    name="ScheduleSetting"
                    component={Screens.CreateTrip.ScheduleSetting}
                />
                <AuthenticatedStack.Screen
                    name="DestinationSearch"
                    component={Screens.CreateTrip.DestinationSearch}
                />
                <AuthenticatedStack.Screen
                    name="TitleSetting"
                    component={Screens.CreateTrip.TitleSetting}
                />
                <AuthenticatedStack.Screen
                    name="TodolistSetting"
                    component={Screens.CreateTrip.TodolistSetting}
                />
            </AuthenticatedStack.Group>
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen
                    name="Main"
                    component={MainTabNavigator}
                />
            </AuthenticatedStack.Group>
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen
                    name="EditTrip"
                    component={EditTripScreen}
                />
                <AuthenticatedStack.Screen
                    name="EditTripDestination"
                    component={Screens.EditTrip.EditTripDestination}
                />
                <AuthenticatedStack.Screen
                    name="EditTripSchedule"
                    component={Screens.EditTrip.EditTripSchedule}
                />
                <AuthenticatedStack.Screen
                    name="EditTripTitle"
                    component={Screens.EditTrip.EditTripTitle}
                />
            </AuthenticatedStack.Group>
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen
                    name="TodolistAdd"
                    component={Screens.Todolist.Add}
                />
                <AuthenticatedStack.Screen
                    name="TodolistReorder"
                    component={Screens.Todolist.Reorder}
                />
                <AuthenticatedStack.Screen
                    name="TodolistDelete"
                    component={Screens.Todolist.Delete}
                />
            </AuthenticatedStack.Group>
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen
                    name="ReservationCreate"
                    component={ReservationCreateScreen}
                />
                <AuthenticatedStack.Screen
                    name="Reservation"
                    component={Screens.Reservation.Detail}
                />
                <AuthenticatedStack.Screen
                    name="ReservationCreateFromText"
                    component={Screens.Reservation.Create.FromText}
                />
                <AuthenticatedStack.Screen
                    name="ReservationConfirmFromText"
                    component={Screens.Reservation.Create.Confirm}
                />
                <AuthenticatedStack.Screen
                    name="ReservationNotFoundFromText"
                    component={Screens.Reservation.Create.NotFound}
                />
                <AuthenticatedStack.Screen
                    name="CustomReservationCreate"
                    component={Screens.Reservation.Create.Custom}
                />
                <AuthenticatedStack.Screen
                    name="ReservationEdit"
                    component={Screens.Reservation.Edit}
                />
                <AuthenticatedStack.Screen
                    name="ReservationLinkEdit"
                    component={Screens.Reservation.LinkEdit}
                />
                <AuthenticatedStack.Screen
                    name="ReservationNoteEdit"
                    component={Screens.Reservation.NoteEdit}
                />
                {/* <AuthenticatedStack.Screen
                    name="ReservationEditList"
                    component={Screens.Reservation.EditList}
                /> */}
                <AuthenticatedStack.Screen
                    name="ReservationDelete"
                    component={Screens.Reservation.Delete}
                />
            </AuthenticatedStack.Group>
            <AuthenticatedStack.Screen
                name="ConfirmPassport"
                component={Screens.Confirm.Passport}
            />
            <AuthenticatedStack.Screen
                name="ConfirmVisitJapan"
                component={Screens.Confirm.VisitJapan}
            />
            <AuthenticatedStack.Screen
                name="ConfirmFlight"
                component={Screens.Confirm.Flight}
            />
            <AuthenticatedStack.Screen
                name="ConfirmFlightTicket"
                component={Screens.Confirm.FlightTicket}
            />
            <AuthenticatedStack.Screen
                name="AccomodationPlan"
                component={Screens.Accomodation.Plan}
            />
            <AuthenticatedStack.Screen
                name="Accomodation"
                component={Screens.Accomodation.Detail}
            />
            <AuthenticatedStack.Screen
                name="AccomodationNote"
                component={Screens.Accomodation.Note}
            />
            <AuthenticatedStack.Screen
                name="CreateAccomodation"
                component={Screens.Accomodation.Create}
            />
            <AuthenticatedStack.Screen
                name="CreateCustomTodo"
                component={Screens.Todo.Create.Custom}
            />
            <AuthenticatedStack.Screen
                name="CreateFlightTodo"
                component={Screens.Todo.Create.Flight}
            />
            <AuthenticatedStack.Screen
                name="CreateFlightTicketTodo"
                component={Screens.Todo.Create.FlightTicket}
            />
            <AuthenticatedStack.Screen
                name="TodoEdit"
                component={Screens.Todo.Edit}
            />
            <AuthenticatedStack.Screen
                name="TodoNote"
                component={Screens.Todo.Note}
            />
            <AuthenticatedStack.Screen
                name="DepartureAirportSetting"
                component={Screens.Todo.Flight.DepartureAirportSetting}
            />
            <AuthenticatedStack.Screen
                name="ArrivalAirportSetting"
                component={Screens.Todo.Flight.ArrivalAirportSetting}
            />
            <AuthenticatedStack.Screen
                name="DepartureAirportEdit"
                component={Screens.Todo.Flight.DepartureAirportEdit}
            />
            <AuthenticatedStack.Screen
                name="ArrivalAirportEdit"
                component={Screens.Todo.Flight.ArrivalAirportEdit}
            />
            <AuthenticatedStack.Screen
                name="RoundTripSetting"
                component={Screens.Todo.Flight.RoundTripSetting}
            />
            <AuthenticatedStack.Screen
                name="FullScreenImage"
                component={Screens.Reservation.FullScreenImage}
            />
        </AuthenticatedStack.Navigator>
    )
})
