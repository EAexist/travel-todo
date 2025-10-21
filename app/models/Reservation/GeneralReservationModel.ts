import { types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const GeneralReservationModel = types
    .model('GeneralReservation')
    .props({
        title: types.maybeNull(types.string),
        dateTimeIsoString: types.maybeNull(types.string),
        numberOfClient: types.maybeNull(types.number),
        clientName: types.maybeNull(types.string),
        // clientNames: types.array(types.string),
    })
    .actions(withSetPropAction)
