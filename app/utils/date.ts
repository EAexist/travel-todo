export const toCalendarString = (date: Date) =>
  `${date.getFullYear()}-${new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)}`

export const getNightsParsed = (start: Date, end: Date) => {
  const nights = end.getDate() - start.getDate()
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

export type DateInterval = {
  start?: Date
  end?: Date
}
