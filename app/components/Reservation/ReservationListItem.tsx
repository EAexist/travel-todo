import { ListItemBase } from '@/components/ListItem/ListItem'
import { Reservation } from '@/models/Reservation/Reservation'
import { useNavigate } from '@/navigators'
import { ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'

export const ReservationListItem: FC<{ reservation: Reservation }> = observer(
    ({ reservation }) => {
        const { navigateWithTrip } = useNavigate()

        const handlePress = useCallback(async () => {
            navigateWithTrip('Reservation', {
                reservationId: reservation.id,
            })
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
