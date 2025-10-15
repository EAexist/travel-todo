import { useStores, useTripStore } from '@/models'
import { FlightTodo, Todo } from '@/models/Todo'
import {
    AuthenticatedStackParamList,
    AuthenticatedStackScreenProps,
    TodoAuthenticatedStackParamList,
} from '@/navigators'
import { FC } from 'react'

export const withTodo = <T extends keyof TodoAuthenticatedStackParamList>(
    WrappedComponent: FC<{
        todo: Todo
        params: Readonly<AuthenticatedStackParamList[T]>
    }>,
) => {
    const Component: FC<AuthenticatedStackScreenProps<T>> = ({
        route: { params },
    }) => {
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

export const withFlightTodo = <T extends keyof TodoAuthenticatedStackParamList>(
    WrappedComponent: FC<{
        todo: FlightTodo
        params: Readonly<AuthenticatedStackParamList[T]>
    }>,
) => {
    const Component: FC<AuthenticatedStackScreenProps<T>> = ({
        route: { params },
    }) => {
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
