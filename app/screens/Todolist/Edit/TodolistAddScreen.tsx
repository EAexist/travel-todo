import { useTripStore } from '@/models'
import { AuthenticatedStackScreenProps, useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { TodolistAddScreenBase } from './TodolistAddScreenBase'

interface TodolistAddScreenProps
    extends AuthenticatedStackScreenProps<'TodolistAdd'> {}

export const TodolistAddScreen: FC<TodolistAddScreenProps> = observer(({}) => {
    const tripStore = useTripStore()
    const { navigateWithTrip } = useNavigate()
    const handleToDeleteScreenPress = useCallback(() => {
        navigateWithTrip('TodolistDelete')
    }, [])

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
            instruction={'관리하고 싶은 항목을 추가하세요'}
        />
    )
})
