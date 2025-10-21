import { useTripStore } from '@/models'
import { TripSummary } from '@/models/stores/TripStore'
import { Chip, ListItem, useTheme } from '@rneui/themed'
import { BookmarkCheck } from 'lucide-react-native'
import { FC, ReactElement, useEffect } from 'react'

export interface TripListItemProps {
    item: TripSummary
    leftContent?: ReactElement
    renderRightContent?: (item: TripSummary) => ReactElement
    onPress?: (item: TripSummary) => void
    subtitle?: string
    asCard?: boolean
    disabled?: boolean
}

export const TripListItem: FC<TripListItemProps> = ({
    item,
    leftContent,
    renderRightContent,
    onPress,
    subtitle,
    asCard = true,
    disabled = false,
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
            {leftContent && leftContent}
            {isActive && <BookmarkCheck color={colors.primary} size={28} />}
            <ListItem.Content>
                <ListItem.Title>{item.title || '새 여행'}</ListItem.Title>
                {item.isInitialized &&
                    (item.destination.length > 0 ||
                        item.scheduleText.length > 0) && (
                        <ListItem.Subtitle>
                            {(item.destination.length > 0
                                ? [item.destination.slice(0, 2).join(' ')]
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
                {!item.isInitialized && (
                    <ListItem.Subtitle>
                        {`${new Date(item.createDateIsoString).toLocaleString()} 생성`}
                    </ListItem.Subtitle>
                )}
                {subtitle && <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>}
            </ListItem.Content>
            {!item.isInitialized && <Chip title={'설정 중'} size="sm" />}
            {item.isCompleted && <Chip title={'종료'} size="sm" />}
            {renderRightContent && renderRightContent(item)}
        </ListItem>
    )
}
