import '@rneui/themed'
import { ListSubheaderProps } from '@/components/ListSubheader'
import { SectionHeaderProps } from '@/components/SectionHeader'

declare module '@rneui/themed' {
  export interface Colors {
    text: {
      primary: string
      secondary: string
    }
    contrastText: {
      primary: string
      secondary: string
    }
    transparent: string
    light0: string
    light1: string
    active: string
    inactive: string
    secondaryBg: string
    palette: string[]
  }
  export interface ListItemProps {
    dense?: boolean
    backgroundColor?: 'primary' | 'secondary'
    useDisabledStyle?: boolean
    asCard?:boolean = false
  }
  export interface IconProps {
    primary?: boolean
  }
  export interface TextProps {
    primary?: boolean
  }
  export interface InputProps {
    primary?: boolean
  }
  export interface AvatarProps {
    avatarSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number
  }
  // export interface ListItemInputProps {
  //     primary?: boolean
  // }
  // export interface ListItemTitleProps extends Partial<TextProps> {
  //     primary?: boolean
  // }
  export interface ComponentTheme {
    ListSubheader: Partial<ListSubheaderProps>
    SectionHeader: Partial<SectionHeaderProps>
    // ListItem: Partial<ListItemProps> & {
    //     Title: Partial<ListItemTitleProps>,
    //     Input: Partial<ListItemInputProps>
    // }
    Text: Partial<TextProps>
    Input: Partial<InputProps>
    Icon: Partial<IconProps>
    SectionCard: Partial<CardProps>
  }
  // export interface ListItem {
  //   Caption: Component
  // }
}
