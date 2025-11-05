import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen/Screen'
import { TransText } from '@/components/TransText'
import { useTripStore } from '@/models'
import { withTodo } from '@/utils/withTodo'
import { useCallback } from 'react'

export const ConfirmFlightTicketScreen = withTodo<'ConfirmFlightTicket'>(
    ({ todo }) => {
        const { completeAndPatchTodo } = useTripStore()

        const confirmCompleteTodo = useCallback(async () => {
            completeAndPatchTodo(todo)
        }, [])

        return (
            <Screen>
                <ContentTitle
                    title={
                        <TransText h2>
                            {todo.departure
                                ? `${todo.flightTitleWithCode} 편\n`
                                : ''}
                            <TransText h2 primary>
                                모바일 탑승권
                            </TransText>
                            {'을 저장해주세요.'}
                        </TransText>
                    }
                    subtitle={
                        '공항에서 간편하게 꺼내볼 수 있도록\n준비해드릴게요'
                    }
                />
                <Fab.Container>
                    <Fab.NextButton
                        navigateProps={{
                            name: 'ReservationCreate',
                            params: { category: 'FLIGHT_TICKET' },
                        }}
                        title={'항공권 저장'}
                    />
                    <Fab.NextButton
                        navigateProps={{
                            name: 'Main',
                            params: { screen: 'Todolist' },
                        }}
                        title={'저장하지 않고 할 일 완료하기'}
                        color={'secondary'}
                        promiseBeforeNavigate={confirmCompleteTodo}
                    />
                </Fab.Container>
            </Screen>
        )
    },
)
