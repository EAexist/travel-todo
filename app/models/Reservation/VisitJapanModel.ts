import { types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const VisitJapanModel = types
  .model('VisitJapan')
  .props({
    dateTimeIsoString: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
