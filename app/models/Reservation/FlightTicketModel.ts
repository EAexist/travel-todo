import { types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { AirportModel } from '../Todo'
import { FlightModel } from './FlightModel'

export const FlightTicketModel = FlightModel.named('FlightTicket')
  .props({
    arrivalAirport: types.maybeNull(AirportModel),
    passengerName: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
