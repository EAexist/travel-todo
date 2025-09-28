import { useStores, useTripStore } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import {
  AppStackParamList,
  AppStackScreenProps,
  ReservationAppStackParamList,
} from '@/navigators'
import { FC } from 'react'

export interface WithReservationProps<
  T extends keyof ReservationAppStackParamList,
> {
  reservation: Reservation
  params: Readonly<AppStackParamList[T]>
}

export const withReservation = <T extends keyof ReservationAppStackParamList>(
  WrappedComponent: FC<WithReservationProps<T>>,
) => {
  const Component: FC<AppStackScreenProps<T>> = ({ route: { params } }) => {
    const { reservationStore } = useStores()
    const reservation = params?.reservationId
      ? reservationStore.reservation.get(params?.reservationId)
      : undefined
    return !!reservation && !!params ? (
      <WrappedComponent reservation={reservation} params={params} />
    ) : (
      <></>
    )
  }
  return Component
}

// export const withFlightReservation = <T extends keyof ReservationAppStackParamList>(
//   WrappedComponent: FC<{
//     reservation: FlightReservation
//     params: Readonly<AppStackParamList[T]>
//   }>,
// ) => {
//   const Component: FC<AppStackScreenProps<T>> = ({route: {params}}) => {
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
