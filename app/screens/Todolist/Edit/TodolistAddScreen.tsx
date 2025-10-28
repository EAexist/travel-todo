import * as Fab from '@/components/Fab'
import { useTripStore } from '@/models'
import { AuthenticatedStackScreenProps, useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import {
    TodolistAddScreenBase,
    useAddFlaggedPreset,
} from './TodolistAddScreenBase'

interface TodolistAddScreenProps
    extends AuthenticatedStackScreenProps<'TodolistAdd'> {}

export const TodolistAddScreen: FC<TodolistAddScreenProps> = observer(
    ({ route }) => {
        const tripStore = useTripStore()
        const { navigateWithTrip } = useNavigate()
        const handleToDeleteScreenPress = useCallback(() => {
            navigateWithTrip('TodolistDelete')
        }, [])
        const addFlaggedPreset = useAddFlaggedPreset()

        const onBackPressBeforeNavigate = useCallback(async () => {
            tripStore.resetAddFlags()
        }, [])

        useHeader({
            rightActionTitle: '삭제',
            onRightPress: handleToDeleteScreenPress,
            backNavigateProps: { name: 'Main' },
            onBackPressBeforeNavigate: onBackPressBeforeNavigate,
        })

        return (
            <TodolistAddScreenBase
                title={'새 할 일'}
                instruction={
                    '관리하고 싶은 할 일과\n준비가 필요한 짐을 추가하세요'
                }
                tripId={route.params.tripId}
                fab={
                    <Fab.Container>
                        <Fab.NextButton
                            navigateProps={{
                                name: 'Main',
                                params: { screen: 'Todolist' },
                            }}
                            promiseBeforeNavigate={async () =>
                                addFlaggedPreset()
                            }
                            title={
                                tripStore.numOfAddFlags > 0
                                    ? `${tripStore.numOfAddFlags}개 예약 추가`
                                    : '확인'
                            }
                        />
                    </Fab.Container>
                }
                callerName="TodolistAdd"
            />
        )
    },
)
