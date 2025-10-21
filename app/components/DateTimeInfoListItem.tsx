import { Trans } from '@lingui/react/macro'
import { ListItem, ListItemProps, useTheme } from '@rneui/themed'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { DimensionValue, TextStyle, ViewStyle } from 'react-native'
import { ListItemCaption } from './ListItem/ListItemCaption'
import { TransText } from './TransText'
import { Avatar } from './Avatar'

export type TitleSizeType = 'md' | 'lg'

export interface DateTimeInfoListItemProps extends ListItemProps {
    title: string
    subtitle?: string
    caption?: string
    rightContent?: ReactNode
    titleSize?: TitleSizeType
    // contentStyle?: StyleProp<ViewStyle>
    // children: ReactNode
}

export const DateTimeInfoListItem: FC<
    PropsWithChildren<DateTimeInfoListItemProps>
> = ({
    title,
    subtitle,
    caption,
    children,
    rightContent,
    titleSize = 'md',
    ...props
}) => {
    const { theme } = useTheme()

    return (
        <ListItem {...props} containerStyle={$cotainerStyle}>
            <ListItem.Content style={{ ...$titleContainerstyle(titleSize) }}>
                <ListItem.Title
                    style={{ color: theme.colors.contrastText.secondary }}
                    // style={
                    //   subtitle
                    //     ? listItemStyles.TitleWithSubtitle
                    //     : listItemStyles.TitleOnly
                    // }
                >
                    <Trans>{title}</Trans>
                    {caption && <ListItemCaption>{caption}</ListItemCaption>}
                </ListItem.Title>
                {subtitle && (
                    <ListItem.Subtitle>
                        <Trans>{subtitle}</Trans>
                    </ListItem.Subtitle>
                )}
            </ListItem.Content>
            <ListItem.Content style={$contentstyle}>
                {typeof children === 'string' ? (
                    <TransText style={$contentTextStyle}>{children}</TransText>
                ) : (
                    children
                )}
            </ListItem.Content>
            {rightContent}
        </ListItem>
    )
}

const $cotainerStyle: ViewStyle = {
    paddingHorizontal: 24,
}

const $contentstyle: ViewStyle = {
    flexGrow: 1,
    alignItems: 'flex-end',
}

const $titleContainerstyle = (titleSize: TitleSizeType): ViewStyle => {
    let width: DimensionValue
    switch (titleSize) {
        case 'lg':
            width = '35%'
            break
        case 'md':
        default:
            width = '25%'
            break
    }
    return {
        width,
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 'auto',
    }
}
const $contentTextStyle: TextStyle = {
    //   textAlign: 'right',
}
