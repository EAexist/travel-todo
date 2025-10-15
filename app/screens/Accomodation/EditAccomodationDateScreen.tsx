import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import { ScheduleViewerCalendarBase } from '@/components/Calendar/ScheduleViewerCalendar'
import * as Fab from '@/components/Fab'
import { Screen } from '@/components/Screen'
import { useReservationStore, useTripStore } from '@/models'
import { toCalendarString } from '@/utils/date'
import {
  $headerCenterTitleContainerStyle,
  HeaderCenterTitle,
  useHeader,
} from '@/utils/useHeader'
import { eachDayOfInterval } from 'date-fns'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { MarkedDates } from 'react-native-calendars/src/types'

const AccomodationDateEditCalendar: FC = observer(() => {
  const reservationStore = useReservationStore()

  //   const markedDates = Object.fromEntries(
  //     tripStore.calendarMarkedDateEntries.map(([k, { colorIndex, ...v }]) => [
  //       k,
  //       { color: $palette[colorIndex], ...v },
  //     ]),
  //   )
  //   useEffect(() => {
  //     console.log(markedDates)
  //   }, [markedDates])

  //   const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const markedDates = reservationStore.accomodation
    .map(r => {
      const start = r.accomodation?.checkinDate
      const end = r.accomodation?.checkoutDate
      const intervalDays =
        start &&
        end &&
        eachDayOfInterval({
          start: start,
          end: end,
        }).slice(1, -1)
      const o: MarkedDates = {}
      if (start) {
        o[toCalendarString(start)] = {
          startingDay: true,
          endingDay: end ? undefined : true,
        }
      }
      if (end) {
        o[toCalendarString(end)] = { endingDay: true }
      }
      if (intervalDays) {
        intervalDays.forEach(date => {
          o[toCalendarString(date)] = { selected: true }
        })
      }
      return o
    })
    .reduce((accumulator, currentObject) => {
      return { ...accumulator, ...currentObject }
    }, {})

  // useEffect(() => {
  //   // console.log(`start: ${start}`)
  //   // console.log(`end: ${end}`)
  //   console.log(`markedDates: ${Object.entries(markedDates)}`)
  //   setMarkedDates(prev => {
  //     const intervalDays =
  //       start &&
  //       end &&
  //       eachDayOfInterval({
  //         start: start,
  //         end: end,
  //       }).slice(1, -1)
  //     const o: MarkedDates = {}
  //     if (start) {
  //       o[toCalendarString(start)] = {
  //         startingDay: true,
  //         endingDay: end ? undefined : true,
  //       }
  //     }
  //     if (end) {
  //       o[toCalendarString(end)] = { endingDay: true }
  //     }
  //     if (intervalDays) {
  //       intervalDays.forEach(date => {
  //         o[toCalendarString(date)] = { selected: true }
  //       })
  //     }
  //     return o
  //   })
  // }, [start, end, setMarkedDates])

  useEffect(() => {
    console.log(markedDates)
  }, [markedDates])

  return (
    <ScheduleViewerCalendarBase
      initialDate={
        Object.keys(markedDates).length > 0
          ? Object.keys(markedDates)[0]
          : undefined
      }
      markingType="period"
      markedDates={markedDates}
    />
  )
})

// const AccomodationListItem: FC<{
//   item: Accomodation
// }> = ({ item }) => {
//   const tripStore = useTripStore()
//   const { navigateWithTrip } = useNavigate()
//   const handlePress = useCallback(() => {
//     navigateWithTrip('Accomodation', { accomodationId: item.id })
//   }, [])
//   useEffect(() => {
//     console.log(item)
//   }, [])
//   const {
//     theme: { colors },
//   } = useTheme()
//   return (
//     <ListItemBase
//       title={item.title}
//       subtitle={item.nightsParsed}
//       avatarProps={{
//         icon: {
//           color: colors.white,
//           ...(item.type === 'hotel'
//             ? { type: 'font-awesome-5', name: 'hotel' }
//             : item.type === 'airbnb'
//               ? { type: 'font-awesome-5', name: 'airbnb' }
//               : item.type === 'dorm'
//                 ? { type: 'material-community', name: 'bunk-bed-outline' }
//                 : { type: 'material-community', name: 'bunk-bed-outline' }),
//         },
//         containerStyle: {
//           backgroundColor:
//             $palette[tripStore.indexedUniqueTitles.indexOf(item.title)],
//         },
//       }}
//       onPress={handlePress}
//       containerStyle={{ height: 64 }}
//     />
//   )
// }

export const EditAccomodationDateScreen: FC = observer(({}) => {
  const tripStore = useTripStore()

  useHeader({
    centerComponent: (
      <HeaderCenterTitle
        title="숙박 예약"
        //   icon={{name: '🛌'}}
      />
    ),
    centerContainerStyle: $headerCenterTitleContainerStyle,
  })
  const [markedDates, setMarkedDates] = useState<MarkedDates>()
  return (
    <Screen>
      <CalendarContainer>
        <AccomodationDateEditCalendar />
      </CalendarContainer>
      {/* <FlatList
        data={tripStore.orderedAccomodationReservations.map((item, index) => ({
          index,
          item,
        }))}
        renderItem={renderListItem}
        keyExtractor={item => item.item.id}
        style={{ flexGrow: 0 }}
        // contentContainerStyle={{ paddingHorizontal: 20 }}
      /> */}
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

const $palette = [
  // '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
  '#FFADAD',
  '#FFD6A5',
  '#FDFFB6',
  '#CAFFBF',
]
