import { useTripStore } from '@/models'
import { toCalendarString } from '@/utils/date'
import { eachDayOfInterval } from 'date-fns'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import { MarkedDates } from 'react-native-calendars/src/types'
import { ViewerCalendar, ViewerCalendarProps } from './ViewerCalendar'

export const ScheduleViewerCalendarBase: FC<
  Omit<ViewerCalendarProps, 'minDate' | 'maxDate'>
> = observer(({ ...props }) => {
  const tripStore = useTripStore()

  return (
    tripStore.startDateIsoString &&
    tripStore.endDateIsoString && (
      <ViewerCalendar
        minDate={tripStore.startDateIsoString}
        maxDate={tripStore.endDateIsoString}
        {...props}
      />
    )
  )
})

export const ScheduleViewerCalendar = observer(() => {
  const tripStore = useTripStore()

  const start = tripStore.startDate
  const end = tripStore.endDate

  const [markedDates, setMarkedDates] = useState<MarkedDates>()

  useEffect(() => {
    // console.log(`start: ${start}`)
    // console.log(`end: ${end}`)
    // console.log(`markedDates: ${Object.entries(markedDates)}`)
    setMarkedDates(() => {
      const intervalDays = start && end && eachDayOfInterval({ start, end })
      const o: MarkedDates = {}
      //   if (start) {
      //     o[toCalendarString(start)] = {
      //       startingDay: true,
      //       endingDay: end ? undefined : true,
      //     }
      //   }
      //   if (end) {
      //     o[toCalendarString(end)] = { endingDay: true }
      //   }
      if (intervalDays) {
        intervalDays.forEach(date => {
          o[toCalendarString(date)] = {
            selected: true,
            marked: true,
          }
        })
      }
      return o
    })
  }, [start, end])

  return (
    tripStore.startDateIsoString &&
    tripStore.endDateIsoString && (
      <ViewerCalendar
        markedDates={markedDates}
        minDate={tripStore.startDateIsoString}
        maxDate={tripStore.endDateIsoString}
        // disabledByDefault
      />
    )
  )
})
