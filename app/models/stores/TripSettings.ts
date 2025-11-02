import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'

export const TripSettingsModel = types
    .model('Settings')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        isTripMode: types.optional(types.boolean, false),
        doSortReservationsByCategory: types.optional(types.boolean, false),
        doHideCompletedTodo: types.optional(types.boolean, true),
        doHideCompletedReservation: types.optional(types.boolean, true),
        doShowSupplyTodosFirst: types.optional(types.boolean, false),
        categoryKeyToIndex: types.map(types.number),
    })
    .actions(withSetPropAction)
    .views(store => ({}))
    .actions(store => ({
        setDoSortReservationsByCategory(value: boolean) {
            store.setProp('doSortReservationsByCategory', value)
        },
        setDoShowSupplyTodosFirst(value: boolean) {
            store.setProp('doShowSupplyTodosFirst', value)
        },
        toggleDoHideCompletedReservation() {
            store.setProp(
                'doHideCompletedReservation',
                !store.doHideCompletedReservation,
            )
        },
        toggleDoHideCompletedTodo() {
            store.setProp('doHideCompletedTodo', !store.doHideCompletedTodo)
        },
        toggleDoShowSupplyTodosFirst() {
            store.setProp(
                'doShowSupplyTodosFirst',
                !store.doShowSupplyTodosFirst,
            )
        },
    }))

export interface TripSettings extends Instance<typeof TripSettingsModel> {}
export interface TripSettingsSnapshot
    extends SnapshotOut<typeof TripSettingsModel> {}
