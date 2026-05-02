import { Screen } from '@/components'
import BottomSheetModal from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { TodoBase } from '@/components/Todo'
import {
    TodolistEditContent,
    TodolistSectionHeader,
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
import { useResourceQuota } from '@/utils/resourceQuota/useResourceQuota'
import { Icon, ListItem, Text, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import {
    SectionList,
    SectionListRenderItem,
    StyleSheet,
    TextStyle,
    View,
} from 'react-native'

interface TodolistAddScreenBaseProps {
    title: string
    instruction: string
    isInitializingScreen?: boolean
    // fab: ReactNode
    // tripId: string
    // callerName: 'TodolistSetting' | 'TodolistAdd'
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
    const { hasReachedTodoNumberLimit } = useResourceQuota()
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

const AddedTodo: FC<{ todo: Todo; useDisabledStyle?: boolean }> = ({
    todo,
    useDisabledStyle = false,
}) => {
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
            useDisabledStyle={useDisabledStyle}
        />
    )
}

const AddPresetTodo: FC<{
    preset: TodoPresetItem
    useDisabledStyle?: boolean
}> = observer(({ preset, useDisabledStyle = false }) => {
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
            {...(useDisabledStyle &&
                !preset.isFlaggedToAdd && {
                avatarProps: { avatarStyle: styles.disabled },
                contentStyle: styles.disabled,
            })}
            title={preset.content.title}
            subtitle={preset.content.subtitle}
            icon={preset.content.icon}
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
        isInitializingScreen = false,
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
        > = ({ item: { preset, todo } }) =>
                // <Observer
                //     render={() =>
                preset ? (
                    <AddPresetTodo
                        preset={preset}
                        key={preset?.content.id}
                        useDisabledStyle={isInitializingScreen}
                    />
                ) : (
                    <AddedTodo
                        todo={todo as Todo}
                        key={todo?.id}
                        useDisabledStyle={!isInitializingScreen}
                    />
                )
        // }
        // />
        /* BottomSheet */
        const bottomSheetRef = useRef<BottomSheetModal>(null)

        const renderTabViewItem = useCallback(
            (isSupply: boolean) => {
                return (
                    <View style={{ paddingTop: 16, flex: 1 }}>
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
                                    subtitle: '',
                                    onPress: () =>
                                        handleAddCutomTodo('WORK', 'custom'),
                                }}
                                rightContent={<ListItem.Chevron />}
                            />
                        )}

                        <SectionList
                            sections={isSupply ? supplySections : workSections}
                            renderItem={renderItem}
                            renderSectionHeader={props => (
                                <TodolistSectionHeader {...props} />
                            )}
                            keyExtractor={({ todo, preset }) =>
                                todo
                                    ? `todo-${todo.id}`
                                    : `preset-${preset?.content.id}` || ''
                            }
                        />
                    </View>
                )
            },
            [
                handleAddCutomTodo,
                bottomSheetRef.current,
                supplySections,
                workSections,
            ],
        )

        const handlePressNext = async () => {
            tripStore.addFlaggedPreset()
            if (isInitializingScreen) {
                tripStore.initialize()
            }
        }

        return (
            <Screen>
                <ContentTitle title={title} subtitle={instruction} />
                <TodolistEditContent
                    renderTabViewItem={renderTabViewItem}
                    toggleSwitchTabProps={{
                        tabItemProps: {
                            false: {
                                icon:
                                    tripStore.numOfWorkToAdd > 0 ? (
                                        <Text
                                            style={{
                                                ...typography.pretendard.medium,
                                                fontSize: 13,
                                                paddingLeft: 8,
                                            }}
                                            primary>
                                            {`${tripStore.numOfWorkToAdd}`}
                                        </Text>
                                    ) : undefined,
                            },
                            true: {
                                icon:
                                    tripStore.numOfSupplyToAdd > 0 ? (
                                        <Text
                                            style={{
                                                ...typography.pretendard.medium,
                                                fontSize: 13,
                                                paddingLeft: 8,
                                            }}
                                            primary>
                                            {`${tripStore.numOfSupplyToAdd}`}
                                        </Text>
                                    ) : undefined,
                            },
                        },
                    }}
                />
                <Fab.Container>
                    <Fab.NextButton
                        navigateProps={{
                            name: 'Main',
                            params: { screen: 'Todolist' },
                        }}
                        promiseBeforeNavigate={handlePressNext}
                        title={
                            tripStore.numOfAddFlags > 0
                                ? `${tripStore.numOfAddFlags}개 할 일 추가`
                                : '확인'
                        }
                    />
                </Fab.Container>
                {/* <ReservationTypeDropDownBottomSheet
                    ref={bottomSheetRef}
                    callerName={callerName}
                /> */}
            </Screen>
        )
    },
)

// const ReservationTypeDropDownBottomSheet = ({
//     ref,
//     callerName,
// }: {
//     ref: RefObject<BottomSheetModal | null>
//     callerName: 'TodolistSetting' | 'TodolistAdd'
// }) => {
//     const { handleAddCutomTodo } = useHandleAddCutomTodo({ callerName })

//     const { useActiveKey, handleBottomSheetModalChange, activate } =
//         useNavigationMenuBottomSheet(ref)

//     useActiveKey(activeKey => handleAddCutomTodo('RESERVATION', activeKey))

//     interface ReservationTypeOptionData {
//         type: string
//         title: string
//         avatarProps: AvatarProps
//         isManaged?: boolean
//     }

//     const options: ReservationTypeOptionData[] = [
//         {
//             type: 'flight',
//             title: '항공권',
//             avatarProps: {
//                 icon: { name: '✈️' },
//                 containerStyle: { backgroundColor: 'bisque' },
//             },
//         },
//         // {
//         //   type: 'train',
//         //   title: '열차',
//         //   avatarProps: {icon: {name: '🚅'}, containerStyle: {backgroundColor: 'bisque'}},
//         // },
//         {
//             type: 'custom',
//             title: '직접 입력',
//             avatarProps: {
//                 icon: { name: '✏️' },
//                 containerStyle: { backgroundColor: 'bisque' },
//             },
//         },
//         // {
//         //     type: 'accomodation',
//         //     title: '숙박 예약',
//         //     avatarProps: { icon: {name:'🛌'}, containerStyle: { backgroundColor: 'bisque' } },
//         //     isManaged: true,
//         // },
//     ]

//     const renderReservationTypeListItem: ListRenderItem<ReservationTypeOptionData> =
//         useCallback(
//             ({ item }) => {
//                 const handlePress = () => activate(item.type)

//                 return (
//                     <ListItem
//                         onPress={handlePress}
//                         disabled={item.isManaged}
//                         useDisabledStyle={item.isManaged}>
//                         <Avatar
//                             //   size="medium"
//                             {...item.avatarProps}
//                         />
//                         <ListItem.Content>
//                             <ListItem.Title>{item.title}</ListItem.Title>
//                         </ListItem.Content>
//                         <ListItem.Chevron
//                             iconProps={
//                                 item.isManaged ? { name: 'check' } : undefined
//                             }
//                         />
//                     </ListItem>
//                 )
//             },
//             [activate],
//         )

//     return (
//         <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
//             <ContentTitle title={'에약 할 일 추가하기'} />
//             <FlatList
//                 data={options}
//                 renderItem={renderReservationTypeListItem}
//                 keyExtractor={item => item.title}
//             />
//         </BottomSheetModal>
//     )
// }

const $titleStyleHighlighted: TextStyle = {
    ...typography.pretendard.bold,
}
