import { useScheduleSettingCalendar } from '@/components/Calendar/useScheduleSettingCalendar'
import { ScheduleViewerCalendarBase } from '@/components/Calendar/ScheduleViewerCalendar'
import { Accomodation } from '@/models/Reservation/Accomodation'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { MarkedDates } from 'react-native-calendars/src/types'
import { useStores } from '@/models'
import { useTheme } from '@rneui/themed'

export const AccomodationDateEditCalendar: FC<{ accomodation: Accomodation }> =
  observer(({ accomodation }) => {
    const { markedDates: _markedDates, onDayPress } =
      useScheduleSettingCalendar({
        startDate: accomodation.checkinDate,
        endDate: accomodation.checkoutDate,
        setStartDate: (date: Date | null) => {
          accomodation.setProp('checkinDateIsoString', date?.toISOString())
        },
        setEndDate: (date: Date | null) => {
          accomodation.setProp('checkoutDateIsoString', date?.toISOString())
        },
      })
    const { reservationStore } = useStores()

    const [markedDates, setMarkedDates] = useState<MarkedDates>()

    const {
      theme: { colors },
    } = useTheme()

    useEffect(() => {
      setMarkedDates(() => {
        const keys = [
          ...new Set([
            ...Object.keys(reservationStore.accomodationCalendarDotMarkedDates),
            ...(_markedDates ? Object.keys(_markedDates) : []),
          ]),
        ]

        console.log(keys)

        return Object.fromEntries(
          keys.map(k => [
            k,
            {
              ...(Object.keys(
                reservationStore.accomodationCalendarDotMarkedDates,
              ).includes(k)
                ? {
                    marked:
                      reservationStore.accomodationCalendarDotMarkedDates[k]
                        .marked,
                    dotColor:
                      colors.palette[
                        reservationStore.accomodationCalendarDotMarkedDates[k]
                          .dotColorKey
                      ],
                  }
                : {}),
              ...(_markedDates && Object.keys(_markedDates).includes(k)
                ? _markedDates[k]
                : {}),
            },
          ]),
        )
      })
    }, [_markedDates, reservationStore.accomodationCalendarDotMarkedDates])

    return (
      <ScheduleViewerCalendarBase
        onDayPress={onDayPress}
        markedDates={markedDates}
      />
    )
  })
