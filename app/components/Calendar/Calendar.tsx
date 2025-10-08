import { useCalendarTheme } from '@/utils/useCalendarTheme'
import { useTheme } from '@rneui/themed'
import { FC, useEffect } from 'react'
import { ViewStyle } from 'react-native'
import {
  CalendarProps,
  LocaleConfig,
  Calendar as RNECalendar,
} from 'react-native-calendars'
import { Theme } from 'react-native-calendars/src/types'

export const Calendar: FC<CalendarProps> = ({
  //   markedDates,
  theme,
  ...props
}) => {
  const {
    theme: { colors },
  } = useTheme()

  const { theme: calendarTheme } = useCalendarTheme()

  useEffect(() => {
    console.log(props.markedDates)
  }, [props.markedDates])

  return (
    <RNECalendar
      firstDay={1}
      theme={
        {
          ...calendarTheme,
          ...theme,
          'stylesheet.day.basic': {
            ...calendarTheme['stylesheet.day.basic'],
            ...theme['stylesheet.day.basic'],
          },
          'stylesheet.calendar.main': {
            ...calendarTheme['stylesheet.calendar.main'],
            ...theme['stylesheet.calendar.main'],
          },
        } as Theme
      }
      //   dayComponent={props => <DayComponent {...props} />}
      style={$calendarstyle}
      monthFormat={'yyyy년 M월'}
      //   markedDates={themedMarkedDates}
      {...props}
    />
  )
}
const $calendarstyle: ViewStyle = {
  padding: 0,
}

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
}
LocaleConfig.defaultLocale = 'kr'
