import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { useNavigate } from '@/navigators'
import { Trans } from '@lingui/react/macro'
import { ListItem, ListItemProps, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import {
    GestureResponderEvent,
    StyleProp,
    TextStyle,
    ViewStyle,
} from 'react-native'
import { Avatar, AvatarProps } from '../Avatar'
import { ListItemCaption } from '../ListItem/ListItemCaption'

interface TodoBaseProps extends Pick<AvatarProps, 'icon'>, ListItemProps {
    title: string
    subtitle?: string
    caption?: ReactNode
    rightContent?: ReactNode
    avatarStyle?: StyleProp<ViewStyle>
    contentStyle?: StyleProp<ViewStyle>
    avatarProps?: AvatarProps
    titleStyle?: TextStyle
    onPressContent?: () => void
}

export interface CheckBoxItemProps {
    isChecked: boolean
    onPress: () => void
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
                    {!!caption && typeof caption === 'string' ? (
                        <ListItemCaption>{caption}</ListItemCaption>
                    ) : (
                        caption
                    )}
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

export const useHandleConfirmTodo = (todo: Todo) => {
    const { navigateWithTrip } = useNavigate()
    const handleConfirm = useCallback(() => {
        switch (todo.type) {
            case 'PASSPORT':
                navigateWithTrip('ConfirmPassport', { todoId: todo.id })
                return false
            case 'FLIGHT_OUTBOUND':
            case 'FLIGHT_RETURN':
                navigateWithTrip('ConfirmFlight', { todoId: todo.id })
                return false
            case 'FLIGHT_TICKET':
                navigateWithTrip('ConfirmFlightTicket', { todoId: todo.id })
                return false
            case 'VISIT_JAPAN':
                navigateWithTrip('ConfirmVisitJapan', { todoId: todo.id })
                return false
            default:
                return true
        }
    }, [todo.type])
    return { handleConfirm }
}

export const CompleteTodo: FC<{ todo: Todo }> = observer(({ todo }) => {
    const { navigateWithTrip } = useNavigate()
    const tripStore = useTripStore()

    const [displayComplete, setDisplayComplete] = useState(todo.isCompleted)

    const { handleConfirm } = useHandleConfirmTodo(todo)
    const {
        theme: { colors },
    } = useTheme()

    const handleCompletePress = useCallback(() => {
        if (!todo.isCompleted) {
            const isConfirmed = handleConfirm()
            if (isConfirmed) {
                setDisplayComplete(prev => !prev)
                todo.toggleIsCompletedDelayed()
            }
        } else {
            setDisplayComplete(prev => !prev)
            todo.toggleIsCompletedDelayed()
        }
    }, [])

    useEffect(() => {
        setDisplayComplete(todo.isCompleted)
    }, [todo.isCompleted])

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
                    checked={displayComplete}
                    checkedIcon="radio-button-checked"
                    uncheckedIcon="radio-button-unchecked"
                    uncheckedColor={colors.grey2}
                    checkedColor={
                        todo.isCompleted ? colors.grey2 : colors.primary
                    }
                />
            }
            subtitle={todo.subtitle}
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

export const AccomodationTodo: FC<{ todo: Todo }> = observer(({ todo }) => {
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
})

export const ReorderTodo: FC<{ todo: Todo }> = ({ todo }) => {
    return (
        <TodoBase
            subtitle={todo.subtitle}
            rightContent={
                <ListItem.Chevron name="drag-handle" type="material" />
            }
            title={todo.title}
            icon={todo.icon}
        />
    )
}
