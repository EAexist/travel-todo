import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores, useTripStore} from '@/models'
import {useHeader} from '@/utils/useHeader'
import {withTodo} from '@/utils/withTodo'
import {useCallback} from 'react'

export const ConfirmFlightScreen = withTodo<'ConfirmFlight'>(({todo}) => {
  const {completeAndPatchTodo} = useTripStore()
  const handleUploadPress = useCallback(() => {
    // Handle next button press
    console.log('Next button pressed')
  }, [])

  const instruction =
    '탑승권 발급과 좌석 선택을 미리 할 수 있도록 사전 체크인 알림을 보내드릴게요.'

  const confirmCompleteTodo = useCallback(async () => {
    completeAndPatchTodo(todo)
  }, [])

  return (
    <Screen>
      <ContentTitle
        title={
          <TransText h2>
            {todo.departure
              ? `${todo.flightTitleWithCode} 항공권\n`
              : '항공권 '}
            <TransText h2 primary>
              예약 내역 화면을 캡쳐
            </TransText>
            {'해서 올려주세요.'}
          </TransText>
        }
        subtitle={instruction}
      />
      <Fab.Container>
        <Fab.Button onPress={handleUploadPress} title={'화면 캡쳐 올리기'} />
        <Fab.NextButton
          navigateProps={{
            name: 'Main',
            params: {screen: 'Todolist'},
          }}
          title={'올리지 않고 할일 완료하기'}
          color={'secondary'}
          promiseBeforeNavigate={confirmCompleteTodo}
        />
      </Fab.Container>
    </Screen>
  )
})
