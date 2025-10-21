import { TransText } from '@/components/TransText'
import { useReservationStore } from '@/models'
import {
    getNightsParsed,
    toCalendarString,
    toLocaleDateMonthString,
} from '@/utils/date'
import { Text, useTheme } from '@rneui/themed'
import { eachDayOfInterval } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { DateData } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'
import * as _ from 'lodash'

export const ScheduleText: FC<{ startDate?: Date; endDate?: Date }> = ({
    startDate,
    endDate,
}) => {
    const {
        theme: { colors },
    } = useTheme()

    return (
        <View style={$scheduleTextContainerStyle}>
            <TransText style={$scheduleTextStyle} disabled={!startDate}>
                {toLocaleDateMonthString(startDate) || '떠나는 날'}
            </TransText>
            <Text style={{ ...$scheduleTextStyle, opacity: 0.5 }}>{' - '}</Text>
            <TransText style={$scheduleTextStyle} disabled={!endDate}>
                {toLocaleDateMonthString(endDate) || '돌아오는 날'}
            </TransText>
            {/* <View style={{ width: 8 }} /> */}
            <TransText
                style={{ ...$nightsTextStyle, color: colors.text.secondary }}>
                {startDate && endDate && getNightsParsed(startDate, endDate)}
            </TransText>
        </View>
    )
}

interface useScheduleSettingCalendarProps {
    startDate: Date | null
    endDate: Date | null
    setStartDate: (date: Date | null) => void
    setEndDate: (date: Date | null) => void
}

export const useScheduleSettingCalendar = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}: useScheduleSettingCalendarProps) => {
    const onDayPress = useCallback(
        (dateData: DateData) => {
            const date = new Date(dateData.dateString)
            if (endDate) {
                setStartDate(date)
                setEndDate(null)
            } else if (startDate) {
                if (date > startDate) {
                    setEndDate(date)
                } else {
                    setStartDate(date)
                    setEndDate(null)
                }
            } else {
                setStartDate(date)
            }
        },
        [startDate, endDate],
    )

    const {
        theme: { colors },
    } = useTheme()

    const [markedDates, setMarkedDates] = useState<MarkedDates>({})

    const customContainerStyle: ViewStyle = {
        width: 42,
        height: 42,
        aspectRatio: 1,
        backgroundColor: colors.primary,
        borderRadius: '100%',
        alignSelf: 'center',
    }

    useEffect(() => {
        const intervalDays =
            startDate &&
            endDate &&
            eachDayOfInterval({ start: startDate, end: endDate }).slice(1, -1)

        setMarkedDates(() => {
            const o: MarkedDates = {}
            if (startDate) {
                o[toCalendarString(startDate)] = {
                    startingDay: true,
                    endingDay: endDate ? undefined : true,
                    color: colors.light1,
                    titleColor: colors.contrastText.primary,
                    customContainerStyle,
                }
            }
            if (endDate) {
                o[toCalendarString(endDate)] = {
                    endingDay: true,
                    color: colors.light1,
                    titleColor: colors.contrastText.primary,
                    customContainerStyle,
                }
            }
            if (intervalDays) {
                intervalDays.forEach(date => {
                    o[toCalendarString(date)] = {
                        selected: true,
                        color: colors.light1,
                        // customContainerStyle: {
                        //   height: 42,
                        //   marginVertical: 5,
                        // },
                    }
                })
            }
            return o
        })
    }, [startDate, endDate])

    return {
        markedDates,
        onDayPress,
    }
}

export const useScheduleSettingCalendarWithAccomodation = (
    props: useScheduleSettingCalendarProps,
) => {
    const reservationStore = useReservationStore()
    const { markedDates, onDayPress } = useScheduleSettingCalendar(props)
    return {
        markedDates: _.merge(
            {},
            reservationStore.accomodationMarkedDatesMultiDotMarking,
            markedDates,
        ),
        onDayPress,
    }
}

const $scheduleTextContainerStyle: TextStyle = {
    flexDirection: 'row',
    alignItems: 'flex-end',
}

const $scheduleTextStyle: TextStyle = {
    fontWeight: 600,
    fontSize: 17,
    lineHeight: 17 * 1.5,
}

const $nightsTextStyle: TextStyle = {
    fontWeight: 500,
    fontSize: 14,
    paddingLeft: 12,
    lineHeight: 14 * 1.5,
}
