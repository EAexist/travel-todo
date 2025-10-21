import { Trans } from '@lingui/react/macro'
import { ListItem, ListItemProps, useTheme } from '@rneui/themed'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { DimensionValue, TextStyle, ViewStyle } from 'react-native'
import { ListItemCaption } from './ListItem/ListItemCaption'
import { TransText } from './TransText'

export interface TextInfoListItemProps extends ListItemProps {
    title?: string
    subtitle?: string
    caption?: string
    rightContent?: ReactNode
    // children: ReactNode
}

export const TextInfoListItem: FC<PropsWithChildren<TextInfoListItemProps>> = ({
    title,
    subtitle,
    caption,
    children,
    rightContent,
    ...props
}) => {
    const {
        theme: { colors },
    } = useTheme()

    return (
        <ListItem {...props} containerStyle={$cotainerStyle}>
            <ListItem.Content style={{ ...$titleContainerstyle() }}>
                {title && (
                    <ListItem.Title
                        style={{ color: colors.contrastText.secondary }}
                        // style={
                        //   subtitle
                        //     ? listItemStyles.TitleWithSubtitle
                        //     : listItemStyles.TitleOnly
                        // }
                    >
                        <Trans>{title}</Trans>
                        {caption && (
                            <ListItemCaption>{caption}</ListItemCaption>
                        )}
                    </ListItem.Title>
                )}
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
            {rightContent || null}
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

const $titleContainerstyle = (): ViewStyle => {
    let width: DimensionValue
    // switch (titleSize) {
    //     case 'lg':
    //         width = '45%'
    //         break
    //     case 'md':
    //     default:
    //         width = '25%'
    //         break
    // }
    return {
        width: '25%',
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 'auto',
    }
}
const $contentTextStyle: TextStyle = {
    //   textAlign: 'right',
}
