/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { RootStore, RootStoreSnapshot } from '@/models/stores/RootStore'
import { applySnapshot, IDisposer, onSnapshot } from 'mobx-state-tree'
import * as storage from '../../utils/storage'
import { logRootStore } from './autoruns'

/**
 * The key we'll be saving our state as within async storage.
 */
export const ROOT_STATE_STORAGE_KEY = 'root-v1'

/**
 * Setup the root state.
 */
let _disposer: IDisposer | undefined
export async function setupRootStore(rootStore: RootStore) {
    let restoredState: RootStoreSnapshot | undefined | null

    try {
        storage.clear()

        /**
         * !!Test Only
         * Create a sample state of logined user and initialized trip
         */
        // console.log('[setupRootStore]')
        // storage.save(
        //   ROOT_STATE_STORAGE_KEY,
        //   RootStoreModel.create({
        //     userStore: UserStoreModel.create({
        //       id: 'mocked-logged-in-user_id',
        //       tripSummary: [
        //         TripSummaryModel.create({
        //           id: 'mocked-created-trip_id',
        //         }),
        //       ],
        //     }),
        //     tripStore: TripStoreModel.create({
        //       id: 'mocked-created-trip_id',
        //       isInitialized: true,
        //       title: '여행',
        //       startDateIsoString: '2025-09-25 00:00:00',
        //       endDateIsoString: '2025-10-06 00:00:00',
        //       destination: [
        //         DestinationModel.create({
        //           description: '',
        //           iso2DigitNationCode: 'JP',
        //           title: '교토',
        //           region: '간사이',
        //         }),
        //       ],
        //     }),
        //     reservationStore: ReservationStoreModel.create({
        //       tripStore: 'mocked-created-trip_id',
        //       reservation: {
        //         'mocked-reservation-id_0': ReservationModel.create({
        //           id: 'mocked-reservation-id_0',
        //           accomodation: AccomodationModel.create({
        //             checkinDateIsoString: '2025-09-25 00:00:00',
        //             checkoutDateIsoString: '2025-09-27 00:00:00',
        //           }),
        //         }),
        //         'mocked-reservation-id_1': ReservationModel.create({
        //           id: 'mocked-reservation-id_1',
        //           accomodation: AccomodationModel.create({
        //             checkinDateIsoString: '2025-09-28 00:00:00',
        //             checkoutDateIsoString: '2025-10-01 00:00:00',
        //           }),
        //         }),
        //       },
        //     }),
        //   }),
        // )

        // load the last known state from AsyncStorage
        restoredState = await storage.load(ROOT_STATE_STORAGE_KEY)
        if (!!restoredState) {
            applySnapshot(rootStore, restoredState)
        }

        // if(restoredState=={})
    } catch (e) {
        // if there's any problems loading, then inform the dev what happened
        if (__DEV__) {
            if (e instanceof Error) console.error(e.message)
        }
    }

    // stop tracking state changes if we've already setup
    if (_disposer) _disposer()

    // track changes & save to AsyncStorage
    _disposer = onSnapshot(rootStore, snapshot =>
        storage.save(ROOT_STATE_STORAGE_KEY, snapshot),
    )

    const unsubscribe = () => {
        _disposer?.()
        _disposer = undefined
    }

    /* Autorun */
    logRootStore(rootStore)

    return { rootStore, restoredState, unsubscribe }
}
