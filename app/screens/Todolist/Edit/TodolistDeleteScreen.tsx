import { Screen } from '@/components'
import ContentTitle from '@/components/Layout/Content'
import SwitchTab, { SwitchTabItem } from '@/components/SwitchTab'
import { DeleteTodo } from '@/components/Todo'
import { TodoList } from '@/components/TodoList'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { goBack } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { Observer, observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { View } from 'react-native'

export const TodolistDeleteScreen = observer(() => {
    const tripStore = useTripStore()

    const handleCompletePress = useCallback(() => {
        tripStore.deleteTodos()
        goBack()
    }, [tripStore])

    const renderItem = (todo: Todo) => (
        <Observer render={() => <DeleteTodo todo={todo} key={todo?.id} />} />
    )

    useHeader({
        rightActionTitle: '완료',
        onRightPress: handleCompletePress,
        onBackPressBeforeNavigate: async () => {
            tripStore.resetAllDeleteFlag()
        },
    })

    const [showIncompleteTodolist, setShowIncompleteTodolist] = useState(true)

    return (
        <Screen>
            <ContentTitle
                title={'할 일 삭제하기'}
                subtitle={'관리하지 않아도 되늗 할 일을 지울 수 있어요'}
            />
            <View
                style={{
                    paddingTop: 16,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <SwitchTab
                    value={showIncompleteTodolist ? 0 : 1}
                    onChange={e =>
                        setShowIncompleteTodolist(e === 0 ? true : false)
                    }>
                    <SwitchTabItem title={`남은 할 일`} />
                    <SwitchTabItem title={`완료한 할 일`} />
                </SwitchTab>
            </View>
            <TodoList
                sections={(showIncompleteTodolist
                    ? tripStore.incompleteTodolistSectionListData
                    : tripStore.completedTodolistSectionListData
                ).filter(section => section.data.length > 0)}
                renderItem={renderItem}
            />
        </Screen>
    )
})
