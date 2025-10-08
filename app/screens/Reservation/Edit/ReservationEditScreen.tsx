import { withReservation } from '@/utils/withReservation'
import { ReservationEditScreenBase } from './ReservationEditScreenBase'

export const ReservationEditScreen = withReservation<'ReservationEdit'>(
  ({ reservation }) => {
    return (
      <ReservationEditScreenBase
        reservation={reservation}
        isBeforeInitialization={false}
      />
    )
  },
)
