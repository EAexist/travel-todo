import { Calendar } from '@/components/Calendar/Calendar'
import { typography } from '@/rneui/theme'
import { toCalendarString } from '@/utils/date'
import { useTheme } from '@rneui/themed'
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  isBefore,
  isEqual,
  isMonday,
  lastDayOfMonth,
  max,
  min,
  nextSunday,
  previousMonday,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { CalendarProps, DateData } from 'react-native-calendars'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { MarkedDates, Theme } from 'react-native-calendars/src/types'

export interface ViewerCalendarProps
  extends Omit<ConcatenatedCalendarProps, 'minDate' | 'maxDate'> {
  minDate: string
  maxDate: string
}

export const ViewerCalendar: FC<ViewerCalendarProps> = observer(
  ({ minDate, maxDate, ...props }) => {
    if (
      new Date(maxDate).getTime() - new Date(minDate).getTime() >
      1.5 * 30 * 24 * 60 * 60 * 1000
    ) {
      return (
        <ConstrainedCalendar minDate={minDate} maxDate={maxDate} {...props} />
      )
    } else {
      return (
        <ConcatenatedCalendar
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          {...props}
        />
      )
    }
  },
)

const ConstrainedCalendar = ({
  minDate,
  maxDate,
  ...props
}: CalendarProps & { minDate: string; maxDate: string }) => {
  const [currentDateData, setCurrentDateData] = useState<DateData>()

  const start = new Date(minDate)
  const end = new Date(maxDate)

  return (
    <Calendar
      initialDate={minDate}
      hideArrows={false}
      disableMonthChange={true}
      disableArrowLeft={Boolean(
        currentDateData?.year &&
          currentDateData?.month &&
          start &&
          start.getFullYear() >= currentDateData?.year &&
          start.getMonth() + 1 >= currentDateData?.month,
      )}
      disableArrowRight={Boolean(
        currentDateData?.year &&
          currentDateData?.month &&
          end &&
          end.getFullYear() <= currentDateData?.year &&
          end.getMonth() + 1 <= currentDateData?.month,
      )}
      onMonthChange={month => {
        console.log('month changed', month)
        setCurrentDateData(month)
      }}
      {...props}
    />
  )
}

interface ConcatenatedCalendarProps
  extends Omit<
    CalendarProps,
    | 'hideArrows'
    | 'disableMonthChange'
    | 'disableArrowLeft'
    | 'disableArrowRight'
    | 'onMonthChange'
    | 'hideArrows'
    | 'minDate'
    | 'maxDate'
  > {
  minDate: Date
  maxDate: Date
}
const ConcatenatedCalendar = observer(
  ({ theme, markingType, ...props }: ConcatenatedCalendarProps) => {
    const {
      theme: { colors },
    } = useTheme()

    type renderConcatenatedCalendarItemProps = Pick<
      ConcatenatedCalendarItemProps,
      'isFirst' | 'firstDayofMonth'
    >
    const concatenatedCalendarItemProps: renderConcatenatedCalendarItemProps[] =
      getFirstDaysOfMonth(props.minDate, props.maxDate).map(
        (firstDayofMonth, index) => ({
          isFirst: index === 0,
          firstDayofMonth,
        }),
      )

    // const minDate_ = getLastMondayAtOrBefore(new Date(minDate))

    // const maxDate_ = nextSunday(new Date(maxDate))

    // const { theme: calendarTheme } = useCalendarTheme()

    const renderItem: ListRenderItem<renderConcatenatedCalendarItemProps> =
      useCallback(
        ({ item }) => {
          switch (markingType) {
            case 'multi-period':
              return (
                <MultiPeriodMarkedConcatenatedCalendarItem
                  {...props}
                  {...item}
                />
              )
            default:
              return <ConcatenatedCalendarItem {...props} {...item} />
          }
        },
        [props],
      )

    return (
      <FlatList data={concatenatedCalendarItemProps} renderItem={renderItem} />
    )
  },
)

interface ConcatenatedCalendarItemProps
  extends Omit<
    CalendarProps,
    | 'hideArrows'
    | 'disableMonthChange'
    | 'disableArrowLeft'
    | 'disableArrowRight'
    | 'onMonthChange'
    | 'hideArrows'
    | 'minDate'
    | 'maxDate'
    | 'initialDate'
    | 'markingType'
  > {
  firstDayofMonth: Date
  minDate: Date
  maxDate: Date
  isFirst: boolean
}

