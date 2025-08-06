import * as Fab from '@/components/Fab'
import {Trans} from '@lingui/react/macro'
import {Header, Icon, useTheme} from '@rneui/themed'
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import * as Layout from '../../components/Layout'
import {Calendar} from '@/components/Calendar'
import {useStores} from '@/models'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {DateData} from 'react-native-calendars'
import {TransText} from '@/components/TransText'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components'
import {getNightsParsed, toCalendarString} from '@/utils/date'
import {eachDayOfInterval} from 'date-fns'
import {TextInfoListItem} from '@/components/TextInfoListItem'
import {MarkedDates} from 'react-native-calendars/src/types'

type DateInterval = {
  start?: Date
  end?: Date
}
const ScheduleSettingCalendar = ({
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
  // const intervalDays =
  //   start && end && eachDayOfInterval({start, end}).slice(1, -1)
  // const markedDates_ = Object.fromEntries([
  //   start ? [toCalendarString(start), {startingDay: true, color: 'red'}] : [],
  //   end ? [toCalendarString(end), {endingDay: true, color: 'red'}] : [],
  //   ...(intervalDays
  //     ? intervalDays.map((date, index) => [
  //         toCalendarString(date),
  //         {
  //           selected: true,
  //           color: 'red',
  //         },
  //       ])
  //     : [[]]),
  // ])

  // const markedDates = [
  //   start ? [toCalendarString(start), {startingDay: true, color: 'red'}] : [],
  //   end ? [toCalendarString(end), {endingDay: true, color: 'red'}] : [],
  //   ...(intervalDays
  //     ? intervalDays.map((date, index) => [
  //         toCalendarString(date),
  //         {
  //           selected: true,
  //           color: 'red',
  //         },
  //       ])
  //     : [[]]),
  // ].reduce((o, curr)=>>{
  //   return o
  // })

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

export const ScheduleSettingScreen: FC = () => {
  const {tripStore} = useStores()
  const {
    theme: {colors},
  } = useTheme()

  const [dateInterval, setDateInterval] = useState<DateInterval>({
    start: tripStore.startDateISOString
      ? new Date(tripStore.startDateISOString)
      : undefined,
    end: tripStore.endDateISOString
      ? new Date(tripStore.endDateISOString)
      : undefined,
  })

  const isScheduleSet = dateInterval.start !== undefined

  const toLocaleDateMonthString = (date?: Date) =>
    date
      ? `${date?.toLocaleDateString(undefined, {
          month: 'short',
        })} ${date?.toLocaleDateString(undefined, {
          day: 'numeric',
        })}`
      : undefined

  const scheduleText = (
    <>
      {
        <TransText style={$dateTextStyle} disabled={!dateInterval.start}>
          {toLocaleDateMonthString(dateInterval.start) || '떠나는 날'}
        </TransText>
      }
      {' - '}
      {
        <TransText style={$dateTextStyle} disabled={!dateInterval.end}>
          {toLocaleDateMonthString(dateInterval.end) || '돌아오는 날'}
        </TransText>
      }
      {'  '}
      <TransText
        style={{...$nightsTextStyle, color: colors.text.secondary}}
        disabled={!dateInterval.end}>
        {dateInterval.start &&
          dateInterval.end &&
          getNightsParsed(dateInterval.start, dateInterval.end)}
      </TransText>
    </>
  )
  const handleNextPress = useCallback(async () => {
    tripStore.setProp(
      'startDateISOString',
      dateInterval.start?.toISOString() || '',
    )
    tripStore.setProp('endDateISOString', dateInterval.end?.toISOString() || '')
    await tripStore.patch()
  }, [tripStore, dateInterval.start, dateInterval.end])

  return (
    <Screen>
      <ContentTitle
        title={'언제 떠나시나요?'}
        subtitle={'여행 일정을 알려주세요'}
      />
      {/* <TextInfoListItem title={'E 날'}>
        {
          <TransText
            style={{
              ...$dateTextStyle,
              ...(!dateInterval.end && {color: colors.text.secondary}),
            }}>
            {toLocaleDateMonthString(dateInterval.end) || '정하지 않음'}
          </TransText>
        }
      </TextInfoListItem>
      <TextInfoListItem title={'돌아오는 날'}>
        {
          <TransText
            style={{
              ...$dateTextStyle,
              ...(!dateInterval.end && {color: colors.text.secondary}),
            }}>
            {toLocaleDateMonthString(dateInterval.end) || '정하지 않음'}
          </TransText>
        }
      </TextInfoListItem> */}
      <View style={$dateContainerStyle}>
        <TransText style={{...$dateTextStyle}}>{scheduleText}</TransText>
      </View>
      <View style={$calendarContainerStyle}>
        <ScheduleSettingCalendar
          dateInterval={dateInterval}
          setDateInterval={setDateInterval}
        />
      </View>
      <Fab.Container>
        <Fab.NextButton
          promiseBeforeNavigate={handleNextPress}
          title={isScheduleSet ? '다음' : '건너뛰기'}
          navigateProps={{
            name: 'TitleSetting',
          }}
        />
      </Fab.Container>
    </Screen>
  )
}

const $calendarContainerStyle: ViewStyle = {
  padding: 24,
  width: '100%',
}

const $dateContainerStyle: TextStyle = {
  paddingHorizontal: 24,
}

const $dateTextStyle: TextStyle = {
  fontWeight: 600,
  fontSize: 17,
  width: '100%',
}

const $nightsTextStyle: TextStyle = {
  fontWeight: 500,
  fontSize: 14,
  width: '100%',
  paddingLeft: 12,
}
