import { useTripStore } from '@/models'
import { AuthenticatedStackScreenProps, goBack } from '@/navigators'
import { useActionWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { useFocusEffect } from '@react-navigation/native'
import { FC, useCallback, useState } from 'react'
import { LoadingBoundary } from '../Loading/LoadingBoundary'
import { TodolistAddScreenBase } from '../Todolist/Edit/TodolistAddScreenBase'

export const TodolistSettingScreen: FC<
    AuthenticatedStackScreenProps<'TodolistSetting'>
> = ({}) => {
    const tripStore = useTripStore()
    const fetchTodoPreset = useActionWithApiStatus(tripStore.fetchTodoPreset)

    useHeader({
        backButtonShown: true,
        backNavigateProps: {
            name: 'TitleSetting',
        },
    })

    const [isLoaded, setIsLoaded] = useState(tripStore.todoPreset.length > 0)
    useFocusEffect(
        useCallback(() => {
            if (!tripStore.isInitialized && !isLoaded) {
                fetchTodoPreset({})
                setIsLoaded(true)
            }
        }, [tripStore.isInitialized, isLoaded]),
    )

    return (
        <LoadingBoundary onProblem={() => goBack()}>
            {isLoaded ? (
                <TodolistAddScreenBase
                    title={'새 할 일'}
                    instruction={'관리하고 싶은 항목을 추가하세요'}
                    isInitializingScreen
                />
            ) : null}
        </LoadingBoundary>
    )
}
