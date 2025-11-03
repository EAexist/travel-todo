import { Calendar } from '@/components/Calendar/Calendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import { ScheduleViewerCalendarBase } from '@/components/Calendar/ScheduleViewerCalendar'
import * as Fab from '@/components/Fab'
import { Screen } from '@/components/Screen'
import { useReservationStore, useTripStore } from '@/models'
import { Accomodation } from '@/models/Reservation/Accomodation'
import { Reservation } from '@/models/Reservation/Reservation'
import { useNavigate } from '@/navigators'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { AccomodationAvatar } from './AccomodationAvatar'

const AccomodationPlanCalendar: FC = observer(() => {
    const reservationStore = useReservationStore()

    const tripStore = useTripStore()

    const markedDates =
        reservationStore.accomodationMarkedDatesMultiPeriodMarking

    return tripStore.isScheduleSet ? (
        <ScheduleViewerCalendarBase
            markingType="multi-period"
            markedDates={markedDates}
        />
    ) : (
        <Calendar markingType="multi-period" markedDates={markedDates} />
    )
})

const AccomodationListItem: FC<{
    reservation: Reservation
}> = ({ reservation }) => {
    const { navigateWithTrip } = useNavigate()
    const accomodation = reservation.accomodation as Accomodation

    const handlePress = useCallback(() => {
        navigateWithTrip('Reservation', { reservationId: reservation.id })
    }, [])

    return (
        <ListItem onPress={handlePress} containerStyle={{ height: 64 }}>
            <AccomodationAvatar accomodation={accomodation} />
            <ListItem.Content>
                {accomodation.title && (
                    <ListItem.Title>{accomodation.title}</ListItem.Title>
                )}
                {accomodation.nightsParsed && (
                    <ListItem.Subtitle>
                        {accomodation.nightsParsed}
                    </ListItem.Subtitle>
                )}
            </ListItem.Content>
        </ListItem>
    )
}

export const AccomodationPlanScreen: FC = observer(({}) => {
    const reservationStore = useReservationStore()

    const renderListItem: ListRenderItem<{
        reservation: Reservation
        index: number
    }> = ({ item }) => {
        return <AccomodationListItem reservation={item.reservation} />
    }

    useHeader({
        centerComponent: (
            <HeaderCenterTitle
                title="숙박 예약"
                //   icon={{name: '🛌'}}
            />
        ),
    })

    return (
        <Screen>
            <CalendarContainer>
                <AccomodationPlanCalendar />
            </CalendarContainer>
            <FlatList
                data={reservationStore.orderedAccomodationReservations.map(
                    (reservation, index) => ({
                        index,
                        reservation,
                    }),
                )}
                renderItem={renderListItem}
                keyExtractor={item => item.reservation.id}
                style={{ flexGrow: 0 }}
                // contentContainerStyle={{ paddingHorizontal: 20 }}
            />
            <Fab.Container>
                <Fab.NextButton
                    title={'숙박 예약 추가하기'}
                    navigateProps={{
                        name: 'ReservationCreate',
                        params: {
                            category: 'ACCOMODATION',
                        },
                    }}
                />
            </Fab.Container>
        </Screen>
    )
})

// const $palette = [
//   // '#9BF6FF',
//   '#A0C4FF',
//   '#BDB2FF',
//   '#FFC6FF',
//   '#FFADAD',
//   '#FFD6A5',
//   '#FDFFB6',
//   '#CAFFBF',
// ]
