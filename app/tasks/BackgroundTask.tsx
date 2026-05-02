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

export type SyncResult =
    | { success: true }
    | ({ success: false } & GeneralApiProblem)

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

const ActionMap: Record<APIAction, (data: any) => Promise<ApiResult<any>>> = {
    /* Trip CRUD */
    [APIAction.PATCH_TRIP]: (data: TripPatchDTO) => api.patchTrip(data as TripPatchDTO),
    [APIAction.DELETE_TRIP]: (data: DeleteTripProps) => api.deleteTrip(data as DeleteTripProps),

    /* Todo CRUD */
    [APIAction.CREATE_TODO]: (data: CreateTodoProps) => api.createTodo(data as CreateTodoProps),
    [APIAction.PATCH_TODO]: (data: PatchTodoProps) => api.patchTodo(data as PatchTodoProps),
    [APIAction.DELETE_TODO]: (data: DeleteTodoProps) => api.deleteTodo(data as DeleteTodoProps),

    /* Destination CRUD */
    [APIAction.CREATE_DESTINATION]: (data: CreateDestinationProps) => api.createDestination(data as CreateDestinationProps),
    [APIAction.DELETE_DESTINATION]: (data: DeleteDestinationProps) => api.deleteDestination(data as DeleteDestinationProps),

    /* Reservation CRUD */
    [APIAction.CREATE_RESERVATION]: (data: CreateReservationProps) => api.createReservation(data as CreateReservationProps),
    [APIAction.PATCH_RESERVATION]: (data: PatchReservationProps) => api.patchReservation(data as PatchReservationProps),
    [APIAction.DELETE_RESERVATION]: (data: DeleteReservationProps) => api.deleteReservation(data as DeleteReservationProps),
};

const runAPIAction: (asyncAPIWriteAction: AsyncAPIWriteAction) => Promise<ApiResult<any>> = async ({ action, data }) => {
    const handler = ActionMap[action];
    if (!handler) {
        console.error(`No handler for action: ${action}`);
        return { kind: 'bad-data' };
    }
    return await handler(data);
}


export const sync_db: () => Promise<SyncResult> = async () => {
    console.log(`[sync_db]`)
    const syncSuccess: SyncResult = { success: true }
    const apiActionQueue = getAPIActionQueue() || []
    if (apiActionQueue.length === 0) return syncSuccess

    let apiProblem: GeneralApiProblem = { kind: 'unknown', temporary: true }

    for (const actionItem of apiActionQueue) {
        const result = await runAPIAction(actionItem)
        if (result.kind == 'ok') {
            actionItem.isSynced = true
        }
        else {
            apiProblem = result
            break;
        }
    }

    const newQueue = apiActionQueue.filter(item => !item.isSynced)
    console.log(
        `[sync_db] Completed: ${apiActionQueue.length - newQueue.length}/${apiActionQueue.length} Actions synced`,
    )
    save(BACKROUND_TASK_QUEUE_STORAGE_KEY, newQueue)

    if (newQueue.length == 0) {
        return syncSuccess
    } else {
        return { success: false, ...apiProblem } as SyncResult
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
