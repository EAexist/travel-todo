import {FC, useCallback} from 'react'
import {ListRenderItem, ScrollView, View} from 'react-native'
//
import {
  $calendarContainerStyle,
  ScheduleText,
  ScheduleViewerCalendar,
} from '@/components/Calendar/index'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useTripStore} from '@/models'
import {Destination} from '@/models/Destination'
import {useNavigate} from '@/navigators'
import {toCalendarString} from '@/utils/date'
import {
  $headerCenterTitleContainerStyle,
  HeaderCenterTitle,
  useHeader,
} from '@/utils/useHeader'
import {Divider, ListItem, Text} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars'
import {Positions} from 'react-native-calendars/src/expandableCalendar'
import {FlatList} from 'react-native-gesture-handler'
import {DestinationListItemBase} from '../CreateTrip/DestinationSettingScreen'

export const EditTripScreen: FC<{}> = observer(({}) => {
  const tripStore = useTripStore()
  const renderDestinationText: ListRenderItem<Destination> = ({item}) => (
    <DestinationListItemBase item={item} />
  )

  const {navigateWithTrip} = useNavigate()

  const handleEditTitle = useCallback(() => {
    navigateWithTrip('EditTripTitle')
  }, [])

  const handleEditDestination = useCallback(() => {
    navigateWithTrip('EditTripDestination')
  }, [])

  const handleEditSchedule = useCallback(() => {
    navigateWithTrip('EditTripSchedule')
  }, [])

  useHeader({
    centerComponent: <HeaderCenterTitle title="여행 정보 수정" />,
    centerContainerStyle: $headerCenterTitleContainerStyle,
  })

  return (
    <Screen>
      <ScrollView>
        {/* <EditTripSubheader title={'여행 이름'} path={'TitleSetting'} /> */}
        <ListSubheader title={'여행 이름'} />
        <ListItem onPress={handleEditTitle}>
          <ListItem.Content>
            <ListItem.Title>{tripStore.title}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Divider />
        {/* <EditTripSubheader title={'여행지'} path={'DestinationSetting'} /> */}
        <ListSubheader title={'여행지'} />
        {tripStore.destination.length > 0 ? (
          <FlatList
            data={tripStore.destination}
            renderItem={renderDestinationText}
            keyExtractor={item => item.title}
          />
        ) : (
          <ListItem onPress={handleEditDestination}>
            <ListItem.Content>
              <ListItem.Title>설정 안함</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
        <Divider />
        {/* <EditTripSubheader title={'일정'} path={'ScheduleSetting'} /> */}
        <ListSubheader title={'일정'} />
        <ListItem onPress={handleEditSchedule}>
          <ListItem.Content style={{alignItems: 'stretch'}}>
            {tripStore.startDate || tripStore.endDate ? (
              <ScheduleText
                startDate={tripStore.startDate}
                endDate={tripStore.endDate}
              />
            ) : (
              <ListItem.Title>설정 안함</ListItem.Title>
            )}
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <View style={$calendarContainerStyle}>
          <ScheduleViewerCalendar />
        </View>
      </ScrollView>
    </Screen>
  )
})
