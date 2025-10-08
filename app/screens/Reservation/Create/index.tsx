import { withReservation } from '@/utils/withReservation'
import { ReservationEditScreenBase } from '../Edit/ReservationEditScreenBase'

const CustomReservationCreateListScreen =
  withReservation<'CustomReservationCreate'>(({ reservation }) => {
    return (
      <ReservationEditScreenBase
        reservation={reservation}
        isBeforeInitialization={true}
      />
    )
  })

export const Custom = CustomReservationCreateListScreen
export { ReservationCreateFromTextScreen as FromText } from './ReservationCreateFromTextScreen'
export { ReservationNotFoundFromText as NotFound } from './ReservationNotFoundFromText'
export { ReservationConfirmFromTextScreen as Confirm } from './ReservationConfirmFromTextScreen'
