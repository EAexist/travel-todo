import {ROOT_STATE_STORAGE_KEY, RootStore} from '@/models'
import {TripStore, TripStoreSnapshot} from '@/models/stores/TripStore'
import {Todo} from '@/models/Todo'
import {
  api,
  CreateAccomodationProps,
  CreateDestinationProps,
  CreateTodoProps,
  DeleteAccomodationProps,
  DeleteDestinationProps,
  DeleteTodoProps,
  mapToTodoDTO,
  TodoDTO,
  TripDTO,
} from '@/services/api'
import {load, save, storage} from '@/utils/storage'
import * as BackgroundTask from 'expo-background-task'
import * as TaskManager from 'expo-task-manager'
import {useEffect, useState} from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'

export enum APIAction {
  PATCH_TRIP,
  CREATE_TODO,
  PATCH_TODO,
  DELETE_TODO,
  CREATE_DESTINATION,
  DELETE_DESTINATION,
  CREATE_ACCOMODATION,
  PATCH_ACCOMODATION,
  DELETE_ACCOMODATION,
}

interface AsyncAPIWriteAction {
  action: APIAction
  data: unknown
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
export function getAPIActionQueue(): AsyncAPIWriteAction[] | null {
  try {
    return load<AsyncAPIWriteAction[]>(BACKROUND_TASK_QUEUE_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Enqueue a API write action.
 *
 * @param key The key to fetch.
 */

export function enqueueAction(
  action: APIAction,
  data:
    | TripDTO
    | CreateTodoProps
    | DeleteTodoProps
    | CreateDestinationProps
    | DeleteDestinationProps
    | CreateAccomodationProps
    | DeleteAccomodationProps,
): boolean | null {
  try {
    const queue = getAPIActionQueue() || []
    queue.push({action, data, isSynced: false} as AsyncAPIWriteAction)
    const isSaved = save(BACKROUND_TASK_QUEUE_STORAGE_KEY, queue)
    if (isSaved) {
      registerBackgroundTaskAsync()
    }
    return isSaved
  } catch {
    return null
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
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const now = Date.now()
    console.log(
      `Got background task call at date: ${new Date(now).toISOString()}`,
    )
    const apiActionQueue = getAPIActionQueue() || []

    for (const actionItem of apiActionQueue) {
      const {action, data} = actionItem
      let kind
      try {
        switch (action) {
          /* Trip CRUD */
          case APIAction.PATCH_TRIP:
            api.patchTrip(data as TripDTO)

          /* Todo CRUD */
          case APIAction.CREATE_TODO:
            api.createTodo(data as CreateTodoProps)
          case APIAction.PATCH_TODO:
            api.patchTodo(data as CreateTodoProps)
          case APIAction.DELETE_TODO:
            api.deleteTodo(data as DeleteTodoProps)

          /* Destination CRUD */
          case APIAction.CREATE_DESTINATION:
            api.createDestination(data as CreateDestinationProps)
          case APIAction.DELETE_DESTINATION:
            api.deleteDestination(data as DeleteDestinationProps)

          /* Accomodation CRUD */
          case APIAction.CREATE_ACCOMODATION:
            api.createAccomodation(data as string)
          case APIAction.PATCH_ACCOMODATION:
            api.patchAccomodation(data as CreateAccomodationProps)
          case APIAction.DELETE_ACCOMODATION:
            api.deleteAccomodation(data as DeleteAccomodationProps)
          default:
            break
        }
      } catch (error) {
        console.error('Failed to execute api call:', error)
      }
      if (kind == 'ok') actionItem.isSynced = true
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
})

// 2. Register the task at some point in your app by providing the same name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundTaskAsync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER)
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background task calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER)
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
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      </View>
      <Button
        disabled={status === BackgroundTask.BackgroundTaskStatus.Restricted}
        title={
          isRegistered ? 'Cancel Background Task' : 'Schedule Background Task'
        }
        onPress={toggle}
      />
      <Button title="Check Background Task Status" onPress={updateAsync} />
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
