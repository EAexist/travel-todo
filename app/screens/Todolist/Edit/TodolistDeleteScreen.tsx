import { Screen } from '@/components'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { CheckBoxItemProps, TodoBase } from '@/components/Todo'
import {
    TodolistEditContent,
    TodolistSectionHeader,
    TodolistSectionT,
} from '@/components/TodoList'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { useCheckedList } from '@/utils/useCheckedList'
import { ListItem, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { SectionList, SectionListRenderItem, StyleSheet } from 'react-native'

const DeleteTodo: FC<CheckBoxItemProps & { todo: Todo }> = observer(
    ({ todo, isChecked, onPress }) => {
        const {
            theme: { colors },
        } = useTheme()

        return (
            <TodoBase
                rightContent={
                    <ListItem.CheckBox
                        onPress={onPress}
                        checked={isChecked}
                        checkedColor={colors.contrastText.secondary}
                    />
                }
                onPress={onPress}
                caption={todo.isCompleted ? '완료함' : undefined}
                {...(todo.isCompleted && {
                    contentStyle: styles.disabled,
                    avatarProps: {
                        containerStyle: styles.disabled,
                    },
                })}
                title={todo.title}
                subtitle={todo.subtitle}
                icon={todo.icon}
            />
        )
    },
)

export const TodolistDeleteScreen = observer(() => {
    const tripStore = useTripStore()

    const {
        checkedlist: deleteList,
        handlePress,
        numOfCheckedItem: numOfDeleteFlags,
    } = useCheckedList([...tripStore.todoMap.keys()])

    const handleCompletePress = useCallback(async () => {
        Object.entries(deleteList)
            .filter(([_, isChecked]) => isChecked)
            .forEach(([id, _]) => {
                console.log('DELETE' + id)
                tripStore.deleteTodo(id)
            })
    }, [deleteList])

    const renderItem: SectionListRenderItem<Todo, TodolistSectionT> = ({
        item: todo,
    }) => (
        <Observer
            render={() => (
                <DeleteTodo
                    todo={todo}
                    key={todo?.id}
                    isChecked={deleteList[todo.id]}
                    onPress={() => handlePress(todo.id)}
                />
            )}
        />
    )
    const renderTabViewItem = useCallback(
        (isSupply: boolean) => {
            return (
                <SectionList
                    sections={
                        isSupply
                            ? tripStore.supplyTodolistSectionListData
                            : tripStore.workTodolistSectionListData
                    }
                    renderItem={renderItem}
                    renderSectionHeader={({ section }) => (
                        <TodolistSectionHeader section={section} />
                    )}
                    keyExtractor={(todo: Todo) => todo.id}
                />
            )
        },
        [deleteList],
    )

    return (
        <Screen>
            <ContentTitle
                title={'할 일 삭제하기'}
                subtitle={'관리하지 않아도 되늗 할 일을 지울 수 있어요'}
            />
            <TodolistEditContent renderTabViewItem={renderTabViewItem} />
            <Fab.Container>
                <Fab.GoBackButton
                    title={
                        numOfDeleteFlags > 0
                            ? `${numOfDeleteFlags}개 할 일 삭제`
                            : '확인'
                    }
                    promiseBeforeNavigate={handleCompletePress}
                    disabled={numOfDeleteFlags <= 0}
                />
            </Fab.Container>
        </Screen>
    )
})

const styles = StyleSheet.create({
    disabled: { opacity: 0.4 },
})
