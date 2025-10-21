import { useTripStore } from '@/models'
import { Todo, TodoPresetItem } from '@/models/Todo'
import { useNavigate } from '@/navigators'
import { Trans } from '@lingui/react/macro'
import { useFocusEffect } from '@react-navigation/native'
import { Icon, ListItem, ListItemProps, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native'
import { Avatar, AvatarProps } from '../Avatar'
import { ListItemCaption } from '../ListItem/ListItemCaption'
import { useDelayedEdit } from '@/utils/useDelayedEdit'

interface TodoBaseProps extends Pick<AvatarProps, 'icon'>, ListItemProps {
    title: string
    subtitle?: string
    caption?: string
    rightContent?: ReactNode
    avatarStyle?: StyleProp<ViewStyle>
    contentStyle?: StyleProp<ViewStyle>
    avatarProps?: AvatarProps
    titleStyle?: TextStyle
    onPressContent?: () => void
}

export const TodoBase: FC<TodoBaseProps> = ({
    icon,
    title,
    subtitle,
    caption,
    rightContent,
    contentStyle,
    avatarProps,
    titleStyle,
    onPressContent,
    ...props
}) => {
    return (
        <ListItem {...props}>
            <Avatar icon={icon} size="small" {...avatarProps} />
            <ListItem.Content style={contentStyle || {}}>
                <ListItem.Title style={titleStyle || {}}>
                    <Trans>{title}</Trans>
                    {!!caption && <ListItemCaption>{caption}</ListItemCaption>}
                </ListItem.Title>
                {!!subtitle && (
                    <ListItem.Subtitle>
                        <Trans>{subtitle}</Trans>
                    </ListItem.Subtitle>
                )}
            </ListItem.Content>
            {rightContent}
        </ListItem>
    )
}

export type TodoProps = { id: string } & Pick<
    TodoBaseProps,
    'icon' | 'title' | 'subtitle'
>

export const AddTodo: FC<{ todo: Todo }> = ({ todo }) => {
    const [isAdded, setIsAdded] = useState(true)

    const handlePress = useCallback(() => {
        setIsAdded(!isAdded)
    }, [isAdded, setIsAdded])

    return (
        <TodoBase
            // caption={'추가함'}
            subtitle={
                todo.type == 'flight' || todo.type == 'flightTicket'
                    ? todo.flightTitle
                    : undefined
            }
            onPress={handlePress}
            title={todo.title}
            icon={todo.icon}
            // useDisabledStyle
        />
    )
}

export const AddPresetTodo: FC<{ preset: TodoPresetItem }> = observer(
    ({ preset }) => {
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
    },
)

const styles = StyleSheet.create({
    disabled: { opacity: 0.5 },
})

export const CompleteTodo: FC<{ todo: Todo }> = observer(({ todo }) => {
    const { navigateWithTrip } = useNavigate()
    const tripStore = useTripStore()

    const [displayComplete, setDisplayComplete] = useState(todo.isCompleted)

    const {
        theme: { colors },
    } = useTheme()

    const handleCompletePress = useCallback(() => {
        if (!todo.isCompleted) {
            switch (todo.type) {
                case 'passport':
                    navigateWithTrip('ConfirmPassport', { todoId: todo.id })
                    //   tripStore.completeAndPatchTodo(todo).then(() => {
                    //     navigateWithTrip('ConfirmPassport', {todoId: todo.id})
                    //   })
                    break
                case 'flight':
                    navigateWithTrip('ConfirmFlight', { todoId: todo.id })
                    //   tripStore.completeAndPatchTodo(todo).then(() => {
                    //     navigateWithTrip('ConfirmFlight', {todoId: todo.id})
                    //   })
                    break
                case 'flightTicket':
                    navigateWithTrip('ConfirmFlightTicket', { todoId: todo.id })
                    //   tripStore.completeAndPatchTodo(todo).then(() => {
                    //     navigateWithTrip('ConfirmFlight', {todoId: todo.id})
                    //   })
                    break
                default:
                    setDisplayComplete(prev => !prev)
                    todo.toggleIsCompletedDelayed()
                    break
            }
        } else {
            setDisplayComplete(prev => !prev)
            todo.toggleIsCompletedDelayed()
        }
    }, [])

    const handlePress = useCallback(
        (e: GestureResponderEvent) => {
            console.log(todo.title)
            e.stopPropagation()
            navigateWithTrip('TodoEdit', { todoId: todo.id })
            //   tripStore.setActiveItem(todo)
        },
        [tripStore, todo],
    )

    return (
        <TodoBase
            useDisabledStyle={todo.isCompleted}
            rightContent={
                <ListItem.CheckBox
                    onPress={handleCompletePress}
                    checked={todo.isCompleted || displayComplete}
                    checkedIcon="radio-button-checked"
                    uncheckedIcon="radio-button-unchecked"
                    uncheckedColor={colors.grey2}
                    checkedColor={
                        todo.isCompleted ? colors.grey2 : colors.primary
                    }
                />
            }
            subtitle={
                todo.type == 'flight' || todo.type == 'flightTicket'
                    ? todo.flightTitle
                    : todo.note !== ''
                      ? todo.note
                      : undefined
            }
            onPress={handlePress}
            title={todo.title}
            icon={todo.icon}
        />
    )
})

// export const PassportTodo: FC<{todo: Todo}> = ({todo}) => {
//   const tripStore = useTripStore()

//   const handleCompletePress = useCallback(() => {
//     if(todo.isCompleted)

//       else
//     navigateWithTrip('ConfirmPassport', {todoId: todo.id})
//   }, [todo.id])

//   const handlePress = useCallback(() => {
//     console.log(todo.title)
//     tripStore.setActiveItem(todo)
//   }, [tripStore, todo])

//   return (
//     <TodoBase
//       rightContent={
//         <ListItem.CheckBox
//           onPress={handleCompletePress}
//           checked={todo.isCompleted}
//           checkedIcon="dot-circle-o"
//           uncheckedIcon="circle-o"
//         />
//       }
//       onPressContent={handlePress}
//       {...todo}
//     />
//   )
// }

export const AccomodationTodo: FC<{ todo: Todo }> = ({ todo }) => {
    const { navigateWithTrip } = useNavigate()
    const handlePress = useCallback(() => {
        navigateWithTrip('AccomodationPlan')
    }, [])

    const tripStore = useTripStore()

    return (
        <TodoBase
            rightContent={<ListItem.Chevron size={32} onPress={handlePress} />}
            onPress={handlePress}
            title={todo.title}
            subtitle={tripStore.accomodationTodoStatusText}
            icon={todo.icon}
        />
    )
}

export const ReorderTodo: FC<{ todo: Todo }> = ({ todo }) => {
    return (
        <TodoBase
            subtitle={
                todo.type == 'flight' || todo.type == 'flightTicket'
                    ? todo.flightTitle
                    : todo.note !== ''
                      ? todo.note
                      : undefined
            }
            rightContent={
                <ListItem.Chevron name="drag-handle" type="material" />
            }
            title={todo.title}
            icon={todo.icon}
        />
    )
}

export const DeleteTodo: FC<{ todo: Todo }> = observer(({ todo }) => {
    const setComplete = useCallback(
        (isCompleted: boolean) => {
            todo.setProp('isFlaggedToDelete', isCompleted)
        },
        [todo],
    )

    const { displayComplete, setDisplayComplete } = useDelayedEdit({
        setComplete,
    })
    const {
        theme: { colors },
    } = useTheme()
    const handlePress = useCallback(() => {
        setDisplayComplete(prev => !prev)
    }, [setDisplayComplete])

    return (
        <TodoBase
            subtitle={
                todo.type == 'flight' || todo.type == 'flightTicket'
                    ? todo.flightTitle
                    : todo.note !== ''
                      ? todo.note
                      : undefined
            }
            rightContent={
                <ListItem.CheckBox
                    onPress={handlePress}
                    checked={displayComplete}
                    checkedIcon={
                        <Icon
                            name="undo"
                            type="material"
                            color={colors.text.secondary}
                        />
                    }
                    uncheckedIcon={
                        <Icon name="do-not-disturb-on" color={colors.error} />
                    }
                />
            }
            onPress={handlePress}
            caption={displayComplete ? '삭제함' : undefined}
            {...(displayComplete && {
                contentStyle: styles.disabled,
                avatarProps: {
                    containerStyle: styles.disabled,
                },
            })}
            title={todo.title}
            icon={todo.icon}
        />
    )
})
