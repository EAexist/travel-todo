import { useReservationStore } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import {
    AuthenticatedStackParamList,
    AuthenticatedStackScreenProps,
    ReservationAuthenticatedStackParamList,
} from '@/navigators'
import { FC } from 'react'

export interface WithReservationProps<
    T extends keyof ReservationAuthenticatedStackParamList,
> {
    reservation: Reservation
    params: Readonly<AuthenticatedStackParamList[T]>
}

export const withReservation = <
    T extends keyof ReservationAuthenticatedStackParamList,
>(
    WrappedComponent: FC<WithReservationProps<T>>,
) => {
    const Component: FC<AuthenticatedStackScreenProps<T>> = ({
        route: { params },
    }) => {
        const reservationStore = useReservationStore()
        const reservation = params?.reservationId
            ? reservationStore.reservations.get(params?.reservationId)
            : undefined
        return !!reservation && !!params ? (
            <WrappedComponent reservation={reservation} params={params} />
        ) : (
            <></>
        )
    }
    return Component
}

// export const withFlightReservation = <T extends keyof ReservationAuthenticatedStackParamList>(
//   WrappedComponent: FC<{
//     reservation: FlightReservation
//     params: Readonly<AuthenticatedStackParamList[T]>
//   }>,
// ) => {
//   const Component: FC<AuthenticatedStackScreenProps<T>> = ({route: {params}}) => {
//     const tripStore = useTripStore()
//     const reservation = params?.reservationId
//       ? tripStore.reservationMap.get(params?.reservationId)
//       : undefined
//     return !!reservation && !!params ? (
//       <WrappedComponent reservation={reservation as FlightReservation} params={params} />
//     ) : (
//       <></>
//     )
//   }
//   return Component
// }
