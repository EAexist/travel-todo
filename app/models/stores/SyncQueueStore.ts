import {api} from '@/services/api'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from '../helpers/withSetPropAction'

export const SyncActionModel = types.model('SyncAction').props({
  operation: types.string,
  data: types.frozen(),
})
export interface SyncAction extends Instance<typeof SyncActionModel> {}

export const SyncQueueStoreModel = types
  .model('SyncQueueStore')
  .props({
    syncQueue: types.array(SyncActionModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    add(data: SyncAction) {
      store.syncQueue.push(data)
    },
  }))

export interface SyncQueueStore extends Instance<typeof SyncQueueStoreModel> {}
export interface SyncQueueStoreSnapshot
  extends SnapshotOut<typeof SyncQueueStoreModel> {}
