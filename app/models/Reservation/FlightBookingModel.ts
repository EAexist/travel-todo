import { types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { AirportModel } from '../Todo'
import { FlightModel } from './FlightModel'

export const FlightBookingModel = FlightModel.named('FlightBooking')
  .props({
    numberOfPassenger: types.maybeNull(types.number),
    passengerNames: types.maybeNull(types.array(types.string)),
  })
  .actions(withSetPropAction)
