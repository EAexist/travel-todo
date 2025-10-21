import { Trans } from '@lingui/react/macro'
import { ListItem, ListItemProps, useTheme } from '@rneui/themed'
import { FC, ReactNode } from 'react'
import { Avatar, AvatarProps } from '../Avatar'

export interface ListItemBaseProps extends ListItemProps {
    title?: string
    subtitle?: string | ReactNode
    avatarProps?: AvatarProps
    rightContent?: ReactNode
    primary?: boolean
    titleColor?: 'primary' | 'secondary'
}

export const ListItemBase: FC<ListItemBaseProps> = ({
    title,
    subtitle,
    avatarProps,
    rightContent,
    primary = false,
    titleColor = 'primary',
    ...props
}) => {
    const {
        theme: { colors },
    } = useTheme()
    return (
        <ListItem {...props}>
            {avatarProps && <Avatar {...avatarProps} />}
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
                    <ListItem.Subtitle>
                        <Trans>{subtitle}</Trans>
                    </ListItem.Subtitle>
                )}
            </ListItem.Content>
            {rightContent}
        </ListItem>
    )
}
