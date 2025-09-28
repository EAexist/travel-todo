import { types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { AirportModel } from '../Todo'

export const FlightModel = types
  .model('Flight')
  .props({
    flightNumber: types.maybeNull(types.string),
    departureAirport: types.maybeNull(AirportModel),
    arrivalAirport: types.maybeNull(AirportModel),
    departureDateTimeIsoString: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views(item => ({
    get title() {
      return item.departureAirport?.cityName && item.arrivalAirport?.cityName
        ? `${item.departureAirport?.cityName} → ${item.arrivalAirport?.cityName}`
        : item.departureAirport?.airportName && item.arrivalAirport?.airportName
          ? `${item.departureAirport?.airportName} → ${item.arrivalAirport?.airportName}`
          : null
    },
    get flightNumberTitle() {
      return item.flightNumber ? `${item.flightNumber}` : null
    },
  }))
