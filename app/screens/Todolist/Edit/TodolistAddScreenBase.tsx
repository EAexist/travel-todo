import { Screen } from '@/components'
import { Avatar, AvatarProps } from '@/components/Avatar'
import BottomSheetModal, {
    useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { TodoBase } from '@/components/Todo'
import {
    renderTodolistSectionHeader,
    TodolistEditContent,
    TodolistSectionT,
} from '@/components/TodoList'
import { useTripStore } from '@/models'
import {
    isSupplyCategory,
    Todo,
    TodoCategory,
    TodoPresetItem,
} from '@/models/Todo'
import { useNavigate } from '@/navigators'
import { typography } from '@/rneui/theme'
import { Divider, Icon, ListItem, Text, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { string } from 'mobx-state-tree/dist/internal'
import { FC, ReactNode, RefObject, useCallback, useRef, useState } from 'react'
import {
    DefaultSectionT,
    FlatList,
    ListRenderItem,
    ScrollView,
    SectionList,
    SectionListRenderItem,
    StyleSheet,
    TextStyle,
    View,
} from 'react-native'

interface TodolistAddScreenBaseProps {
    title: string
    instruction: string
    fab: ReactNode
    tripId: string
    callerName: 'TodolistSetting' | 'TodolistAdd'
}

export const useAddFlaggedPreset = () => {
    const tripStore = useTripStore()
    const addFlaggedPreset = useCallback(() => {
        tripStore.addFlaggedPreset()
    }, [tripStore])
    return addFlaggedPreset
}

export const useHandleAddCutomTodo = ({
    callerName,
}: {
    callerName?: 'TodolistSetting' | 'TodolistAdd'
}) => {
    const { createCustomTodo } = useTripStore()
    const { navigateWithTrip } = useNavigate()
    const handleAddCutomTodo = useCallback(
        (category: TodoCategory, type: string) => {
            const todo = createCustomTodo(category, type)
            console.log(`useHandleAddCutomTodo] todo: ${JSON.stringify(todo)}`)
            if (todo) {
                let path = ''
                switch (todo.type) {
                    case 'flight':
                        path = 'CreateFlightTodo'
                        break
                    case 'flightTicket':
                        path = 'CreateFlightTicketTodo'
                        break
                    default:
                        path = 'CreateCustomTodo'
                        break
                }

                navigateWithTrip(path, {
                    todoId: todo?.id,
                    isInitializing: true,
                    callerName,
                })
            }
        },
        [createCustomTodo],
    )
    return {
        handleAddCutomTodo,
    }
}

const AddTodo: FC<{ todo: Todo }> = ({ todo }) => {
    const [isAdded, setIsAdded] = useState(true)

    const handlePress = useCallback(() => {
        setIsAdded(!isAdded)
    }, [isAdded, setIsAdded])

    return (
        <TodoBase
            // caption={'추가함'}
            subtitle={todo.subtitle}
            onPress={handlePress}
            title={todo.title}
            icon={todo.icon}
            // useDisabledStyle
        />
    )
}

const AddPresetTodo: FC<{ preset: TodoPresetItem }> = observer(({ preset }) => {
    const handlePress = useCallback(() => {
        preset.toggleAddFlag()
    }, [preset])

    const {
        theme: { colors },
    } = useTheme()
    return (
        <TodoBase
            rightContent={
                <ListItem.CheckBox
                    onPress={handlePress}
                    checked={preset.isFlaggedToAdd}
                    checkedIcon={<Icon name="check-circle" />}
                    uncheckedIcon={
                        <Icon
                            name="check-circle-outline"
                            color={colors.grey1}
                        />
                    }
                />
            }
            onPress={handlePress}
            {...(!preset.isFlaggedToAdd && {
                avatarProps: { avatarStyle: styles.disabled },
                contentStyle: styles.disabled,
            })}
            title={preset.todoContent.title}
            icon={preset.todoContent.icon}
        />
    )
})

const styles = StyleSheet.create({
    disabled: { opacity: 0.4 },
})

export const TodolistAddScreenBase = observer(
    ({
        title,
        instruction,
        fab,
        tripId,
        callerName,
    }: TodolistAddScreenBaseProps) => {
        const tripStore = useTripStore()

        const { handleAddCutomTodo } = useHandleAddCutomTodo({})

        const workSections = tripStore.todosWithPreset.filter(
            ({ category }) => !isSupplyCategory(category),
        )

        const supplySections = tripStore.todosWithPreset.filter(
            ({ category }) => isSupplyCategory(category),
        )

        const renderItem: SectionListRenderItem<
            { todo?: Todo; preset?: TodoPresetItem },
            TodolistSectionT
        > = ({ item: { preset, todo } }) => (
            <Observer
                render={() =>
                    preset ? (
                        <AddPresetTodo
                            preset={preset}
                            key={preset?.todoContent.id}
                        />
                    ) : (
                        <AddTodo todo={todo as Todo} key={todo?.id} />
                    )
                }
            />
        )
        /* BottomSheet */
        const bottomSheetRef = useRef<BottomSheetModal>(null)
        const renderTabIcon = useCallback((isTodo: boolean) => {
            const numberOfAddFlag = isTodo
                ? tripStore.numOfTodoToAdd
                : tripStore.numOfGoodsToAdd

            return numberOfAddFlag > 0 ? (
                <Text style={{ ...typography.pretendard.medium }} primary>
                    {`  ${numberOfAddFlag}`}
                </Text>
            ) : null
        }, [])

        const renderTabViewItem = useCallback(
            (isSupply: boolean) => {
                return (
                    <ScrollView style={{ paddingTop: 16 }}>
                        {isSupply ? (
                            <TodoBase
                                avatarProps={{
                                    icon: { name: 'add', type: 'material' },
                                }}
                                titleStyle={$titleStyleHighlighted}
                                {...{
                                    title: '직접 추가하기',
                                    subtitle: '',
                                    onPress: () =>
                                        handleAddCutomTodo('SUPPLY', 'custom'),
                                }}
                            />
                        ) : (
                            <TodoBase
                                avatarProps={{
                                    icon: { name: 'add', type: 'material' },
                                }}
                                titleStyle={$titleStyleHighlighted}
                                {...{
                                    title: '직접 추가하기',
                                    // subtitle: '항공권 · 기차표 · 입장권',
                                    onPress: () => {
                                        bottomSheetRef.current?.present()
                                    },
                                }}
                            />
                        )}

                        <SectionList
                            sections={isSupply ? supplySections : workSections}
                            renderItem={renderItem}
                            renderSectionHeader={renderTodolistSectionHeader}
                            keyExtractor={({ todo, preset }) =>
                                todo
                                    ? `todo-${todo.id}`
                                    : `preset-${preset?.todoContent.id}` || ''
                            }
                        />
                    </ScrollView>
                )
            },
            [handleAddCutomTodo, bottomSheetRef.current],
        )

        return (
            <Screen>
                <ContentTitle title={title} subtitle={instruction} />
                <TodolistEditContent renderTabViewItem={renderTabViewItem} />
                {fab}
                <ReservationTypeDropDownBottomSheet
                    ref={bottomSheetRef}
                    callerName={callerName}
                />
            </Screen>
        )
    },
)

const ReservationTypeDropDownBottomSheet = ({
    ref,
    callerName,
}: {
    ref: RefObject<BottomSheetModal | null>
    callerName: 'TodolistSetting' | 'TodolistAdd'
}) => {
    const { handleAddCutomTodo } = useHandleAddCutomTodo({ callerName })

    const { useActiveKey, handleBottomSheetModalChange, activate } =
        useNavigationBottomSheet(ref)

    useActiveKey(activeKey => handleAddCutomTodo('RESERVATION', activeKey))

    interface ReservationTypeOptionData {
        type: string
        title: string
        avatarProps: AvatarProps
        isManaged?: boolean
    }

    const options: ReservationTypeOptionData[] = [
        {
            type: 'flight',
            title: '항공권',
            avatarProps: {
                icon: { name: '✈️' },
                containerStyle: { backgroundColor: 'bisque' },
            },
        },
        // {
        //   type: 'train',
        //   title: '열차',
        //   avatarProps: {icon: {name: '🚅'}, containerStyle: {backgroundColor: 'bisque'}},
        // },
        {
            type: 'custom',
            title: '직접 입력',
            avatarProps: {
                icon: { name: '✏️' },
                containerStyle: { backgroundColor: 'bisque' },
            },
        },
        // {
        //     type: 'accomodation',
        //     title: '숙박 예약',
        //     avatarProps: { icon: {name:'🛌'}, containerStyle: { backgroundColor: 'bisque' } },
        //     isManaged: true,
        // },
    ]

    const renderReservationTypeListItem: ListRenderItem<ReservationTypeOptionData> =
        useCallback(
            ({ item }) => {
                const handlePress = () => activate(item.type)

                return (
                    <ListItem
                        onPress={handlePress}
                        disabled={item.isManaged}
                        useDisabledStyle={item.isManaged}>
                        <Avatar
                            //   size="medium"
                            {...item.avatarProps}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron
                            iconProps={
                                item.isManaged ? { name: 'check' } : undefined
                            }
                        />
                    </ListItem>
                )
            },
            [activate],
        )

    return (
        <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
            <ContentTitle title={'에약 할 일 추가하기'} />
            <FlatList
                data={options}
                renderItem={renderReservationTypeListItem}
                keyExtractor={item => item.title}
            />
        </BottomSheetModal>
    )
}

const $titleStyleHighlighted: TextStyle = {
    fontWeight: 700,
}
