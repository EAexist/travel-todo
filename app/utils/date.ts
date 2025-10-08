import { startOfDay } from 'date-fns'

export const toCalendarString = (date_: Date | string) => {
  const date = typeof date_ === 'string' ? new Date(date_) : date_
  return `${date.getFullYear()}-${new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)}`
}
export const getNightsParsed = (start: Date, end: Date) => {
  const nights = Math.floor(
    (startOfDay(end).getTime() - startOfDay(start).getTime()) /
      (24 * 60 * 60 * 1000),
  )
  return `${nights}박 ${nights + 1}일`
}
export const toLocaleDateMonthString = (date?: Date) =>
  date
    ? `${date?.toLocaleDateString(undefined, {
        month: 'short',
      })} ${date?.toLocaleDateString(undefined, {
        day: 'numeric',
      })}`
    : undefined

export const parseDate = (date?: Date | null | string) =>
  date
    ? dateFormatter.format(typeof date === 'string' ? new Date(date) : date)
    : null

export const parseTime = (date?: Date | null | string) =>
  date
    ? timeFormatter.format(typeof date === 'string' ? new Date(date) : date)
    : null

export type DateInterval = {
  start?: Date
  end?: Date
}

const dateFormatter = new Intl.DateTimeFormat('kr', {
  month: 'long',
  day: 'numeric',
  //   weekday: 'short',
  weekday: 'long',
})
const timeFormatter = new Intl.DateTimeFormat('kr', {
  timeStyle: 'short',
  // hour: '2-digit',
  // minute: '2-digit',
})
