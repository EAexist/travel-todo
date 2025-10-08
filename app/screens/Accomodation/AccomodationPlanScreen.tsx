import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import { useScheduleSettingCalendar } from '@/components/Calendar/useScheduleSettingCalendar'
import { ScheduleViewerCalendarBase } from '@/components/Calendar/ScheduleViewerCalendar'
import * as Fab from '@/components/Fab'
import { ListItemBase } from '@/components/ListItem'
import { Screen } from '@/components/Screen'
import { useStores, useTripStore } from '@/models'
import { Accomodation } from '@/models/Reservation/Accomodation'
import { Reservation } from '@/models/Reservation/Reservation'
import { useNavigate } from '@/navigators'
import { toCalendarString } from '@/utils/date'
import {
  $headerCenterTitleContainerStyle,
  HeaderCenterTitle,
  useHeader,
} from '@/utils/useHeader'
import { useTheme } from '@rneui/themed'
import { eachDayOfInterval } from 'date-fns'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { ListRenderItem } from 'react-native'
import { MarkedDates } from 'react-native-calendars/src/types'

const AccomodationPlanCalendar: FC = observer(() => {
  const { reservationStore } = useStores()

  const {
    theme: { colors },
  } = useTheme()

  const markedDates = Object.fromEntries(
    Object.entries(
      reservationStore.accomodationCalendarMarkedDatesWithColorIndex,
    ).map(([k, { periods }]) => [
      k,
      {
        periods: periods.map(({ colorIndex, ...v }) => ({
          ...v,
          color: colors.palette[colorIndex],
        })),
      },
    ]),
  )

  useEffect(() => {
    console.log(reservationStore.accomodationCalendarMarkedDatesWithColorIndex)
  }, [reservationStore.accomodationCalendarMarkedDatesWithColorIndex])

  return (
    <ScheduleViewerCalendarBase
      markingType="multi-period"
      markedDates={markedDates}
    />
  )
})

const AccomodationListItem: FC<{
  reservation: Reservation
}> = ({ reservation }) => {
  const { reservationStore } = useStores()
  const { navigateWithTrip } = useNavigate()
  const accomodation = reservation.accomodation as Accomodation

  const handlePress = useCallback(() => {
    navigateWithTrip('Reservation', { reservationId: reservation.id })
  }, [])

  const {
    theme: { colors },
  } = useTheme()

  return (
    <ListItemBase
      title={accomodation.title || ''}
      subtitle={accomodation.nightsParsed || undefined}
      avatarProps={{
        icon: {
          color: colors.white,
          ...(accomodation.type === 'hotel'
            ? { type: 'font-awesome-5', name: 'hotel' }
            : accomodation.type === 'airbnb'
              ? { type: 'font-awesome-5', name: 'airbnb' }
              : accomodation.type === 'dorm'
                ? { type: 'material-community', name: 'bunk-bed-outline' }
                : { type: 'material-community', name: 'bed-king-outline' }),
        },
        containerStyle: accomodation.title
          ? {
              backgroundColor:
                colors.palette[
                  reservationStore.orderedAccomodationReservations.indexOf(
                    reservation,
                  )
                ],
            }
          : {},
      }}
      onPress={handlePress}
      containerStyle={{ height: 64 }}
    />
  )
}

export const AccomodationPlanScreen: FC = observer(({}) => {
  const { reservationStore } = useStores()

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
    centerContainerStyle: $headerCenterTitleContainerStyle,
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
              defaultCategory: 'ACCOMODATION',
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
