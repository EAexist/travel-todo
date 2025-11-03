import { typography } from '@/rneui/theme'
import { useTheme } from '@rneui/themed'
import { Theme } from 'react-native-calendars/src/types'

export const useCalendarTheme: () => { theme: Theme } = () => {
    const { theme } = useTheme()
    return {
        theme: {
            calendarBackground: 'transparent',
            dayTextColor: theme.colors.text.primary,
            textDisabledColor: theme.colors.text.primary,
            selectedDayTextColor: theme.colors.text.primary,
            selectedDayBackgroundColor: 'transparent',
            textDayFontFamily: typography.pretendard.semiBold?.fontFamily,
            textMonthFontFamily: typography.pretendard.semiBold?.fontFamily,
            textDayHeaderFontFamily: typography.pretendard.semiBold?.fontFamily,
            textDayFontWeight: typography.pretendard.semiBold?.fontWeight,
            textDayFontSize: 16,
            arrowColor: theme.colors.primary,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.primary,
            todayTextColor: theme.colors.primary,
            arrowStyle: {
                color: theme.colors.secondary,
            },
            //   stylesheet: {
            //     day: {
            //       basic: {
            //         container: {
            //           //   alignSelf: 'stretch',
            //           //   justifyContent: 'center',
            //           height: 52,
            //           //   alignItems: 'stretch',
            //         },
            //         base: {
            //           //   alignItems: 'center',
            //           alignSelf: 'stretch',
            //         },
            //         text: {
            //           fontSize: 16,
            //           fontFamily: typography.pretendard.semiBold?.fontFamily,
            //           fontWeight: typography.pretendard.semiBold?.fontWeight,
            //           //   color: theme.colors.inactive,
            //         },
            //       },
            //       period: {
            //         container: {
            //           alignSelf: 'stretch',
            //           justifyContent: 'center',
            //           alignItems: 'center',
            //         },
            //         base: {
            //           alignItems: 'center',
            //           justifyContent: 'center',
            //         },
            //         text: {
            //           fontSize: 16,
            //           fontFamily: typography.pretendard.semiBold?.fontFamily,
            //           fontWeight: typography.pretendard.semiBold?.fontWeight,
            //           lineHeight: 52,
            //           //   color: theme.colors.inactive,
            //         },
            //       },
            //     },
            //   },
            'stylesheet.day.basic': {
                container: {
                    height: 52,
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                base: {
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            },
            'stylesheet.day.period': {
                container: {
                    height: 52,
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                base: {
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            },
            'stylesheet.calendar.main': {
                container: {
                    overflow: 'hidden',
                },
                week: {
                    marginVertical: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                },
                dayContainer: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            },
        } as Theme,
    }
}
