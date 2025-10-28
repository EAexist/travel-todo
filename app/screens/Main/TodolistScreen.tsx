import { FC, useCallback, useRef } from 'react'
import {
    SectionList,
    SectionListRenderItem,
    TouchableOpacity,
    View,
} from 'react-native'
//
import {
    NavigateListItemProp,
    NavigateMenuBottomSheet,
} from '@/components/BottomSheet/NavigateMenuBottomSheet'
import { BottomSheetModal } from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import { Label } from '@/components/Label'
import { ListItemBase } from '@/components/ListItem/ListItem'
import { Screen } from '@/components/Screen'
import { AccomodationTodo, CompleteTodo } from '@/components/Todo'
import {
    DoShowSupplyTodosFirstToggleSwitch,
    renderTodolistSectionHeader,
    TodolistSectionT,
    TodolistTabView,
} from '@/components/TodoList'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { MainTabScreenProps } from '@/navigators'
import { useMainScreenHeader } from '@/utils/useHeader'
import { ListItem, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'

export const TodolistScreen: FC<MainTabScreenProps<'Todolist'>> = observer(
    ({}) => {
        const tripStore = useTripStore()

        const {
            theme: { colors },
        } = useTheme()

        const renderItem: SectionListRenderItem<Todo, TodolistSectionT> = ({
            item: todo,
        }) => (
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
                        renderSectionHeader={renderTodolistSectionHeader}
                        keyExtractor={(todo: Todo) => todo.id}
                        ListEmptyComponent={
                            <ListItemBase title={'할 일이 없어요'} />
                        }
                    />
                )
            },
            [
                tripStore.supplyTodolistSectionListData,
                tripStore.workTodolistSectionListData,
            ],
        )
        /* Menu */
        const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

        const handleSettingsButtonPress = useCallback(() => {
            settingsMenuBottomSheetRef.current?.present()
        }, [settingsMenuBottomSheetRef])

        useMainScreenHeader({
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
                <DoShowSupplyTodosFirstToggleSwitch
                    value={tripStore.settings.doShowSupplyTodosFirst}
                    onChange={tripStore.settings.toggleDoShowSupplyTodosFirst}
                />
                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                        paddingVertical: 16,
                    }}>
                    <Label
                        title="완료한 할 일 숨기기"
                        style={{
                            fontSize: 13,
                        }}
                        dense
                        rightContent={
                            <ListItem.CheckBox
                                checked={tripStore.settings.doHideCompletedTodo}
                                onPress={
                                    tripStore.settings.toggleDoHideCompletedTodo
                                }
                                containerStyle={{
                                    width: 'auto',
                                    marginTop: 1,
                                }}
                                checkedColor={colors.contrastText.secondary}
                                size={20}
                            />
                        }
                    />
                </View>
                <TodolistTabView
                    renderTabViewItem={renderTabViewItem}
                    doShowSupplyTodosFirst={
                        tripStore.settings.doShowSupplyTodosFirst
                    }
                    toggleDoShowSupplyTodosFirst={
                        tripStore.settings.toggleDoShowSupplyTodosFirst
                    }
                />
                <NavigateMenuBottomSheet
                    data={settingsOption}
                    ref={settingsMenuBottomSheetRef}
                />
            </Screen>
        )
    },
)
