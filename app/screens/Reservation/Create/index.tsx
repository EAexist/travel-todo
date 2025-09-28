import { withReservation } from '@/utils/withReservation'
import { EditReservationScreenBase } from '../Edit/EditReservationScreenBase'

const CreateCustomReservationListScreen =
  withReservation<'CreateCustomReservation'>(({ reservation }) => {
    return (
      <EditReservationScreenBase
        reservation={reservation}
        isBeforeInitialization={true}
      />
    )
  })

export const Custom = CreateCustomReservationListScreen
export { CreateReservationFromTextScreen as FromText } from './CreateReservationFromTextScreen'
export { NotFoundReservationFromText as NotFound } from './NotFoundReservationFromText'
export { ConfirmReservationFromTextScreen as Confirm } from './ConfirmReservationFromTextScreen'
