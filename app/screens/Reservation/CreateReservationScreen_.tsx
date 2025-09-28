import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import { TransText } from '@/components/TransText'
import { useStores, useTripStore } from '@/models'
import { withTodo } from '@/utils/withTodo'
import { useCallback } from 'react'
import { launchImageLibraryAsync } from 'expo-image-picker'
import * as storage from '../../utils/storage'
import { usePickIamge } from '@/utils/image'

export const CreateReservationScreen = withTodo<'CreateReservation'>(
  ({ todo }) => {
    const {
      reservationStore: { addFlightTicket },
    } = useStores()
    const { completeAndPatchTodo } = useTripStore()

    const { pickImage } = usePickIamge()
    const handleUploadPress = useCallback(async () => {
      pickImage().then(localFileUri => {
        if (localFileUri) {
          console.log(
            `[ConfirmFlightTicketScreen] Image Upload iamgePath=${localFileUri}`,
          )
          addFlightTicket(localFileUri)
        }
      })
    }, [])

    const instruction = '공항에서 간편하게 꺼내볼 수 있도록 준비해드릴게요'

    const confirmCompleteTodo = useCallback(async () => {
      completeAndPatchTodo(todo)
    }, [])

    return (
      <Screen>
        <ContentTitle
          title={
            <TransText h2>
              {todo.departure ? `${todo.flightTitleWithCode} 편\n` : ''}
              <TransText h2 primary>
                모바일 탑승권
              </TransText>
              {'을 저장해주세요.'}
            </TransText>
          }
          subtitle={instruction}
        />
        <Fab.Container>
          <Fab.Button
            onPress={handleUploadPress}
            title={'모바일 탑승권 올리기'}
          />
          <Fab.NextButton
            navigateProps={{
              name: 'Main',
              params: { screen: 'Todolist' },
            }}
            title={'올리지 않고 할일 완료하기'}
            color={'secondary'}
            promiseBeforeNavigate={confirmCompleteTodo}
          />
        </Fab.Container>
      </Screen>
    )
  },
)
