import {Screen} from '@/components'
import {
  $calendarContainerStyle,
  ScheduleSettingCalendar,
  ScheduleText,
} from '@/components/Calendar/index'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {useTripStore} from '@/models'
import {DateInterval} from '@/utils/date'
import {FC, useCallback, useState} from 'react'
import {EditScreenBaseProps} from '.'
import {View} from 'react-native'

export const EditTripScheduleScreenBase: FC<EditScreenBaseProps> = ({
  isInitialSettingScreen,
}) => {
  const tripStore = useTripStore()

  const [dateInterval, setDateInterval] = useState<DateInterval>({
    start: tripStore.startDateISOString
      ? new Date(tripStore.startDateISOString)
      : undefined,
    end: tripStore.endDateISOString
      ? new Date(tripStore.endDateISOString)
      : undefined,
  })

  const isScheduleSet = dateInterval.start !== undefined

  const handleNextPress = useCallback(async () => {
    tripStore.setProp(
      'startDateISOString',
      dateInterval.start?.toISOString() || '',
    )
    tripStore.setProp('endDateISOString', dateInterval.end?.toISOString() || '')
    // await tripStore.patch()
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
      {/* <View style={$dateContainerStyle}>
        <TransText style={{...$dateTextStyle}}>{scheduleText}</TransText>
      </View>
      <View style={$calendarContainerStyle}>
        <ScheduleSettingCalendar
          dateInterval={dateInterval}
          setDateInterval={setDateInterval}
        />
      </View> */}
      <View style={{paddingHorizontal: 24}}>
        <ScheduleText
          startDate={dateInterval.start}
          endDate={dateInterval.end}
        />
      </View>
      <View style={$calendarContainerStyle}>
        <ScheduleSettingCalendar
          dateInterval={dateInterval}
          setDateInterval={setDateInterval}
        />
      </View>
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
