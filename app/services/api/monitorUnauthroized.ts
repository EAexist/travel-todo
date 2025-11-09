import { useStores } from '@/models'
import { loadString, remove } from '@/utils/storage'
import { ApiResponse, ApisauceInstance } from 'apisauce'
import { useCallback, useEffect } from 'react'
import { Platform } from 'react-native'
import { api } from './api'

let isRenewing = false // Flag to ensure only one renewal request runs at a time
const failedQueue: Array<{
    resolve: (value: ApiResponse<any>) => void
    reject: (reason?: any) => void
    config: any // The original request config
}> = []

const renewSession = async (): Promise<boolean> => {
    const idToken = loadString('googleIdToken')
    if (idToken) {
        return api.adminGoogleLoginWithIdToken(idToken).then(response => {
            if (response.kind === 'ok') {
                console.log(`[loginToServerWeb] Successfully renewed Session.`)
                return true
            } else {
                remove('googldIdToken')
                return false
            }
        })
    } else {
        return false
    }
}

/**
 * Attaches the monitor that handles 401 and queues requests.
 */
export const setupRenewSessionAndRetryMonitor = (
    apiInstance: ApisauceInstance,
    handleFail: () => void,
): void => {
    apiInstance.addMonitor(async response => {
        // 1. Check for 401 Unauthorized
        if (response.status === 401) {
            const originalRequest = response.config

            // 2. Check if the original request was the renewal request itself to avoid infinite loop
            if (originalRequest?.url?.includes('/auth')) {
                handleFail()
                return
            }

            // 3. Pause the promise chain and queue the request
            const retryPromise = new Promise<ApiResponse<any>>(
                (resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                        config: originalRequest,
                    })
                },
            )

            // 4. Start the renewal process if it's not already running
            if (!isRenewing) {
                isRenewing = true

                const renewalSuccess = await renewSession()

                isRenewing = false

                if (renewalSuccess) {
                    // 5. If renewal succeeds, retry all queued requests
                    console.log(
                        'Session renewed successfully. Retrying queued requests...',
                    )

                    failedQueue.forEach(async promise => {
                        try {
                            // Retry the original request
                            const newResponse = await api.apisauce.any(
                                promise.config,
                            )
                            promise.resolve(newResponse)
                        } catch (retryError) {
                            promise.reject(retryError)
                        }
                    })
                    failedQueue.length = 0 // Clear the queue
                } else {
                    // 6. If renewal fails, clear the queue and log out
                    console.error('Session renewal failed. Logging out user.')
                    failedQueue.forEach(promise => promise.reject())
                    failedQueue.length = 0
                    handleFail()
                }
            }

            // Return the new promise from the queue to the original caller
            return retryPromise
        }
    })
}

export const useRenewSessionAndRetryMonitor = () => {
    const rootStore = useStores()
    const handleSessionRenewalFail = useCallback((): void => {
        console.log('Handling Session Renewal Fail. Logout.')
        rootStore.logout()
    }, [])

    useEffect(() => {
        if (Platform.OS === 'web') {
            setupRenewSessionAndRetryMonitor(
                api.apisauce,
                handleSessionRenewalFail,
            )
            if (rootStore.isAuthenticated && rootStore.userStore) {
                api.getUserAccount(rootStore.userStore.id).then(response => {
                    if (response.kind! === 'ok') {
                        handleSessionRenewalFail()
                    }
                })
            }
        }
    }, [handleSessionRenewalFail])
}
