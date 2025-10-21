import { Screen } from '@/components'
import { Calendar } from '@/components/Calendar/Calendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import {
    ScheduleText,
    useScheduleSettingCalendarWithAccomodation,
} from '@/components/Calendar/useScheduleSettingCalendar'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { useReservationStore, useTripStore } from '@/models'
import { DateInterval, toCalendarString } from '@/utils/date'
import { useTheme } from '@rneui/themed'
import { FC, useCallback, useState } from 'react'
import { View } from 'react-native'
import { EditScreenBaseProps } from '.'
import { Text } from '@rneui/themed'
import { Icon } from '@/components/Icon'

export const EditTripScheduleScreenBase: FC<EditScreenBaseProps> = ({
    isInitialSettingScreen,
}) => {
    const tripStore = useTripStore()
    const reservationStore = useReservationStore()

    const [dateInterval, setDateInterval] = useState<DateInterval>({
        start: tripStore.startDateIsoString
            ? new Date(tripStore.startDateIsoString)
            : undefined,
        end: tripStore.endDateIsoString
            ? new Date(tripStore.endDateIsoString)
            : undefined,
    })

    const isScheduleSet = dateInterval.end !== undefined

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
        tripStore.setProp(
            'endDateIsoString',
            dateInterval.end?.toISOString() || '',
        )

        tripStore.patch({
            id: tripStore.id,
            startDateIsoString: tripStore.startDateIsoString,
            endDateIsoString: tripStore.endDateIsoString,
        })
    }, [dateInterval.start, dateInterval.end])

    // const [markedDates, setMarkedDates] = useState<MarkedDates>()

    const { markedDates, onDayPress } =
        useScheduleSettingCalendarWithAccomodation({
            startDate: dateInterval.start || null,
            endDate: dateInterval.end || null,
            setStartDate: (date: Date | null) => {
                setDateInterval(prev => ({ ...prev, start: date || undefined }))
            },
            setEndDate: (date: Date | null) => {
                setDateInterval(prev => ({ ...prev, end: date || undefined }))
            },
        })

    const {
        theme: { colors },
    } = useTheme()

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
                        dateInterval.start &&
                        toCalendarString(dateInterval.start)
                    }
                    markingType="period"
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    theme={{
                        textDisabledColor: colors.disabled,
                    }}
                    hideExtraDays={dateInterval.end == undefined}
                    maxDate={
                        (dateInterval.start == undefined ||
                            dateInterval.end !== undefined) &&
                        reservationStore.firstCheckinDate
                            ? toCalendarString(
                                  reservationStore.firstCheckinDate,
                              )
                            : undefined
                    }
                    minDate={
                        dateInterval.start !== undefined &&
                        dateInterval.end == undefined &&
                        reservationStore.lastCheckoutDate
                            ? toCalendarString(
                                  reservationStore.lastCheckoutDate,
                              )
                            : undefined
                    }
                />
                {reservationStore.hasScheduledAccomodation && (
                    <View
                        style={{
                            paddingTop: 4,
                            flexDirection: 'row',
                            gap: 16,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                            <Icon
                                name="dot"
                                type="octicon"
                                color={colors.text.primary}
                            />
                            <Text style={{ fontSize: 12 }}>{'선택 가능'}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                            <Icon
                                name="dot"
                                type="octicon"
                                color={colors.disabled}
                            />
                            <Text style={{ fontSize: 12 }}>
                                {'선택 불가능 (숙박 예약을 포함해야 해요)'}
                            </Text>
                        </View>
                    </View>
                )}
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
                        disabled={!isScheduleSet}
                        promiseBeforeNavigate={handleNextPress}
                        title={
                            isScheduleSet
                                ? '확인'
                                : dateInterval.start
                                  ? '돌아오는 날을 선택하세요'
                                  : '떠나는 날을 선택하세요'
                        }
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
