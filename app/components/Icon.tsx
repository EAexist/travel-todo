import {IconProps as RNEIconProps, Icon as RNEIcon, Text} from '@rneui/themed'

export interface IconProps extends RNEIconProps {}

export const Icon = ({type = 'tossface', ...props}: IconProps) => {
  return type === 'tossface' ? (
    <Text>{props.name}</Text>
  ) : (
    <RNEIcon {...props} />
  )
}
