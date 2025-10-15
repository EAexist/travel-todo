import * as Fab from '@/components/Fab'
import { useStores } from '@/models'
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
        const { navigateWithTrip } = useNavigate()
        const handleToDeleteScreenPress = useCallback(() => {
            navigateWithTrip('TodolistDelete')
        }, [])
        const addFlaggedPreset = useAddFlaggedPreset()

        useHeader({
            rightActionTitle: '삭제',
            onRightPress: handleToDeleteScreenPress,
            backNavigateProps: { name: 'Main' },
        })

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
                            promiseBeforeNavigate={addFlaggedPreset}
                        />
                    </Fab.Container>
                }
                callerName="TodolistAdd"
            />
        )
    },
)
