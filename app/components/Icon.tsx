import {Icon as RNEIcon, IconProps as RNEIconProps} from '@rneui/themed'

export interface IconProps extends RNEIconProps {}

export const Icon = (props: IconProps) => {
  //   const { theme, updateTheme, replaceTheme } = props

  return <RNEIcon type={'tossface'} {...props} />
}
