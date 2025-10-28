import { withTodo } from '@/utils/withTodo'
import { ViewStyle } from 'react-native'
import { NoteEditScreenBase } from '../NoteEditScreenBase'

export const TodoNoteScreen = withTodo<'TodoNote'>(({ todo }) => {
    return (
        <NoteEditScreenBase
            initialValue={todo.note}
            onConfirm={(value: string) => todo.setProp('note', value)}
            contentTitleProps={{
                title: todo.title,
                subtitle: todo.categoryTitle,
                icon: todo.icon,
            }}
        />
    )
})

const $listItemContainerStyle: ViewStyle = {
    height: 60,
}
