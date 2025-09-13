import * as Fab from '@/components/Fab'
import {Title} from '@/components/Layout/Content'
import {Note} from '@/components/Note'
import {Screen} from '@/components/Screen'
import {useTripStore} from '@/models'
import {useHeader} from '@/utils/useHeader'
import {withTodo} from '@/utils/withTodo'
import {Trans} from '@lingui/react/macro'
import {ListItem} from '@rneui/themed'
import {useCallback, useState} from 'react'
import {ViewStyle} from 'react-native'
import {Avatar} from '../../components/Avatar'
import {TransText} from '../../components/TransText'

export const TodoNoteScreen = withTodo<'TodoNote'>(({todo}) => {
  const tripStore = useTripStore()

  const onBackPressBeforeNavigate = useCallback(async () => {
    tripStore.patchTodo({id: todo.id, note: todo.note})
  }, [todo])

  useHeader({onBackPressBeforeNavigate})

  const [isFocused, setIsFocused] = useState(false)
  const handleChangeNote = (value: string) => todo.setProp('note', value)

  return (
    <Screen>
      <Title>
        <ListItem containerStyle={$listItemContainerStyle}>
          <Avatar icon={todo.icon} size="xlarge" fontSize={28} />
          <ListItem.Content>
            {true && (
              <ListItem.Subtitle>
                <Trans>{todo.categoryTitle}</Trans>
              </ListItem.Subtitle>
            )}
            <ListItem.Title>
              <TransText h2>{todo.title}</TransText>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Title>
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
