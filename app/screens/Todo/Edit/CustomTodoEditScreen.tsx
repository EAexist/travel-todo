import { Avatar } from '@/components/Avatar'
import {
    CategoryListItemProp,
    CategoryMenuBottomSheet,
} from '@/components/BottomSheet/CategoryMenuBottomSheet'
import BottomSheetModal from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import { ControlledListItemInput } from '@/components/Input'
import { Label } from '@/components/Label'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import { Screen } from '@/components/Screen'
import StyledSwitch from '@/components/StyledSwitch'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import { useTripStore } from '@/models'
import { Icon } from '@/models/Icon'
import {
    TODO_CATEGORY_TO_ICON,
    TODO_CATEGORY_TO_TITLE,
    Todo,
    TodoCategory,
    isSupplyCategory,
} from '@/models/Todo'
import { goBack, useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { IconObject } from '@rneui/base'
import { ListItem, Text, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    SectionListData,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'

export const CustomTodoEditScreen: FC<{
    todo: Todo
    isBeforeInitialization?: boolean
}> = observer(({ todo, isBeforeInitialization }) => {
    const [title, setTitle] = useState(todo.title)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const categoryBottomSheetModalRef = useRef<BottomSheetModal>(null)
    const iconBottomSheetModalRef = useRef<BottomSheetModal>(null)
    const { navigateWithTrip } = useNavigate()
    const tripStore = useTripStore()

    const handleConfirmPress = useCallback(() => {
        setIsConfirmed(true)
        todo.setTitle(title)
        todo.patch()
        goBack()
    }, [title])

    const handleIconPress = useCallback(() => {
        iconBottomSheetModalRef.current?.present()
    }, [iconBottomSheetModalRef])

    const handleNotePress = useCallback(() => {
        console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
        navigateWithTrip('TodoNote', {
            todoId: todo.id,
        })
    }, [navigateWithTrip, todo.id])

    const handleCategoryPress = useCallback(() => {
        categoryBottomSheetModalRef.current?.present()
    }, [categoryBottomSheetModalRef])

    /* IconMenu */
    // const [icon, setIcon] = useState<Icon>(todo.icon)

    // const ICONS = [
    //     { name: '🛌', type: 'tossface' },
    //     { name: '💱', type: 'tossface' },
    //     { name: '💲', type: 'tossface' },
    //     { name: '📶', type: 'tossface' },
    //     { name: '📝', type: 'tossface' },
    //     { name: '🔌', type: 'tossface' },
    //     { name: '🧳', type: 'tossface' },
    //     { name: '🎒', type: 'tossface' },
    //     { name: '📸', type: 'tossface' },
    //     { name: '☂️', type: 'tossface' },
    //     // {name: '💊', type: 'tossface'},
    //     // {name: '🧴', type: 'tossface'},
    //     // {name: '💄', type: 'tossface'},
    //     // {name: '🪒', type: 'tossface'},
    //     // {name: '🕶', type: 'tossface'},
    //     // {name: '✈️', type: 'tossface'},
    //     // {name: '🛫', type: 'tossface'},
    //     // {name: '🚄', type: 'tossface'},
    //     // {name: '🚆', type: 'tossface'},
    //     // {name: '🚕', type: 'tossface'},
    //     // {name: '⛴', type: 'tossface'},
    //     // {name: '🎢', type: 'tossface'},
    //     // {name: '⛩', type: 'tossface'},
    //     // {name: '🐶', type: 'tossface'},
    //     // {name: '🐱', type: 'tossface'},
    //     // {name: '⭐️', type: 'tossface'},
    // ]

    // const iconMenu: { icon: Icon }[] = ICONS.map(icon => ({ icon }))

    // const handlePressNewIcon = useCallback(
    //     (icon: Icon) => {
    //         setIcon(icon)
    //     },
    //     [setIcon],
    // )
    // const {
    //     theme: { colors },
    // } = useTheme()

    // const renderIconListItem: ListRenderItem<{ icon: Icon }> = useCallback(
    //     ({ item }) => {
    //         return (
    //             <TouchableOpacity onPress={() => handlePressNewIcon(item.icon)}>
    //                 <Avatar
    //                     size="medium"
    //                     icon={item.icon}
    //                     // containerStyle={
    //                     //   item.icon.name === todo.icon.name
    //                     //     ? {
    //                     //         backgroundColor: 'bisque',
    //                     //       }
    //                     //     : {}
    //                     // }
    //                     // containerStyle={$iconAvataContainerStyle}
    //                 />
    //                 {/* <RNEAvatar.Accessory
    //               iconProps={{name: 'check'}}
    //               avatarSize={20}
    //               style={{
    //                 bottom: -20,
    //                 right: -20,
    //                 transform: [{translateX: '-50%'}, {translateY: '-50%'}],
    //               }}
    //             />
    //           </Avatar> */}
    //             </TouchableOpacity>
    //         )
    //     },
    //     [],
    // )

    // const handleCloseIconBottomSheet = useCallback(() => {
    //     todo.setIcon(icon)
    //     iconBottomSheetModalRef.current?.close()
    // }, [todo, iconBottomSheetModalRef.current])

    /* categoryMenu */
    const categoryMenuSections = Object.values(
        Object.entries(TODO_CATEGORY_TO_TITLE)
            .map(([category, title]) => {
                return {
                    category: category,
                    title,
                    avatarProps: {
                        icon: TODO_CATEGORY_TO_ICON[category],
                    },
                    isActive: category === todo.category,
                }
            })
            .reduce(
                (
                    acc: Record<
                        string,
                        { title: string; data: CategoryListItemProp[] }
                    >,
                    currentItem: CategoryListItemProp,
                ) => {
                    // Determine the category for the current item
                    const section = isSupplyCategory(
                        currentItem.category as TodoCategory,
                    )
                        ? 'SUPPLY'
                        : 'WORK'
                    if (!acc[section]) {
                        acc[section] = {
                            title: section === 'SUPPLY' ? '준비할 짐' : '할 일',
                            data: [],
                        }
                    }
                    acc[section].data.push(currentItem)

                    return acc
                },
                {},
            ),
    )

    const handleBackPressBeforeNavigate = useCallback(async () => {
        if (!isConfirmed && isBeforeInitialization)
            tripStore.deleteTodo(todo.id)
    }, [])

    useHeader({ onBackPressBeforeNavigate: handleBackPressBeforeNavigate })

    const [isFocused, setIsFocused] = useState(false)
    return (
        <Screen>
            <ContentTitle
                variant="listItem"
                title={
                    <ControlledListItemInput
                        onChangeText={setTitle}
                        value={title}
                        placeholder={'할 일 이름 입력'}
                        autoFocus={isBeforeInitialization}
                        onBlur={() => setIsFocused(false)}
                        onFocus={() => setIsFocused(true)}
                        inputContainerStyle={{
                            borderBottomWidth: isFocused ? 2 : 0,
                        }}
                        primary={isFocused}
                        containerStyle={{
                            paddingLeft: 0,
                        }}
                    />
                }
                subtitle={todo.content.isStock ? todo.categoryTitle : undefined}
                leftComponent={
                    <Observer
                        render={() => (
                            <TouchableOpacity>
                                <Avatar
                                    icon={todo.icon}
                                    avatarSize={'xlarge'}
                                />
                            </TouchableOpacity>
                        )}
                    />
                }
            />
            <TextInfoListItem
                title={'상태'}
                rightContent={
                    <StyledSwitch
                        isActive={todo.isCompleted}
                        onChange={todo.toggleIsCompleted}
                        iconProps={{
                            true: {
                                name: 'check',
                                type: 'material',
                            },
                            false: {
                                name: 'remove',
                                type: 'material',
                            },
                        }}
                    />
                }>
                <Text>{todo.isCompleted ? '완료' : '미완료'}</Text>
            </TextInfoListItem>
            {!todo.content.isStock && (
                <TextInfoListItem
                    title={'카테고리'}
                    rightContent={<ListItem.Chevron />}
                    onPress={handleCategoryPress}>
                    <TransText>
                        {todo.categoryTitle || '카테고리 선택'}
                    </TransText>
                </TextInfoListItem>
            )}
            <TextInfoListItem
                onPress={handleNotePress}
                title={'메모'}
                rightContent={<ListItem.Chevron />}>
                <TransText primary={!todo.note} numberOfLines={2}>
                    {todo.note || '메모를 남겨보세요'}
                </TransText>
            </TextInfoListItem>
            <Fab.Container>
                <Fab.Button
                    disabled={title.length == 0}
                    onPress={handleConfirmPress}
                    title={'확인'}
                />
            </Fab.Container>
            <CategoryDropdownBottomSheet />
            <CategoryMenuBottomSheet
                ref={categoryBottomSheetModalRef}
                sections={categoryMenuSections}
                setCategory={(category: string) => {
                    todo.setCategory(category as TodoCategory)
                }}
            />
        </Screen>
    )
})

// const IconDropdownBottomSheet = () => {
//     return
//             <BottomSheetModal ref={iconBottomSheetModalRef}>
//                 <ContentTitle title={'아이콘 선택'} />
//                 <View
//                     style={{
//                         paddingTop: 12,
//                         paddingBottom: 24,
//                         alignItems: 'center',
//                     }}>
//                     <Avatar icon={icon} avatarSize={64} rounded={true} />
//                 </View>
//                 <FlatList
//                     data={iconMenu}
//                     renderItem={renderIconListItem}
//                     keyExtractor={item => item.icon.name}
//                     numColumns={5}
//                     columnWrapperStyle={$d}
//                     contentContainerStyle={$s}
//                 />
//                 <Fab.Container fixed={false} dense>
//                     <Fab.Button
//                         title={'저장'}
//                         onPress={handleCloseIconBottomSheet}
//                     />
//                 </Fab.Container>
//             </BottomSheetModal>
// }

const CategoryDropdownBottomSheet = () => {
    return <></>
}

const $listItemContainerStyle: ViewStyle = {
    height: 60,
}

const $d: ViewStyle = {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
}

const $s: ViewStyle = {
    gap: 32,
}

const $iconAvataContainerStyle: ViewStyle = {
    // width: 72,
    // height: 72,
    // height: 64
}
