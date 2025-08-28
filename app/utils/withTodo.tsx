import {useStores, useTripStore} from '@/models'
import {FlightTodo, Todo} from '@/models/Todo'
import {
  AppStackParamList,
  AppStackScreenProps,
  TodoAppStackParamList,
} from '@/navigators'
import {FC} from 'react'

export const withTodo = <T extends keyof TodoAppStackParamList>(
  WrappedComponent: FC<{
    todo: Todo
    params: Readonly<AppStackParamList[T]>
  }>,
) => {
  const Component: FC<AppStackScreenProps<T>> = ({route: {params}}) => {
    const tripStore = useTripStore()
    const todo = params?.todoId
      ? tripStore.todoMap.get(params?.todoId)
      : undefined
    return !!todo && !!params ? (
      <WrappedComponent todo={todo} params={params} />
    ) : (
      <></>
    )
  }
  return Component
}

export const withFlightTodo = <T extends keyof TodoAppStackParamList>(
  WrappedComponent: FC<{
    todo: FlightTodo
    params: Readonly<AppStackParamList[T]>
  }>,
) => {
  const Component: FC<AppStackScreenProps<T>> = ({route: {params}}) => {
    const tripStore = useTripStore()
    const todo = params?.todoId
      ? tripStore.todoMap.get(params?.todoId)
      : undefined
    return !!todo && !!params ? (
      <WrappedComponent todo={todo as FlightTodo} params={params} />
    ) : (
      <></>
    )
  }
  return Component
}
