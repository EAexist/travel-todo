import { useTripStore } from '@/models'
import { AuthenticatedStackScreenProps, goBack } from '@/navigators'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { useFocusEffect } from '@react-navigation/native'
import { FC, useCallback, useState } from 'react'
import { useLoadingScreen } from '../Loading'
import { TodolistAddScreenBase } from '../Todolist/Edit/TodolistAddScreenBase'

export const TodolistSettingScreen: FC<
    AuthenticatedStackScreenProps<'TodolistSetting'>
> = ({ navigation }) => {
    const tripStore = useTripStore()
    const { fetchTodoPresetWithApiStatus } = useActionsWithApiStatus()

    useHeader({
        backNavigateProps: { name: 'TitleSetting' },
        onBackPressBeforeNavigate: async () => {
            navigation.pop(1)
        },
    })

    // useEffect(() => {
    //     if (!tripStore.isInitialized) {
    //         async function fetchTodoPreset() {
    //             await fetchTodoPresetWithApiStatus()
    //         }
    //         fetchTodoPreset().then(() => {
    //             console.log('[TodolistAddScreenBase] fetchTodoPreset()')
    //         })
    //     }
    // }, [tripStore.isInitialized])

    const [isLoaded, setIsLoaded] = useState(false)
    useFocusEffect(
        useCallback(() => {
            if (!tripStore.isInitialized && !isLoaded) {
                fetchTodoPresetWithApiStatus()
                setIsLoaded(true)
            }
        }, [tripStore.isInitialized, isLoaded]),
    )

    useLoadingScreen({ onProblem: () => goBack() })

    return isLoaded ? (
        <TodolistAddScreenBase
            title={'새 할 일'}
            instruction={'관리하고 싶은 항목을 추가하세요'}
            isInitializingScreen
        />
    ) : null
}
