import { Avatar, AvatarProps } from '@/components/Avatar'
import { useReservationStore } from '@/models'
import { Accomodation } from '@/models/Reservation/Accomodation'
import { useTheme } from '@rneui/themed'
import { FC } from 'react'

export const AccomodationAvatar: FC<{
    accomodation: Accomodation
    avatarProps?: AvatarProps
    isColored?: boolean
}> = ({ accomodation, avatarProps, isColored = true }) => {
    const reservationStore = useReservationStore()
    const {
        theme: { colors },
    } = useTheme()

    return (
        <Avatar
            icon={{
                color: isColored ? colors.white : colors.text.primary,
                ...avatarProps?.icon,
                ...accomodation.icon,
            }}
            containerStyle={[
                isColored
                    ? {
                          backgroundColor:
                              colors.palette[
                                  reservationStore.orderedAccomodations.indexOf(
                                      accomodation,
                                  )
                              ],
                      }
                    : {},
                avatarProps?.containerStyle,
            ]}
            {...avatarProps}
        />
    )
}
