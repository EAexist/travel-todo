import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Note } from '@/components/Note'
import { Screen } from '@/components/Screen'
import { useTripStore } from '@/models'
import { useHeader } from '@/utils/useHeader'
import { withTodo } from '@/utils/withTodo'
import { useCallback, useState } from 'react'
import { ViewStyle } from 'react-native'

export const TodoNoteScreen = withTodo<'TodoNote'>(({ todo }) => {
  const tripStore = useTripStore()

  const onBackPressBeforeNavigate = useCallback(async () => {
    tripStore.patchTodo({ id: todo.id, note: todo.note })
  }, [todo])

  useHeader({ onBackPressBeforeNavigate })

  const [isFocused, setIsFocused] = useState(false)
  const handleChangeNote = (value: string) => todo.setProp('note', value)

  return (
    <Screen>
      <ContentTitle
        variant="listItem"
        title={todo.title}
        subtitle={todo.categoryTitle}
        icon={todo.icon}
      />
      <Note
        onChangeNote={handleChangeNote}
        initialValue={todo.note}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      {isFocused && (
        <Fab.Container>
          <Fab.Button title={'확인'} />
        </Fab.Container>
      )}
    </Screen>
  )
})

const $listItemContainerStyle: ViewStyle = {
  height: 60,
}
