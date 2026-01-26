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
        // storage.clear()

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
