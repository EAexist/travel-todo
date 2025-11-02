import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import { api } from '@/services/api'
import { applySnapshot, Instance, SnapshotIn, types } from 'mobx-state-tree'

export const ResourceQuotaStoreModel = types
    .model('ResourceQuota')
    .props({
        maxTrips: types.optional(types.number, 0),
        maxTripDurationDays: types.optional(types.number, 0),
        maxDestinations: types.optional(types.number, 0),
        maxTodos: types.optional(types.number, 0),
        maxReservations: types.optional(types.number, 0),
    })
    .actions(withSetPropAction)
    .views(store => ({}))
    .actions(store => ({
        fetch: async () => {
            return api.getResourceQuota().then(async response => {
                if (response.kind === 'ok') {
                    applySnapshot(store, response.data)
                }
                return { kind: response.kind }
            })
        },
    }))

export interface ResourceQuotaStore
    extends Instance<typeof ResourceQuotaStoreModel> {}
export interface ResourceQuotaStoreSnapshotIn
    extends SnapshotIn<typeof ResourceQuotaStoreModel> {}
