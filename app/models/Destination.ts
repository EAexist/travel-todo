import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'
import {v4 as uuidv4} from 'uuid'

export const DestinationModel = types
  .model('Destination')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    description: types.string,
    countryISO: types.string,
    title: types.string,
    region: types.string,
  })
  .actions(withSetPropAction)
  .views(item => ({
    get parsedTitleAndSubtitle() {
      const defaultValue = {title: item.title?.trim(), subtitle: ''}

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return {title: titleMatches[1], subtitle: titleMatches[2]}
    },
  }))

export interface Destination extends Instance<typeof DestinationModel> {}
export interface DestinationSnapshotOut
  extends SnapshotOut<typeof DestinationModel> {}
export interface DestinationSnapshotIn
  extends SnapshotIn<typeof DestinationModel> {}
export interface DestinationContent extends Omit<DestinationSnapshotIn, 'id'> {}
