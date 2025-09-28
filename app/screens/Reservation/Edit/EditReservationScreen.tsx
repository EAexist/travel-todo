import { withReservation } from '@/utils/withReservation'
import { EditReservationScreenBase } from './EditReservationScreenBase'

export const EditReservationScreen = withReservation<'EditReservation'>(
  ({ reservation }) => {
    return (
      <EditReservationScreenBase
        reservation={reservation}
        isBeforeInitialization={false}
      />
    )
  },
)
