import { FC, useCallback } from 'react'
//
import { useNavigate } from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import { ListItemBase } from '@/components/ListItem'
import { Reservation } from '@/models/Reservation/Reservation'
import { ListItem } from '@rneui/themed'
import * as WebBrowser from 'expo-web-browser'
import { observer } from 'mobx-react-lite'
import { useStores, useTripStore } from '@/models'

export const ReservationListItem: FC<{ reservation: Reservation }> = observer(
  ({ reservation }) => {
    const { navigateWithTrip } = useNavigate()
    const tripStore = useTripStore()

    const handlePress = useCallback(async () => {
      if (tripStore.isTripMode && reservation.primaryHrefLink) {
        await WebBrowser.openBrowserAsync(reservation.primaryHrefLink)
      } else {
        navigateWithTrip('Reservation', {
          reservationId: reservation.id,
        })
      }
    }, [])

    return (
      <ListItemBase
        avatarProps={{ icon: reservation.icon }}
        title={reservation.title}
        subtitle={reservation.subtitle || undefined}
        onPress={handlePress}
        rightContent={
          <ListItem.Chevron
            name="link"
            disabled={!reservation.primaryHrefLink}
          />
        }
      />
    )
  },
)