const ConcatenatedCalendarItem = observer(
  ({
    minDate,
    maxDate,
    firstDayofMonth,
    theme,
    markedDates: markedDatesProp,
    isFirst = false,
    ...props
  }: ConcatenatedCalendarItemProps) => {
    const {
      theme: { colors },
    } = useTheme()

    const [markedDates, setMarkedDates] = useState<MarkedDates>()

    const minDisplayDate =
      !isFirst && !isMonday(firstDayofMonth)
        ? addDays(getLastMondayAtOrBefore(max([minDate, firstDayofMonth])), 7)
        : getLastMondayAtOrBefore(max([minDate, firstDayofMonth]))

    const maxDisplayDate = nextSunday(
      min([maxDate, lastDayOfMonth(firstDayofMonth)]),
    )

    useEffect(() => {
      setMarkedDates(() => {
        const o: MarkedDates = Object.fromEntries(
          eachDayOfInterval({
            start: getLastMondayAtOrBefore(firstDayofMonth),
            end: nextSunday(getLastDayOfMonth(firstDayofMonth)),
          }).map(date => {
            let markingProps: MarkingProps = {}
            const dateString = toCalendarString(date)
            if (
              date.getTime() < minDisplayDate.getTime() ||
              date.getTime() > maxDisplayDate.getTime()
            ) {
              markingProps = {}
            } else if (
              date.getTime() < minDate.getTime() ||
              date.getTime() > maxDate.getTime()
            ) {
              markingProps = {
                disabled: true,
                customContainerStyle: {
                  display: 'flex',
                  height: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                customTextStyle: {
                  color: colors.inactive,
                },
              }
            } else {
              const markingProps_ =
                markedDatesProp &&
                Object.keys(markedDatesProp).includes(dateString) &&
                markedDatesProp[dateString]
              markingProps = {
                ...(markingProps_ || {}),
                disabled: false,
                customContainerStyle: [
                  {
                    display: 'flex',
                    height: 52,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  markingProps_ ? markingProps_.customContainerStyle : {},
                ],
              }
            }
            return [toCalendarString(date), markingProps]
          }),
        )
        return o
      })
    }, [
      minDisplayDate.getTime(),
      maxDisplayDate.getTime(),
      firstDayofMonth.getTime(),
      markedDatesProp,
    ])

    useEffect(() => {
      console.log(markedDatesProp)
    }, [markedDatesProp])

    return (
      <Calendar
        headerStyle={isFirst ? undefined : { display: 'none' }}
        hideDayNames={!isFirst}
        disableMonthChange={true}
        disableArrowLeft
        disableArrowRight
        hideArrows={true}
        initialDate={toCalendarString(firstDayofMonth)}
        minDate={toCalendarString(minDate)}
        maxDate={toCalendarString(maxDate)}
        markedDates={markedDates}
        markingType="period"
        {...props}
        theme={
          {
            'stylesheet.day.period': {
              container: {
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'center',
              },
              base: {
                display: 'none',
              },
            },
          } as Theme
        }
      />
    )
  },
)

const MultiPeriodMarkedConcatenatedCalendarItem = observer(
  ({
    minDate,
    maxDate,
    firstDayofMonth,
    theme,
    markedDates: markedDatesProp,
    isFirst = false,
    ...props
  }: ConcatenatedCalendarItemProps) => {
    const {
      theme: { colors },
    } = useTheme()

    const [markedDates, setMarkedDates] = useState<MarkedDates>()

    const minDisplayDate =
      !isFirst && !isMonday(firstDayofMonth)
        ? addDays(getLastMondayAtOrBefore(max([minDate, firstDayofMonth])), 7)
        : getLastMondayAtOrBefore(max([minDate, firstDayofMonth]))

    const maxDisplayDate = nextSunday(
      min([maxDate, lastDayOfMonth(firstDayofMonth)]),
    )

    useEffect(() => {
      setMarkedDates(() => {
        const o: MarkedDates = Object.fromEntries(
          eachDayOfInterval({
            start: getLastMondayAtOrBefore(firstDayofMonth),
            end: nextSunday(getLastDayOfMonth(firstDayofMonth)),
          }).map(date => {
            let markingProps: MarkingProps = {}
            const dateString = toCalendarString(date)
            if (
              date.getTime() < minDisplayDate.getTime() ||
              date.getTime() > maxDisplayDate.getTime()
            ) {
              markingProps = {
                disabled: true,
              }
            } else if (
              date.getTime() < minDate.getTime() ||
              date.getTime() > maxDate.getTime()
            ) {
              markingProps = {
                disabled: false,
                inactive: true,
              }
            } else {
              const markingProps_ =
                markedDatesProp &&
                Object.keys(markedDatesProp).includes(dateString) &&
                markedDatesProp[dateString]
              markingProps = {
                ...(markingProps_ || {}),
                disabled: false,
                customContainerStyle: [
                  {
                    display: 'flex',
                    height: 52,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  markingProps_ ? markingProps_.customContainerStyle : {},
                ],
              }
            }
            return [toCalendarString(date), markingProps]
          }),
        )
        return o
      })
    }, [
      minDisplayDate.getTime(),
      maxDisplayDate.getTime(),
      firstDayofMonth.getTime(),
      markedDatesProp,
    ])

    // const d = markedDates

    return (
      <Calendar
        headerStyle={isFirst ? undefined : { display: 'none' }}
        hideDayNames={!isFirst}
        disableMonthChange={true}
        disableArrowLeft
        disableArrowRight
        hideArrows={true}
        initialDate={toCalendarString(firstDayofMonth)}
        minDate={toCalendarString(minDate)}
        maxDate={toCalendarString(maxDate)}
        markedDates={markedDates}
        markingType="multi-period"
        {...props}
        theme={
          {
            'stylesheet.day.basic': {
              container: {
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'center',
              },
              base: {},
              text: {
                fontSize: 16,
                fontFamily: typography.pretendard.semiBold?.fontFamily,
                fontWeight: typography.pretendard.semiBold?.fontWeight,
                lineHeight: 36,
                marginTop: 20,
                //   color: theme.colors.inactive,
              },
              disabledText: {
                display: 'none',
              },
            },
            'stylesheet.calendar.main': {
              dayContainer: {
                flex: 1,
                alignItems: 'center',
              },
            },
          } as Theme
        }
      />
    )
  },
)

const getFirstDaysOfMonth = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  let currentMonth = startOfMonth(startDate)
  const endMonth = startOfMonth(endDate)

  while (isBefore(currentMonth, endMonth) || isEqual(currentMonth, endMonth)) {
    dates.push(currentMonth)
    currentMonth = addMonths(currentMonth, 1)
  }

  return dates
}
function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function getLastMondayAtOrBefore(date: Date) {
  if (isMonday(date)) {
    return startOfDay(date)
  } else {
    return previousMonday(date)
  }
}

// const minDate_ = getLastMondayAtOrBefore(new Date(minDate))

// const maxDate_ = nextSunday(new Date(maxDate))

// const { theme: calendarTheme } = useCalendarTheme()
// const _initialDate = new Date(initialDate)
// const lastMonday = getLastMondayAtOrBefore(_initialDate)
// const datesToDisable = eachDayOfInterval({
//   start: lastMonday,
//   end: addDays(lastMonday, 6),
// }).map(d => toCalendarString(d))

// const extraDays = [
//   ...eachDayOfInterval({
//     start: minDate_,
//     end: minDate,
//   }).slice(0, -1),
//   ...eachDayOfInterval({
//     start: maxDate,
//     end: maxDate_,
//   }).slice(1),
// ].map(d => toCalendarString(d))

// const intermediateMarkedDates = {
//   ...markedDates,
//   ...Object.fromEntries(
//     extraDays.map(d => [
//       d,
//       {
//         // disabled: true,
//         disableTouchEvent: true,
//         customTextStyle: {
//           //   display: 'contents',
//           color: colors.inactive,
//         },
//         // customContainerStyle: {
//         //   display: 'contents',
//         // },
//       } as MarkingProps,
//     ]),
//   ),
// }
// const _markedDates =
//   index > 0 && !isMonday(initialDate)
//     ? {
//         ...intermediateMarkedDates,
//         ...Object.fromEntries(
//           datesToDisable.map(d => [
//             d,
//             {
//               disabled: true,
//               customContainerStyle: {
//                 display: 'none',
//               } as ViewStyle,
//             },
//           ]),
//         ),
//       }
//     : intermediateMarkedDates

// console.log(_markedDates)
