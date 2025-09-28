import { TransText } from '@/components/TransText'
import { useTheme } from '@rneui/themed'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import * as Fab from '@/components/Fab'
import { Note } from '@/components/Note'
import { Screen } from '@/components/Screen'
import { useTripStore } from '@/models'
import { useHeader } from '@/utils/useHeader'
import { withTodo } from '@/utils/withTodo'
import { Trans } from '@lingui/react/macro'
import { ListItem } from '@rneui/themed'
import { useCallback, useState } from 'react'
import { ViewStyle } from 'react-native'
import { Icon } from '@/models/Icon'
import { Avatar } from '@/components/Avatar'

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
  icon?: Icon
  leftComponent?: ReactNode
  variant?: 'default' | 'listItem'
}

export default function ContentTitle({
  title,
  subtitle,
  icon,
  leftComponent,
  variant = 'default',
}: ContentTitleProps) {
  switch (variant) {
    case 'listItem':
      return (
        <Title>
          <ListItem containerStyle={styles.ListItemContainer}>
            {leftComponent ??
              (icon ? <Avatar icon={icon} size={'xlarge'} /> : null)}
            <ListItem.Content>
              <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>
              <ListItem.Title>
                {typeof title === 'string' ? (
                  <TransText h2>{title}</TransText>
                ) : (
                  title
                )}
              </ListItem.Title>
            </ListItem.Content>
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
})
