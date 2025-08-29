import {FC, useCallback} from 'react'
import {ListRenderItem, ScrollView} from 'react-native'
//
import {Screen} from '@/components/Screen'
import {useTripStore} from '@/models'
import {Destination} from '@/models/Destination'
import {AppStackParamList, useNavigate} from '@/navigators'
import {toCalendarString} from '@/utils/date'
import {useHeader} from '@/utils/useHeader'
import {ListItem} from '@rneui/base'
import {Text} from '@rneui/themed'
import {Trans} from 'react-i18next'
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars'
import {Positions} from 'react-native-calendars/src/expandableCalendar'
import {FlatList} from 'react-native-gesture-handler'
import {DestinationListItemBase} from '../New/DestinationSettingScreen'

const EditTripSubheader = ({
  title,
  path,
}: {
  title: string
  path: keyof AppStackParamList
}) => {
  const {navigateWithTrip} = useNavigate()

  const handlePress = useCallback(() => {
    navigateWithTrip(path)
  }, [])

  return (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>{title}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron onPress={handlePress} />
    </ListItem>
  )
}

export const EditTripScreen: FC<{}> = ({}) => {
  const tripStore = useTripStore()

  useHeader({
    headerShown: true,
    backButtonShown: false,
    leftComponent: (
      <Text numberOfLines={1} h2>
        내 여행
      </Text>
    ),
    leftContainerStyle: {
      flexGrow: 1,
      paddingLeft: 16,
      paddingRight: 24,
    },
  })

  const renderDestinationText: ListRenderItem<Destination> = ({item}) => (
    <DestinationListItemBase item={item} />
  )

  return (
    <Screen>
      <ScrollView>
        <EditTripSubheader title={'여행 이름'} path={'TitleSetting'} />
        <Text>{tripStore.title}</Text>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>
              <Trans></Trans>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron name="edit" />
        </ListItem>
        <EditTripSubheader title={'여행지'} path={'DestinationSetting'} />
        <FlatList
          data={tripStore.destination}
          renderItem={renderDestinationText}
          keyExtractor={item => item.title}
        />
        <EditTripSubheader title={'일정'} path={'ScheduleSetting'} />
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
    </Screen>
  )
}
