import { Screen } from '@/components'
import { Calendar } from '@/components/Calendar/Calendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import {
    ScheduleText,
    useScheduleSettingCalendarWithAccomodation,
} from '@/components/Calendar/useScheduleSettingCalendar'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import ContentTitle from '@/components/Layout/Content'
import { useReservationStore, useTripStore } from '@/models'
import { DateInterval, toCalendarString } from '@/utils/date'
import { useResourceQuota } from '@/utils/resourceQuota/useResourceQuota'
import { Text, useTheme } from '@rneui/themed'
import { addDays } from 'date-fns'
import { FC, useCallback, useState } from 'react'
import { View } from 'react-native'
import { EditScreenBaseProps } from '.'

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
            disableTouchEventOnAccomodation: true,
            disabledOnAccomodation: !(dateInterval.start && dateInterval.end),
        })

    const {
        theme: { colors },
    } = useTheme()

    const { maxTripDurationDays } = useResourceQuota()

    const [showWhyCannotSelectDate, setShowWhyCannotSelectDate] =
        useState(false)

    return (
        <Screen>
            <ContentTitle
                title={'여행 일정을 알려주세요'}
                // subtitle={'여행 일정을 알려주세요'}
            />
            {/* <ScrollView></ScrollView> */}
            <View
                style={{
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <ScheduleText
                    startDate={dateInterval.start}
                    endDate={dateInterval.end}
                />
                {/* <TouchableOpacity
                    style={{ paddingLeft: 8 }}
                    onPress={() => {
                        setDateInterval({
                            start: tripStore.startDateIsoString
                                ? new Date(tripStore.startDateIsoString)
                                : undefined,
                            end: tripStore.endDateIsoString
                                ? new Date(tripStore.endDateIsoString)
                                : undefined,
                        })
                    }}>
                    <Icon
                        name="undo"
                        type="font-awesome"
                        color={colors.text.secondary}
                        size={16}
                    />
                </TouchableOpacity> */}
            </View>
            <CalendarContainer>
                <Calendar
                    disableAllTouchEventsForDisabledDays={false}
                    disableAllTouchEventsForInactiveDays={false}
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
                        dateInterval.start === undefined &&
                        reservationStore.firstCheckinDate
                            ? toCalendarString(
                                  reservationStore.firstCheckinDate,
                              )
                            : dateInterval.start !== undefined &&
                                dateInterval.end == undefined
                              ? toCalendarString(
                                    addDays(
                                        dateInterval.start,
                                        maxTripDurationDays,
                                    ),
                                )
                              : undefined
                    }
                    // minDate={
                    //     dateInterval.start !== undefined &&
                    //     dateInterval.end == undefined &&
                    //     reservationStore.lastCheckoutDate
                    //         ? toCalendarString(
                    //               reservationStore.lastCheckoutDate,
                    //           )
                    //         : undefined
                    // }
                />
                {
                    <View
                        style={{
                            // paddingTop: 4,
                            // flexDirection: 'row',
                            // gap: 4,
                            // justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                        }}>
                        {reservationStore.hasScheduledAccomodation && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                }}>
                                <Icon
                                    name="dot-single"
                                    type="entypo"
                                    color={colors.primary}
                                />
                                <Text style={{ fontSize: 12 }}>
                                    {'숙박 예약을 포함해야해요'}
                                </Text>
                            </View>
                        )}
                        {dateInterval.start &&
                            dateInterval.end === undefined && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4,
                                    }}>
                                    <Icon
                                        name="dot-single"
                                        type="entypo"
                                        color={colors.text.primary}
                                    />
                                    <Text style={{ fontSize: 12 }}>
                                        {`최대 ${maxTripDurationDays}일까지 설정 가능해요`}
                                    </Text>
                                </View>
                            )}
                    </View>
                }
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
