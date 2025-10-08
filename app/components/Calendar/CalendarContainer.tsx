import { FC } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

export const CalendarContainer: FC<ViewProps> = ({ style, ...props }) => (
  <View {...props} style={[style, $calendarContainerStyle]} />
)

export const $calendarContainerStyle: ViewStyle = {
  padding: 24,
  width: '100%',
}
