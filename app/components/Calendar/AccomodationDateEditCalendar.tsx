import { ScheduleViewerCalendarBase } from '@/components/Calendar/ScheduleViewerCalendar'
import { useScheduleSettingCalendarWithAccomodation } from '@/components/Calendar/useScheduleSettingCalendar'
import { useTripStore } from '@/models'
import { Accomodation } from '@/models/Reservation/Accomodation'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Calendar } from './Calendar'

export const AccomodationDateEditCalendar: FC<{ accomodation: Accomodation }> =
    observer(({ accomodation }) => {
        const { markedDates, onDayPress } =
            useScheduleSettingCalendarWithAccomodation({
                startDate: accomodation.checkinDate,
                endDate: accomodation.checkoutDate,
                setStartDate: (date: Date | null) => {
                    accomodation.setProp(
                        'checkinDateIsoString',
                        date?.toISOString(),
                    )
                },
                setEndDate: (date: Date | null) => {
                    accomodation.setProp(
                        'checkoutDateIsoString',
                        date?.toISOString(),
                    )
                },
            })
        const tripStore = useTripStore()

        return tripStore.isScheduleSet ? (
            <ScheduleViewerCalendarBase
                onDayPress={onDayPress}
                markedDates={markedDates}
            />
        ) : (
            <Calendar
                onDayPress={onDayPress}
                markedDates={markedDates}
                markingType="period"
            />
        )
    })
