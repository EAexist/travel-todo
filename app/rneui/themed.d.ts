import { ListSubheaderProps } from '@/components/ListItem/ListSubheader'
import { SectionHeaderProps } from '@/components/SectionHeader'
import '@rneui/themed'
import {
    IconProps as RNEIconProps,
    TabItemProps,
    TabProps,
} from '@rneui/themed'
import { ColorValue, PressableProps } from 'react-native'

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
        icon: {
            secondary: string
        }
        transparent: string
        light0: string
        light1: string
        active: string
        inactive: string
        secondaryBg: string
        palette: string[]
        brand: string
    }
    export interface ListItemProps {
        dense?: boolean
        backgroundColor?: 'primary' | 'secondary'
        useDisabledStyle?: boolean
        asCard?: boolean
    }
    export interface IconProps {
        primary?: boolean
    }
    export interface TextProps {
        primary?: boolean
    }
    export interface InputProps {
        size?: 'small' | 'medium'
        primary?: boolean
    }
    export interface AvatarProps {
        avatarSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number
    }
    // export interface ListItemInputProps {
    //     primary?: boolean
    // }
    export interface ListItemSubtitleProps extends Partial<TextProps> {
        color?: ColorValue
    }
    export interface SwitchTabProps extends Partial<TabProps> {
        size?: 'md' | 'lg'
        // variant?: 'primary' | 'secondary'
    }
    export interface SwitchTabItemProps extends Partial<TabItemProps> {
        // size?: 'medium' | 'large'
        // variant?: 'primary' | 'secondary'
    }

    export interface StyledSwitchprops extends Partial<PressableProps> {
        variant?: 'default' | 'secondary'
        isActive: boolean
        size?: 'md' | 'lg'
        onChange: () => void
        iconProps: {
            true: RNEIconProps
            false: RNEIconProps
        }
    }

    export interface ComponentTheme {
        ListSubheader: Partial<ListSubheaderProps>
        SectionHeader: Partial<SectionHeaderProps>
        ListItemSubTitle: Partial<ListItemSubtitleProps>
        // ListItem: Partial<ListItemProps> & {
        //     Title: Partial<ListItemTitleProps>,
        //     Input: Partial<ListItemInputProps>
        // }
        Text: Partial<TextProps>
        Input: Partial<InputProps>
        Icon: Partial<IconProps>
        SectionCard: Partial<CardProps>
        SwitchTab: SwitchTabProps
        SwitchTabItem: SwitchTabItemProps
        StyledSwitch: StyledSwitchprops
    }
    // export interface ListItem {
    //   Caption: Component
    // }
}
