import * as Fab from '@/components/Fab'
import { useStores, useTripStore } from '@/models'
import { AppStackScreenProps, goBack, useNavigate } from '@/navigators'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect } from 'react'
import { useLoadingScreen } from '../Loading'
import {
  TodolistAddScreenBase,
  useAddFlaggedPreset,
} from '../Todolist/Edit/TodolistAddScreenBase'

export const TodolistSettingScreen: FC<AppStackScreenProps<'TodolistSetting'>> =
  observer(({ route, navigation }) => {
    // const { tripStore } = useStores()
    const tripStore = useTripStore()
    const { fetchPresetWithApiStatus } = useActionsWithApiStatus()
    const { navigateWithTrip } = useNavigate()
    const addFlaggedPreset = useAddFlaggedPreset()

    const handlePressNext = useCallback(() => {
      addFlaggedPreset().then(async () => {
        await tripStore.initialize()
      })
    }, [])

    useEffect(() => {
      if (tripStore.isInitialized) {
        navigateWithTrip('Main', { screen: 'Todolist' })
      }
    }, [tripStore.isInitialized])

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
            <Fab.Button title={'확인'} onPress={handlePressNext} />
          </Fab.Container>
        }
        callerName="TodolistSetting"
      />
    )
  })
