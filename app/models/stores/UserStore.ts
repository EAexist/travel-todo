import { api } from '@/services/api'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import { flow, Instance, SnapshotIn, types } from 'mobx-state-tree'
import { withDbSync } from '../helpers/withDbSync'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
    TripStoreModel,
    TripStoreSnapshot,
    TripSummary,
    TripSummaryModel,
} from './TripStore'

export const UserStoreModel = types
    .model('UserStore')
    .props({
        id: types.identifier,
        nickname: types.maybeNull(types.string),
        activeTrip: types.maybeNull(TripStoreModel),
        tripSummary: types.array(TripSummaryModel),
    })
    .actions(withSetPropAction)
    .actions((self) => ({
        setUser(user: UserStoreSnapshotIn) {
            self.setProp('id', user.id)
            self.setProp('nickname', user.nickname)
            self.setProp('tripSummary', user.tripSummary || [])
        },
        setTrip(trip: TripStoreSnapshot | null) {
            self.setProp('activeTrip', trip)
        },
        setTripSummary(tripSummary: TripSummary[]) {
            self.tripSummary.clear()
            self.tripSummary.push(...tripSummary)
        },
    }))
    .actions((self) => ({
        // setAuthToken(value?: string) {
        //   self.authToken = value
        // },
        // fetchUserAccount: async () => {
        //     if ((await sync_db()) > 0) {
        //         const response = await api.getUserAccount()
        //         if (response.kind === 'ok') {
        //             console.log(
        //                 `[UserStore.fetchUserAccount] response=${JSON.stringify(response.data)}`,
        //             )
        //             self.setUser(response.data)
        //         } else {
        //             console.error(
        //                 `Error fetching User: ${JSON.stringify(response)}`,
        //             )
        //         }
        //     }
        // },
        fetchActiveTrip: flow(function* () {
            return yield withDbSync(self, async () => {

                console.log(`[UserStore.fetchActiveTrip]`)

                const response = await api.getActiveTrip(self.id)
                if (response.kind === 'ok') {
                    console.log(
                        `[UserStore.fetchActiveTrip] ok, response.data=${JSON.stringify(response.data)}`,
                    )
                    self.setTrip(response.data)
                } else {
                    console.error(
                        `Error fetching Trip: ${JSON.stringify(response)}`,
                    )
                }
                return { kind: response.kind }
            })
        }),
        fetchTripSummary: flow(function* () {
            return yield withDbSync(self, async () => {

                const response = await api.getTripSummary(self.id)

                if (response.kind === 'ok') {
                    console.log(
                        `[UserStore.fetchTripSummary] ok, response.data=${JSON.stringify(response.data)}`,
                    )
                    self.setTripSummary(response.data.tripSummary)
                } else {
                    console.error(
                        `Error fetching User: ${JSON.stringify(response)}`,
                    )
                }
                return { kind: response.kind }
            })
        })
    }))
    .actions((self) => ({
        setActiveTrip: flow(function* (tripId: string) {
            return yield withDbSync(self, async () => {

                console.log('[UserStore.setActiveTrip]')

                return api.setActiveTrip(self.id, tripId).then(async response => {
                    console.log(
                        `[UserStore.setActiveTrip] response=${JSON.stringify(response)}`,
                    )
                    if (response.kind === 'ok') {
                        self.setTrip(
                            response.data,
                            // TripStoreModel.create(response.data),
                        )
                    }
                    return { kind: response.kind }
                })
            })
        })
    }))
    .actions((self) => ({
        createTrip: flow(function* () {
            return yield withDbSync(self, async () => {

                console.log('[UserStore.createTrip]')

                return api.createTrip({ userId: self.id }).then(async response => {
                    console.log(
                        `[UserStore.createTrip] response=${JSON.stringify(response)}`,
                    )
                    if (response.kind === 'ok') {
                        self.setProp('tripSummary', response.data.tripSummary)
                        return self.fetchActiveTrip({}).then(response => {
                            return response
                        })
                    }
                    return response
                })
            })
        }),
        deleteTrip: (tripId: string) => {
            console.log('[UserStore.deleteTrip]')
            const trip = self.tripSummary.find(t => t.id === tripId)
            if (trip) {
                self.tripSummary.remove(trip)
                enqueueAction(APIAction.DELETE_TRIP, { tripId })
            }
        },
    }))
    .views((self) => ({
        get currentTrip() {
            return self.tripSummary[self.tripSummary.length - 1]
        },
        get otherTripSummaryList() {
            return [
                ...self.tripSummary
                    .filter(t => t.id !== self.activeTrip?.id)
                    .sort(),
            ].sort(
                (
                    { createDateIsoString: createDateIsoStringA },
                    { createDateIsoString: createDateIsoStringB },
                ) => {
                    const dateA = new Date(createDateIsoStringA)
                    const dateB = new Date(createDateIsoStringB)
                    return dateB.getTime() - dateA.getTime()
                },
            )
        },
        get activeTripSumamry() {
            return self.tripSummary.filter(
                t => t.id === self.activeTrip?.id,
            )[0]
        },
    }))

export interface UserStore extends Instance<typeof UserStoreModel> { }
export interface UserStoreSnapshotIn
    extends SnapshotIn<typeof UserStoreModel> { }
