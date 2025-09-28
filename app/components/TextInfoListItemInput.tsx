import { ListItemInputProps } from '@rneui/base'
import { ListItem, useTheme } from '@rneui/themed'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { TextStyle } from 'react-native'

export interface TextInfoListItemInputProps extends ListItemInputProps {}

export const TextInfoListItemInput: FC<
  PropsWithChildren<TextInfoListItemInputProps>
> = ({ ...props }) => {
  const { theme } = useTheme()

  return <ListItem.Input {...props} inputStyle={$inputStyle} />
}
const $inputStyle: TextStyle = {
  fontWeight: 400,
  fontSize: 17,
  textAlign: 'right',
}
