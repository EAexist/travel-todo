import { ListItem, ListItemProps } from '@rneui/themed'
import { FC, ReactNode } from 'react'
import { Avatar, AvatarProps } from './Avatar'
import { Trans } from '@lingui/react/macro'

export interface ListItemBaseProps extends ListItemProps {
  title?: string
  subtitle?: string
  avatarProps?: AvatarProps
  rightContent?: ReactNode
}

export const ListItemBase: FC<ListItemBaseProps> = ({
  title,
  subtitle,
  avatarProps,
  rightContent,
  ...props
}) => {
  return (
    <ListItem {...props}>
      {avatarProps && <Avatar {...avatarProps} />}
      <ListItem.Content>
        {title && (
          <ListItem.Title>
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
