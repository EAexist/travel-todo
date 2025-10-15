import { TripSummary } from '@/models/stores/TripStore'
import { ListItem } from '@rneui/themed'
import { FC } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar } from '../Avatar'
import SectionCard from '../SectionCard'

export interface TripSummaryListItemBaseProps {
  tripSummary: TripSummary
  onPress?: (tripSummary: TripSummary) => void
}

export const TripSummaryListItemBase: FC<TripSummaryListItemBaseProps> = ({
  tripSummary,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress ? () => onPress(tripSummary) : undefined}>
      <SectionCard>
        <ListItem>
          <Avatar />
          <ListItem.Content>
            <ListItem.Title>{tripSummary.title}</ListItem.Title>
            <ListItem.Subtitle>
              {[
                tripSummary.scheduleText,
                tripSummary.destination.join(' '),
              ].join('ㆍ')}
            </ListItem.Subtitle>
          </ListItem.Content>
          {/* {tripSummary.id === tripStore.id && <Icon name="star" />} */}
          <ListItem.Chevron />
        </ListItem>
      </SectionCard>
    </TouchableOpacity>
  )
}
