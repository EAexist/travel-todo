import {FC, useCallback, useRef} from 'react'
import {ListRenderItem, ScrollView, TouchableOpacity} from 'react-native'
//
import {Screen} from '@/components/Screen'
import {useStores, useTripStore} from '@/models'
import {Destination} from '@/models/Destination'
import {MainTabScreenProps} from '@/navigators/MainTabNavigator'
import {toCalendarString} from '@/utils/date'
import {useHeader, useMainScreenHeader} from '@/utils/useHeader'
import {ListItem, Text} from '@rneui/themed'
import {Trans} from 'react-i18next'
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars'
import {Positions} from 'react-native-calendars/src/expandableCalendar'
import {FlatList} from 'react-native-gesture-handler'
import {$headerRightButtonStyle, HeaderIcon} from '@/components/Header'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import {
  NavigateMenuBottomSheet,
  NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'

export const TripDashboardScreen: FC<
  MainTabScreenProps<'TripDashboard'>
> = ({}) => {
  const tripStore = useTripStore()

  const settingsDropDownBottomSheetRef = useRef<BottomSheetModal>(null)

  const handleSettingsButtonPress = useCallback(() => {
    settingsDropDownBottomSheetRef.current?.present()
  }, [settingsDropDownBottomSheetRef])

  useMainScreenHeader({
    title: '내 여행',
    rightComponent: (
      <TouchableOpacity
        onPress={handleSettingsButtonPress}
        style={$headerRightButtonStyle}>
        <HeaderIcon name="settings" />
      </TouchableOpacity>
    ),
  })

  const renderDestinationText: ListRenderItem<Destination> = destination => (
    <>{}</>
  )

  /* Settings Menu */
  const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

  const settingsOption: NavigateMenuData[] = [
    {title: '여행 정보 수정', path: 'EditTrip'},
    {title: '새 여행 만들기', path: 'TripList'},
  ]

  return (
    <Screen>
      <ScrollView>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>
              <Trans>{tripStore.title}</Trans>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron name="edit" />
        </ListItem>
        <FlatList
          data={tripStore.destination}
          renderItem={renderDestinationText}
          keyExtractor={item => item.title}
        />
        <CalendarProvider
          date={toCalendarString(
            tripStore.startDate ? tripStore.startDate : new Date(),
          )}>
          <ExpandableCalendar
            // markedDates={markedDates}
            initialPosition={Positions.CLOSED}
            horizontal={false}
            // ref={calendarRef}
            // onCalendarToggled={onCalendarToggled}
            // initialDate={toCalendarString(tripStore.startDate)}
            // minDate={toCalendarString(tripStore.startDate)}
            // maxDate={toCalendarString(tripStore.endDate)}
          />
        </CalendarProvider>
      </ScrollView>
      <NavigateMenuBottomSheet
        data={settingsOption}
        ref={settingsMenuBottomSheetRef}
      />
    </Screen>
  )
}
