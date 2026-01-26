import {
    api,
    ApiResult,
    CreateDestinationProps,
    CreateReservationProps,
    CreateTodoProps,
    DeleteDestinationProps,
    DeleteReservationProps,
    DeleteTodoProps,
    DeleteTripProps,
    PatchReservationProps,
    PatchTodoProps,
    TripPatchDTO,
} from '@/services/api'
import { GeneralApiProblem } from '@/services/api/apiProblem'
import { load, save } from '@/utils/storage'
import * as BackgroundTask from 'expo-background-task'
import * as TaskManager from 'expo-task-manager'
import { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

export enum APIAction {
    PATCH_TRIP,
    DELETE_TRIP,
    CREATE_TODO,
    PATCH_TODO,
    DELETE_TODO,
    CREATE_DESTINATION,
    DELETE_DESTINATION,
    CREATE_RESERVATION,
    PATCH_RESERVATION,
    DELETE_RESERVATION,
    //   CREATE_ACCOMODATION,
    //   PATCH_ACCOMODATION,
    //   DELETE_ACCOMODATION,
}

interface AsyncAPIWriteAction {
    action: APIAction
    data: unknown
}
interface AsyncAPIWriteActionWithSync extends AsyncAPIWriteAction {
    isSynced: boolean
}

/**
 * The key we'll be saving our background task queue as within async storage.
 */
const BACKGROUND_TASK_IDENTIFIER = 'background-task'
export const BACKROUND_TASK_QUEUE_STORAGE_KEY = 'background-task-queue'

/**
 * Get Queue
 *
 * @param key The key to fetch.
 */
export function getAPIActionQueue(): AsyncAPIWriteActionWithSync[] | null {
    try {
        return load<AsyncAPIWriteActionWithSync[]>(
            BACKROUND_TASK_QUEUE_STORAGE_KEY,
        )
    } catch {
        return null
    }
}

/**
 * Enqueue a API write action.
 *
 * @param key The key to fetch.
 */

export const enqueueAction = async (
    action: APIAction,
    data:
        | TripPatchDTO
        | DeleteTripProps
        | CreateTodoProps
        | PatchTodoProps
        | DeleteTodoProps
        | CreateDestinationProps
        | DeleteDestinationProps
        | CreateReservationProps
        | PatchReservationProps
        | DeleteReservationProps,
) => {
    try {
        return runAPIAction({ action, data }).then(result => {
            console.log(
                `[enqueueAction] immediate call, action=${action} data=${JSON.stringify(data)} result=${JSON.stringify(result)}`,
            )
            if (result && result.kind == 'ok') {
                return true
            } else {
                const queue = getAPIActionQueue() || []
                queue.push({
                    action,
                    data,
                    isSynced: false,
                } as AsyncAPIWriteActionWithSync)
                const isSaved = save(BACKROUND_TASK_QUEUE_STORAGE_KEY, queue)
                if (isSaved) {
                    registerBackgroundTaskAsync()
                }
                return isSaved
            }
        })
    } catch {
        return false
    }
}

// class ActionQueueApi {
//   /* Todo CRUD */
//   createTodo(props: CreateTodoProps) {
//     enqueueAction(APIAction.CREATE_TODO, props)
//   }
//   patchTodo(props: CreateTodoProps) {
//     enqueueAction(APIAction.PATCH_TODO, props)
//   }
//   deleteTodo(props: DeleteTodoProps) {
//     enqueueAction(APIAction.DELETE_TODO, props)
//   }
// }

// export const actionQueueApi = new ActionQueueApi()

// Register and create the task so that it is available also when the background task screen
// (a React component defined later in this example) is not visible.
// Note: This needs to be called in the global scope, not in a React component.

const runAPIAction = async ({ action, data }: AsyncAPIWriteAction) => {
    let result: ApiResult<any>
    switch (action) {
        /* Trip CRUD */
        case APIAction.PATCH_TRIP:
            result = await api.patchTrip(data as TripPatchDTO)
            break
        case APIAction.DELETE_TRIP:
            result = await api.deleteTrip(data as DeleteTripProps)

            /* Todo CRUD */
            break
        case APIAction.CREATE_TODO:
            result = await api.createTodo(data as CreateTodoProps)
            break
        case APIAction.PATCH_TODO:
            result = await api.patchTodo(data as PatchTodoProps)
            break
        case APIAction.DELETE_TODO:
            result = await api.deleteTodo(data as DeleteTodoProps)

            /* Destination CRUD */
            break
        case APIAction.CREATE_DESTINATION:
            result = await api.createDestination(data as CreateDestinationProps)
            break
        case APIAction.DELETE_DESTINATION:
            result = await api.deleteDestination(data as DeleteDestinationProps)

            /* Reservation CRUD */
            break
        case APIAction.CREATE_RESERVATION:
            result = await api.createReservation(data as CreateReservationProps)
            break
        case APIAction.PATCH_RESERVATION:
            result = await api.patchReservation(data as PatchReservationProps)
            break
        case APIAction.DELETE_RESERVATION:
            result = await api.deleteReservation(data as DeleteReservationProps)

        /* Accomodation CRUD */
        //   case APIAction.CREATE_ACCOMODATION:
        //     api.createAccomodation(data as string)
        //   case APIAction.PATCH_ACCOMODATION:
        //     api.patchAccomodation(data as CreateAccomodationProps)
        //   case APIAction.DELETE_ACCOMODATION:
        //     api.deleteAccomodation(data as DeleteAccomodationProps)

        default:
            return
    }
    return result
}
type GenericCallback<T> = ((args: T) => any) | (() => any)

export function withDbSync<R>(callbackFn: () => R): () => Promise<R>
export function withDbSync<T, R>(callbackFn: (args: T) => R): () => Promise<R>
export function withDbSync<T, R>(callbackFn: any) {
    return callbackFn.length > 0
        ? async (args: T) => {
            const syncResult = await sync_db()
            if (syncResult == true) {
                return (callbackFn as (args: T) => any)(args)
            } else {
                return syncResult
            }
        }
        : async () => {
            const syncResult = await sync_db()
            if (syncResult == true) {
                return (callbackFn as () => any)()
            } else {
                return syncResult
            }
        }
}

export const sync_db = async () => {
    console.log(`[sync_db]`)
    const apiActionQueue = getAPIActionQueue() || []

    let apiProblem: GeneralApiProblem = { kind: 'unknown', temporary: true }

    for (const actionItem of apiActionQueue) {
        const { action, data } = actionItem
        const result = await runAPIAction({ action, data })
        if (result && result.kind == 'ok') actionItem.isSynced = true
        else {
            if (result) {
                apiProblem = result
            }
            break
        }
    }

    const newQueue = apiActionQueue.filter(item => !item.isSynced)
    console.log(
        `[sync_db] Completed: ${apiActionQueue.length - newQueue.length}/${apiActionQueue.length} Actions synced`,
    )
    save(BACKROUND_TASK_QUEUE_STORAGE_KEY, newQueue)

    if (newQueue.length == 0) {
        return true
    } else {
        return apiProblem
    }
}

export const backgroundTask_sync_db = async () => {
    try {
        const now = Date.now()
        console.log(
            `Got background task call at date: ${new Date(now).toISOString()}`,
        )
        const apiActionQueue = getAPIActionQueue() || []

        for (const actionItem of apiActionQueue) {
            const { action, data } = actionItem
            const result = await runAPIAction({ action, data })
            if (result && result.kind == 'ok') actionItem.isSynced = true
            else break
        }

        const newQueue = apiActionQueue.filter(item => !item.isSynced)
        console.log(
            `Background Task Completed: ${apiActionQueue.length - newQueue.length}/${apiActionQueue.length} Actions synced`,
        )
        save(BACKROUND_TASK_QUEUE_STORAGE_KEY, newQueue)
    } catch (error) {
        console.error('Failed to execute the background task:', error)
        return BackgroundTask.BackgroundTaskResult.Failed
    }
    return BackgroundTask.BackgroundTaskResult.Success
}

TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, backgroundTask_sync_db)

