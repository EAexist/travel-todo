import {Avatar} from '@/components/Avatar'
import {GestureHandlerRootViewWrapper} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import {Title} from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TextInfoListItem} from '@/components/TextInfoListItem'
import {TransText} from '@/components/TransText'
import {useStores, useTripStore} from '@/models'
import {FlightTodo} from '@/models/Todo'
import {goBack, useNavigate} from '@/navigators'
import {ListItem} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useEffect} from 'react'
import {View, ViewStyle} from 'react-native'
import {
  TodoConfirmListItem,
  useTodoConfirmListItem,
} from '../TodoConfirmListItem'

export const FlightTicketTodoEditScreen: FC<{
  todo: FlightTodo
  isBeforeInitialization?: boolean
}> = observer(({todo, isBeforeInitialization = false}) => {
  const {navigateWithTrip} = useNavigate()
  const tripStore = useTripStore()

  useEffect(() => {
    console.log('Hello [FlightTicketTodoEditScreen]')
  }, [])

  const {
    tripStore: {patchTodo},
  } = useStores()

  const {isCompleted, setIsCompleted} = useTodoConfirmListItem(
    todo,
    'ConfirmFlight',
    isBeforeInitialization,
  )

  const handleUpload = useCallback(async () => {
    console.log('handleUpload')
  }, [])

  const handleNotePress = useCallback(() => {
    console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
    navigateWithTrip('TodoNote', {
      todoId: todo.id,
    })
  }, [navigateWithTrip, todo.id])

  //   const handleBackPressBeforeNavigate = useCallback(async () => {
  //     if (isBeforeInitialization) await tripStore.deleteTodo(todo)
  //   }, [isBeforeInitialization])

  //   useHeader({
  //     onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
  //   })

  const handleConfirm = useCallback(async () => {
    if (!todo.isCompleted && isCompleted) {
      navigateWithTrip('ConfirmFlightTicket', {todoId: todo.id})
    } else if (todo.isCompleted && !isCompleted) {
      todo.setIncomplete()
      patchTodo(todo).then(() => {
        goBack()
      })
    } else {
      goBack()
    }
  }, [patchTodo, todo, todo.isCompleted, isCompleted])

  const handleChange = useCallback(() => {
    setIsCompleted(prev => !prev)
    console.log(isCompleted)
  }, [setIsCompleted, isCompleted])

  return (
    <GestureHandlerRootViewWrapper>
      <Screen>
        <Title>
          <ListItem>
            <Avatar icon={{name: '✈️'}} size="xlarge" />
            <ListItem.Content>
              <ListItem.Title
                style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  fontSize: 21,
                  lineHeight: 1.6 * 22,
                }}>
                {todo.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Title>
        {todo.departure && (
          <View>
            <TextInfoListItem title={'출발'}>
              <TransText style={{fontWeight: 600}}>
                {`${todo.departure?.name} ${
                  todo.departure?.IATACode
                    ? `(${todo.departure?.IATACode})`
                    : ''
                }`}
              </TransText>
            </TextInfoListItem>
            <TextInfoListItem title={'도착'}>
              <TransText style={{fontWeight: 600}}>
                {`${todo.arrival?.name} ${todo.arrival?.IATACode ? `(${todo.arrival?.IATACode})` : ''}`}
              </TransText>
            </TextInfoListItem>
          </View>
        )}
        {/* <Divider /> */}
        <TodoConfirmListItem
          todo={todo}
          isCompleted={isCompleted}
          onChange={handleChange}
        />
        <TextInfoListItem
          onPress={handleNotePress}
          title={'메모'}
          rightContent={<ListItem.Chevron />}>
          <TransText primary>{todo.note || '메모를 남겨보세요'}</TransText>
        </TextInfoListItem>
        <Fab.Container>
          <Fab.Button
            onPress={handleUpload}
            color={'secondary'}
            title={'예약 정보 입력'}
          />
          <Fab.Button onPress={handleConfirm} title={'확인'} />
        </Fab.Container>
      </Screen>
    </GestureHandlerRootViewWrapper>
  )
})

const $d: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: 24,
}

const $s: ViewStyle = {
  gap: 32,
}

const $iconAvataContainerStyle: ViewStyle = {
  // width: 72,
  // height: 72,
  // height: 64
}
