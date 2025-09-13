import { SnapshotOut, types } from 'mobx-state-tree'

export const IconModel = types.model('Icon').props({
  name: types.string,
  type: types.optional(types.string, 'tossface'),
})

export interface Icon extends Partial<SnapshotOut<typeof IconModel>> {}