// 2. Register the task at some point in your app by providing the same name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundTaskAsync() {
    try {
        return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER)
    } catch (e: unknown) {
        console.warn(e)
    }
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background task calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundTaskAsync() {
    try {
        return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER)
    } catch (e: unknown) {
        console.warn(e)
    }
}

export default function BackgroundTaskScreen() {
    const [isRegistered, setIsRegistered] = useState<boolean>(false)
    const [status, setStatus] =
        useState<BackgroundTask.BackgroundTaskStatus | null>(null)

    useEffect(() => {
        updateAsync()
    }, [])

    const updateAsync = async () => {
        const status = await BackgroundTask.getStatusAsync()
        setStatus(status)
        const isRegistered = await TaskManager.isTaskRegisteredAsync(
            BACKGROUND_TASK_IDENTIFIER,
        )
        setIsRegistered(isRegistered)
    }

    const toggle = async () => {
        if (!isRegistered) {
            await registerBackgroundTaskAsync()
        } else {
            await unregisterBackgroundTaskAsync()
        }
        await updateAsync()
    }

    return (
        <View style={styles.screen}>
            <View style={styles.textContainer}>
                <Text>
                    Background Task Service Availability:{' '}
                    <Text style={styles.boldText}>
                        {status
                            ? BackgroundTask.BackgroundTaskStatus[status]
                            : null}
                    </Text>
                </Text>
            </View>
            <Button
                disabled={
                    status === BackgroundTask.BackgroundTaskStatus.Restricted
                }
                title={
                    isRegistered
                        ? 'Cancel Background Task'
                        : 'Schedule Background Task'
                }
                onPress={toggle}
            />
            <Button
                title="Check Background Task Status"
                onPress={updateAsync}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        margin: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
})
