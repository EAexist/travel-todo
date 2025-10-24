import { FC, useCallback, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
//
import {
    NavigateListItemProp,
    NavigateMenuBottomSheet,
} from '@/components/BottomSheet/NavigateMenuBottomSheet'
import { BottomSheetModal } from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { AccomodationTodo, CompleteTodo } from '@/components/Todo'
import { TodoList } from '@/components/TodoList'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { MainTabScreenProps } from '@/navigators'
import { useMainScreenHeader } from '@/utils/useHeader'
import { Observer, observer } from 'mobx-react-lite'
import { Label } from '@/components/Label'
import { ListItem, useTheme } from '@rneui/themed'

export const TodolistScreen: FC<MainTabScreenProps<'Todolist'>> = observer(
    ({}) => {
        const tripStore = useTripStore()

        const {
            theme: { colors },
        } = useTheme()
        const renderItem = (todo: Todo) => (
            <Observer
                render={() => {
                    switch (todo.type) {
                        case 'accomodation':
                            return <AccomodationTodo todo={todo} />
                        default:
                            return <CompleteTodo todo={todo} />
                    }
                }}
            />
        )

        /* Menu */
        const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

        const handleSettingsButtonPress = useCallback(() => {
            settingsMenuBottomSheetRef.current?.present()
        }, [settingsMenuBottomSheetRef])

        useMainScreenHeader({
            //   title: tripStore.title,
            title: '여행 준비',
            rightComponent: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={handleSettingsButtonPress}
                        style={$headerRightButtonStyle}>
                        <HeaderIcon name="gear" type="octicon" />
                    </TouchableOpacity>
                </View>
            ),
        })

        const settingsOption: NavigateListItemProp[] = [
            {
                title: '할 일 추가',
                path: 'TodolistAdd',
                icon: { name: 'add', type: 'material' },
                primary: true,
            },
            {
                title: '순서 변경',
                path: 'TodolistReorder',
                icon: { name: 'swap-vert', type: 'material' },
            },
            {
                title: '할 일 삭제',
                path: 'TodolistDelete',
                icon: { name: 'delete', type: 'material' },
            },
        ]

        return (
            <Screen>
                <TodoList
                    sections={tripStore.todolistSectionListData}
                    renderItem={renderItem}
                />
                <NavigateMenuBottomSheet
                    data={settingsOption}
                    ref={settingsMenuBottomSheetRef}
                />
            </Screen>
        )
    },
)
