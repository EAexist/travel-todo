import {
  Avatar as RNEAvatar,
  AvatarProps as RNEAvatarProps,
  Text,
} from '@rneui/themed'
import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { Icon, IconProps } from '@/components/Icon'

export interface AvatarProps extends RNEAvatarProps {
  fontSize?: number
}

export const Avatar = ({
  children,
  icon,
  size = 'small',
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
                size === 'small'
                  ? 18
                  : size === 'medium'
                    ? 24
                    : size === 'large'
                      ? 28
                      : size === 'xlarge'
                        ? 32
                        : size,
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
    <RNEAvatar size={size} {...iconProps} {...props}>
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
