import {Calendar} from '@/components/Calendar'
import {TransText} from '@/components/TransText'
import {useTripStore} from '@/models'
import {
  DateInterval,
  getNightsParsed,
  toCalendarString,
  toLocaleDateMonthString,
} from '@/utils/date'
import {Text, useTheme} from '@rneui/themed'
import {eachDayOfInterval} from 'date-fns'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {TextStyle, View, ViewStyle} from 'react-native'
import {DateData} from 'react-native-calendars'
import {MarkedDates} from 'react-native-calendars/src/types'

export const ScheduleText: FC<{startDate?: Date; endDate?: Date}> = ({
  startDate,
  endDate,
}) => {
  const {
    theme: {colors},
  } = useTheme()

  return (
    <View style={$scheduleTextContainerStyle}>
      <TransText style={$scheduleTextStyle} disabled={!startDate}>
        {toLocaleDateMonthString(startDate) || '떠나는 날'}
      </TransText>
      <Text style={{...$scheduleTextStyle, opacity: 0.5}}>{' - '}</Text>
      <TransText style={$scheduleTextStyle} disabled={!endDate}>
        {toLocaleDateMonthString(endDate) || '돌아오는 날'}
      </TransText>
      {'  '}
      <TransText style={{...$nightsTextStyle, color: colors.text.secondary}}>
        {startDate && endDate && getNightsParsed(startDate, endDate)}
      </TransText>
    </View>
  )
}

export const ScheduleSettingCalendar = ({
  dateInterval,
  setDateInterval,
}: {
  dateInterval: DateInterval
  setDateInterval: Dispatch<SetStateAction<DateInterval>>
}) => {
  const handleDayPress = useCallback(
    (dateData: DateData) => {
      const date = new Date(dateData.dateString)
      if (dateInterval.end) {
        setDateInterval(() => ({start: date, end: undefined}))
      } else if (dateInterval.start) {
        if (date > dateInterval.start) {
          setDateInterval(dateInterval => ({...dateInterval, end: date}))
        } else {
          setDateInterval(() => ({start: date, end: undefined}))
        }
      } else {
        setDateInterval(dateInterval => ({...dateInterval, start: date}))
      }
    },
    [dateInterval.start, dateInterval.end, setDateInterval],
  )

  useEffect(() => {
    // console.log(`start: ${dateInterval.start}\nend: ${dateInterval.end}`)
  }, [dateInterval.start, dateInterval.end])

  const start = dateInterval.start
  const end = dateInterval.end

  const [markedDates, setMarkedDates] = useState<MarkedDates>()

  useEffect(() => {
    // console.log(`start: ${start}`)
    // console.log(`end: ${end}`)
    // console.log(`markedDates: ${Object.entries(markedDates)}`)
    setMarkedDates(() => {
      const intervalDays =
        start && end && eachDayOfInterval({start, end}).slice(1, -1)
      const o: MarkedDates = {}
      if (start) {
        o[toCalendarString(start)] = {
          startingDay: true,
          endingDay: end ? undefined : true,
        }
      }
      if (end) {
        o[toCalendarString(end)] = {endingDay: true}
      }
      if (intervalDays) {
        intervalDays.forEach(date => {
          o[toCalendarString(date)] = {selected: true}
        })
      }
      return o
    })
  }, [start, end])

  return (
    <Calendar
      // initialDate={toCalendarString(tripStore.start)}
      markingType="period"
      markedDates={markedDates}
      onDayPress={handleDayPress}
      hideArrows={false}
    />
  )
}

// export const ScheduleSettingCalendar: FC = () => {
//   const tripStore = useTripStore()

//   const [dateInterval, setDateInterval] = useState<DateInterval>({
//     start: tripStore.startDateISOString
//       ? new Date(tripStore.startDateISOString)
//       : undefined,
//     end: tripStore.endDateISOString
//       ? new Date(tripStore.endDateISOString)
//       : undefined,
//   })

//   return (
//     <>
//       <View style={{paddingHorizontal: 24}}>
//         <ScheduleText
//           startDate={dateInterval.start}
//           endDate={dateInterval.end}
//         />
//       </View>
//       <View style={$calendarContainerStyle}>
//         <ScheduleSettingCalendarBase
//           dateInterval={dateInterval}
//           setDateInterval={setDateInterval}
//         />
//       </View>
//     </>
//   )
// }
export const $calendarContainerStyle: ViewStyle = {
  padding: 24,
  width: '100%',
}

const $scheduleTextContainerStyle: TextStyle = {
  flexDirection: 'row',
  alignItems: 'stretch',
}

const $scheduleTextStyle: TextStyle = {
  fontWeight: 600,
  fontSize: 17,
}

const $nightsTextStyle: TextStyle = {
  fontWeight: 500,
  fontSize: 14,
  paddingLeft: 12,
  lineHeight: 14 * 2,
}
