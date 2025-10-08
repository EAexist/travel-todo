import { Screen } from '@/components'
import { Calendar } from '@/components/Calendar/Calendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import {
  ScheduleText,
  useScheduleSettingCalendar,
} from '@/components/Calendar/useScheduleSettingCalendar'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { useTripStore } from '@/models'
import { DateInterval, toCalendarString } from '@/utils/date'
import { FC, useCallback, useState } from 'react'
import { View } from 'react-native'
import { EditScreenBaseProps } from '.'

export const EditTripScheduleScreenBase: FC<EditScreenBaseProps> = ({
  isInitialSettingScreen,
}) => {
  const tripStore = useTripStore()

  const [dateInterval, setDateInterval] = useState<DateInterval>({
    start: tripStore.startDateIsoString
      ? new Date(tripStore.startDateIsoString)
      : undefined,
    end: tripStore.endDateIsoString
      ? new Date(tripStore.endDateIsoString)
      : undefined,
  })

  const isScheduleSet = dateInterval.start !== undefined

  const handleNextPress = useCallback(async () => {
    ;[dateInterval.start, dateInterval.end].forEach(date => {
      date?.setMilliseconds(0)
      date?.setSeconds(0)
      date?.setMinutes(0)
      date?.setHours(0)
    })
    tripStore.setProp(
      'startDateIsoString',
      dateInterval.start?.toISOString() || '',
    )
    tripStore.setProp('endDateIsoString', dateInterval.end?.toISOString() || '')

    tripStore.patch({
      id: tripStore.id,
      startDateIsoString: tripStore.startDateIsoString,
      endDateIsoString: tripStore.endDateIsoString,
    })
  }, [tripStore, dateInterval.start, dateInterval.end])

  const { markedDates, onDayPress } = useScheduleSettingCalendar({
    startDate: dateInterval.start || null,
    endDate: dateInterval.end || null,
    setStartDate: (date: Date | null) => {
      setDateInterval(prev => ({ ...prev, start: date || undefined }))
    },
    setEndDate: (date: Date | null) => {
      setDateInterval(prev => ({ ...prev, end: date || undefined }))
    },
  })

  return (
    <Screen>
      <ContentTitle
        title={'언제 떠나시나요?'}
        subtitle={'여행 일정을 알려주세요'}
      />
      <View style={{ paddingHorizontal: 24 }}>
        <ScheduleText
          startDate={dateInterval.start}
          endDate={dateInterval.end}
        />
      </View>
      <CalendarContainer>
        <Calendar
          initialDate={
            dateInterval.start && toCalendarString(dateInterval.start)
          }
          markingType="period"
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{}}
        />
      </CalendarContainer>
      <Fab.Container>
        {isInitialSettingScreen ? (
          <Fab.NextButton
            promiseBeforeNavigate={handleNextPress}
            title={isScheduleSet ? '다음' : '건너뛰기'}
            navigateProps={{
              name: 'TitleSetting',
            }}
          />
        ) : (
          <Fab.GoBackButton
            promiseBeforeNavigate={handleNextPress}
            // title={isScheduleSet ? '다음' : '건너뛰기'}
          />
        )}
      </Fab.Container>
    </Screen>
  )
}

export const TripScheduleSettingScreen: FC = () => {
  return <EditTripScheduleScreenBase isInitialSettingScreen={true} />
}

export const EditTripScheduleScreen: FC = () => {
  return <EditTripScheduleScreenBase isInitialSettingScreen={false} />
}
