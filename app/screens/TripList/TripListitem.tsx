import { useTripStore } from '@/models'
import { TripSummary } from '@/models/stores/TripStore'
import { Chip, ListItem, useTheme } from '@rneui/themed'
import { BookmarkCheck } from 'lucide-react-native'
import { observer } from 'mobx-react-lite'
import { FC, ReactElement } from 'react'
import { View } from 'react-native'

export interface TripListItemProps {
    item: TripSummary
    leftContent?: ReactElement
    renderRightContent?: (item: TripSummary) => ReactElement
    onPress?: (item: TripSummary) => void
    subtitle?: string
    asCard?: boolean
    disabled?: boolean
    showCreateDate?: boolean
}

export const TripListItem: FC<TripListItemProps> = observer(
    ({
        item,
        leftContent,
        renderRightContent,
        onPress,
        subtitle,
        asCard = true,
        disabled = false,
        showCreateDate = false,
    }) => {
        const tripStore = useTripStore()
        const isActive = tripStore !== null && item.id === tripStore.id

        const {
            theme: { colors },
        } = useTheme()

        return (
            <ListItem
                useDisabledStyle={disabled}
                onPress={onPress ? () => onPress(item) : undefined}
                disabled={disabled || !onPress}
                asCard={asCard}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        gap: 16,
                    }}>
                    {leftContent && leftContent}
                    {isActive && (
                        <BookmarkCheck color={colors.primary} size={28} />
                    )}
                    <ListItem.Content style={{ flex: 1 }}>
                        <ListItem.Title>
                            {item.title || '새 여행'}
                        </ListItem.Title>
                        {item.isInitialized &&
                            (item.destinationTitles.length > 0 ||
                                item.scheduleText.length > 0) && (
                                <ListItem.Subtitle key={'metadata'}>
                                    {(item.destinationTitles.length > 0
                                        ? [
                                              item.destinationTitles
                                                  .slice(0, 2)
                                                  .join(' '),
                                          ]
                                        : []
                                    )
                                        .concat(
                                            item.scheduleText.length > 0
                                                ? [item.scheduleText]
                                                : [],
                                        )
                                        .join('ㆍ')}
                                </ListItem.Subtitle>
                            )}
                        {(!item.isInitialized || showCreateDate) && (
                            <ListItem.Subtitle key={'createDateIsoString'}>
                                {`${new Date(item.createDateIsoString).toLocaleString()} 생성`}
                            </ListItem.Subtitle>
                        )}
                        {subtitle && (
                            <ListItem.Subtitle key={'subtitle'}>
                                {subtitle}
                            </ListItem.Subtitle>
                        )}
                    </ListItem.Content>
                    {!item.isInitialized && (
                        <Chip title={'설정 중'} size="sm" />
                    )}
                    {item.isCompleted && <Chip title={'종료'} size="sm" />}
                    {renderRightContent && renderRightContent(item)}
                </View>
            </ListItem>
        )
    },
)
