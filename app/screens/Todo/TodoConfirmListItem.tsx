import {TextInfoListItem} from '@/components/TextInfoListItem'
import {TransText} from '@/components/TransText'
import {useStores, useTripStore} from '@/models'
import {Todo} from '@/models/Todo'
import {AppStackParamList, goBack, useNavigate} from '@/navigators'

import {ListItem} from '@rneui/themed'
import {FC, useCallback, useState} from 'react'

export const TodoConfirmListItem: FC<{
  todo: Todo
  isCompleted: boolean
  onChange: () => void
}> = ({isCompleted, onChange}) => {
  return (
    <TextInfoListItem
      title={'상태'}
      rightContent={
        <ListItem.CheckBox
          onPress={onChange}
          checked={isCompleted}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          size={24}
        />
      }>
      <TransText primary={isCompleted}>
        {isCompleted ? '완료' : '미완료'}
      </TransText>
    </TextInfoListItem>
  )
}

export const useTodoConfirmListItem = (
  todo: Todo,
  confirmScreen: keyof AppStackParamList,
  isBeforeInitialization = false,
) => {
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted)

  const tripStore = useTripStore()

  const {navigateWithTrip} = useNavigate()

  const handleConfirm = useCallback(async () => {
    console.log(
      `[confirmCompleteNavigate] todo.isCompleted=${todo.isCompleted} isCompleted=${isCompleted}`,
    )
    if (!todo.isCompleted && isCompleted) {
      navigateWithTrip(confirmScreen, {todoId: todo.id})
    } else if (todo.isCompleted && !isCompleted) {
      todo.setIncomplete()
      tripStore.patchTodo({
        id: todo.id,
        completeDateISOString: todo.completeDateISOString,
      })
      goBack()
    } else {
      goBack()
    }
  }, [tripStore.completeAndPatchTodo, todo, todo.isCompleted, isCompleted])

  return {
    isCompleted,
    setIsCompleted,
    handleConfirm,
  }
}
