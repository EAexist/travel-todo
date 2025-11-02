import { Trans } from '@lingui/react/macro'
import { ListItem, ListItemProps, useTheme } from '@rneui/themed'
import { FC, ReactNode } from 'react'
import { Avatar, AvatarProps } from '../Avatar'
import { TextStyle } from 'react-native'

export interface ListItemBaseProps extends ListItemProps {
    title?: string
    subtitle?: string | ReactNode
    avatarProps?: AvatarProps
    rightContent?: ReactNode
    primary?: boolean
    titleColor?: 'primary' | 'secondary'
    subtitleStyle?: TextStyle
}

export const ListItemBase: FC<ListItemBaseProps> = ({
    title,
    subtitle,
    avatarProps,
    rightContent,
    primary = false,
    titleColor = 'primary',
    subtitleStyle,
    ...props
}) => {
    const { theme } = useTheme()
    const { colors } = theme
    return (
        <ListItem {...props}>
            {avatarProps && (
                <Avatar
                    {...avatarProps}
                    icon={{
                        ...avatarProps.icon,
                        color: props.useDisabledStyle
                            ? colors.text.secondary
                            : avatarProps.icon?.color || colors.primary,
                    }}
                />
            )}
            <ListItem.Content>
                {title && (
                    <ListItem.Title
                        primary={primary}
                        style={
                            titleColor === 'secondary'
                                ? { color: colors.text.secondary }
                                : {}
                        }>
                        <Trans>{title}</Trans>
                    </ListItem.Title>
                )}
                {subtitle && (
                    <ListItem.Subtitle style={[subtitleStyle]}>
                        <Trans>{subtitle}</Trans>
                    </ListItem.Subtitle>
                )}
            </ListItem.Content>
            {rightContent}
        </ListItem>
    )
}
