import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen/Screen'
import { TransText } from '@/components/TransText'
import { useTripStore } from '@/models'
import { withTodo } from '@/utils/withTodo'
import { useCallback } from 'react'

export const ConfirmVisitJapanScreen = withTodo<'ConfirmVisitJapan'>(
    ({ todo }) => {
        const tripStore = useTripStore()

        const confirmCompleteTodo = useCallback(async () => {
            tripStore.completeAndPatchTodo(todo)
        }, [])

        const instruction =
            '만료일이 해당 날짜 이전이라면\n여권을 재발급 받아야 해요.'

        return (
            <Screen>
                <ContentTitle
                    title={
                        <>
                            <TransText h2>여권 만료일이</TransText>
                            <TransText h2 primary>
                                {tripStore.passportExpiryRequiredAfterThisDate}
                            </TransText>
                            <TransText h2>이후인지 확인해주세요.</TransText>
                        </>
                    }
                    subtitle={instruction}
                />

                <Fab.Container>
                    <Fab.GoBackButton
                        title={'확인했어요'}
                        promiseBeforeNavigate={confirmCompleteTodo}
                    />
                    <Fab.GoBackButton
                        color={'secondary'}
                        title={'재발급하고 올게요'}
                    />
                </Fab.Container>
            </Screen>
        )
    },
)
