import { Avatar } from '@/components/Avatar'
import { TransText } from '@/components/TransText'
import { IconObject } from '@rneui/base'
import { ListItem, useTheme } from '@rneui/themed'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

interface TitleProps {
    children: ReactNode
}

export const Title: FC<TitleProps> = ({ children }) => (
    <View style={styles.TitleContainer}>{children}</View>
)

interface TitleTextProps extends PropsWithChildren {}

export const TitleText: FC<TitleTextProps> = ({ children }) => (
    <View style={styles.TitleTextContainer}>
        {typeof children === 'string' ? (
            <TransText h2>{children}</TransText>
        ) : (
            children
        )}
    </View>
)

interface SubtitleTextProps extends PropsWithChildren {}

export const SubtitleText: FC<SubtitleTextProps> = ({ children }) => {
    const { theme } = useTheme()
    return (
        <View style={styles.SubtitleTextContainer}>
            <TransText style={{ color: theme.colors.text.secondary }}>
                {children}
            </TransText>
        </View>
    )
}

export interface ContentTitleProps {
    title?: ReactNode
    subtitle?: ReactNode
    icon?: IconObject
    leftComponent?: ReactNode
    rightComponent?: ReactNode
    variant?: 'default' | 'listItem'
    useSubtitleAvatar?: boolean
}

export default function ContentTitle({
    title,
    subtitle,
    icon,
    leftComponent,
    rightComponent,
    variant = 'default',
    useSubtitleAvatar = false,
}: ContentTitleProps) {
    switch (variant) {
        case 'listItem':
            return (
                <Title>
                    <ListItem containerStyle={styles.ListItemContainer}>
                        {leftComponent ??
                            (!useSubtitleAvatar && icon ? (
                                <Avatar icon={icon} avatarSize={'xlarge'} />
                            ) : null)}
                        <ListItem.Content>
                            <ListItem.Subtitle style={styles.SubtitleContainer}>
                                {useSubtitleAvatar && icon ? (
                                    <Avatar icon={icon} avatarSize={'xsmall'} />
                                ) : null}
                                {subtitle}
                            </ListItem.Subtitle>
                            <ListItem.Title
                                style={{ minHeight: 40, alignItems: 'center' }}>
                                {typeof title === 'string' ? (
                                    <TransText h2>{title}</TransText>
                                ) : (
                                    title
                                )}
                            </ListItem.Title>
                        </ListItem.Content>
                        {rightComponent}
                    </ListItem>
                </Title>
            )
        default:
            return (
                <Title>
                    <TitleText>{title}</TitleText>
                    {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
                </Title>
            )
    }
}

const styles = StyleSheet.create({
    TitleContainer: {
        paddingVertical: 20,
    },
    SubtitleTextContainer: {
        paddingHorizontal: 24,
    },
    TitleTextContainer: {
        paddingHorizontal: 24,
    },
    ListItemContainer: {
        height: 60,
    },
    SubtitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
})
