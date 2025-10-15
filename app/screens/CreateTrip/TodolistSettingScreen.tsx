import * as Fab from '@/components/Fab'
import { useStores, useTripStore } from '@/models'
import {
    AuthenticatedStackScreenProps,
    goBack,
    useNavigate,
} from '@/navigators'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect } from 'react'
import { useLoadingScreen } from '../Loading'
import {
    TodolistAddScreenBase,
    useAddFlaggedPreset,
} from '../Todolist/Edit/TodolistAddScreenBase'

export const TodolistSettingScreen: FC<
    AuthenticatedStackScreenProps<'TodolistSetting'>
> = observer(({ route, navigation }) => {
    const tripStore = useTripStore()
    const { fetchPresetWithApiStatus } = useActionsWithApiStatus()
    const { navigateWithTrip } = useNavigate()
    const addFlaggedPreset = useAddFlaggedPreset()

    const handlePressNext = useCallback(() => {
        return addFlaggedPreset().then(() => {
            tripStore.initialize()
        })
    }, [])

    // useEffect(() => {
    //     if (tripStore.isInitialized) {
    //         navigateWithTrip('Main', { screen: 'Todolist' })
    //     }
    // }, [tripStore.isInitialized])

    useHeader({
        backNavigateProps: { name: 'TitleSetting' },
        onBackPressBeforeNavigate: async () => {
            navigation.pop(1)
        },
    })

    useEffect(() => {
        async function fetchPreset() {
            await fetchPresetWithApiStatus()
        }
        fetchPreset().then(() => {
            console.log('[TodolistAddScreenBase] fetchPreset()')
        })
    }, [])

    useLoadingScreen({ onProblem: () => goBack() })

    return (
        <TodolistAddScreenBase
            title={'새 할 일 추가하기'}
            instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
            tripId={route.params.tripId}
            fab={
                <Fab.Container>
                    <Fab.NextButton
                        title={'확인'}
                        navigateProps={{
                            name: 'Main',
                            params: { screen: 'Todolist' },
                        }}
                        promiseBeforeNavigate={handlePressNext}
                    />
                </Fab.Container>
            }
            callerName="TodolistSetting"
        />
    )
})
