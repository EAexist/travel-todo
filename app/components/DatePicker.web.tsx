import { FC } from 'react'
import { DatePickerProps } from 'react-native-date-picker'
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from 'react-native-ui-datepicker'

export const DatePicker: FC<DatePickerProps> = ({
  date,
  onDateChange,
  ...props
}) => {
  const defaultStyles = useDefaultStyles()

  return (
    <DateTimePicker
      mode="single"
      date={date}
      onChange={
        onDateChange
          ? ({ date }) => {
              if (date instanceof Date) onDateChange(date)
            }
          : undefined
      }
      styles={defaultStyles}
    />
  )
}
