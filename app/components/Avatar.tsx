import {
  Avatar as RNEAvatar,
  AvatarProps as RNEAvatarProps,
  Text,
} from '@rneui/themed'
import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { Icon, IconProps } from '@/components/Icon'

export interface AvatarProps extends Omit<RNEAvatarProps, 'avatarSize'> {
  fontSize?: number
  avatarSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number
}

export const Avatar = ({
  children,
  icon,
  avatarSize = 'small',
  size,
  ...props
}: PropsWithChildren<AvatarProps>) => {
  let iconProps: Partial<RNEAvatarProps>

  switch (icon?.type || 'tossface') {
    case 'tossface':
      iconProps = {
        renderCustomContent: (
          <Text
            style={{
              ...styles.titleStyle,
              fontSize:
                avatarSize === 'xsmall'
                  ? 16
                  : avatarSize === 'small'
                    ? 18
                    : avatarSize === 'medium'
                      ? 24
                      : avatarSize === 'large'
                        ? 28
                        : avatarSize === 'xlarge'
                          ? 32
                          : avatarSize,
            }}>
            {icon?.name}
          </Text>
        ),
      }
      break
    case 'image':
      iconProps = {
        renderCustomContent: <Icon {...(icon as IconProps)} />,
      }
      break
    default:
      iconProps = {
        icon,
      }
      break
  }
  return (
    <RNEAvatar avatarSize={avatarSize} {...iconProps} {...props}>
      {children}
    </RNEAvatar>
  )
}

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'Tossface',
    textAlign: 'center',
    // overflow: 'hidden',
  },
})

// export default withTheme<AvatarProps>(Avatar, 'Avatar')
