import {
  Avatar as RNEAvatar,
  AvatarProps as RNEAvatarProps,
  Text,
} from '@rneui/themed'
import {PropsWithChildren} from 'react'
import {StyleSheet} from 'react-native'

export interface AvatarProps extends RNEAvatarProps {
  fontSize?: number
}

export const Avatar = ({
  children,
  icon,
  fontSize,
  ...props
}: PropsWithChildren<AvatarProps>) => {
  return (
    <RNEAvatar
      {...(!icon?.type || icon?.type === 'tossface'
        ? {
            renderCustomContent: (
              <Text style={{...styles.titleStyle, fontSize}}>{icon?.name}</Text>
            ),
          }
        : {icon})}
      {...props}>
      {children}
    </RNEAvatar>
  )
}

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'Tossface',
    textAlign: 'center',
    overflow: 'hidden',
  },
})

// export default withTheme<AvatarProps>(Avatar, 'Avatar')
