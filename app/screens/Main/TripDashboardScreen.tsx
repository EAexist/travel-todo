import {FC, useCallback, useRef} from 'react'
import {ListRenderItem, ScrollView, TouchableOpacity, View} from 'react-native'
//
import {$headerRightButtonStyle, HeaderIcon} from '@/components/Header'
import ContentTitle from '@/components/Layout/Content'
import {
  NavigateMenuBottomSheet,
  NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'
import {Screen} from '@/components/Screen'
import {useTripStore} from '@/models'
import {Destination} from '@/models/Destination'
import {MainTabScreenProps} from '@/navigators/MainTabNavigator'
import {toCalendarString} from '@/utils/date'
import {useMainScreenHeader} from '@/utils/useHeader'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import {observer} from 'mobx-react-lite'
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars'
import {Positions} from 'react-native-calendars/src/expandableCalendar'
import {FlatList} from 'react-native-gesture-handler'
import {
  $calendarContainerStyle,
  ScheduleText,
} from '@/components/Calendar/index'
import {Card, Chip, Divider, ListItem, Text, useTheme} from '@rneui/themed'
import SectionCard from '@/components/SectionCard'
import ListSubheader from '@/components/ListSubheader'
import {Icon} from '@/components/Icon'
import {Avatar} from '@/components/Avatar'
import {useNavigate} from '@/navigators'

export const TripDashboardScreen: FC<MainTabScreenProps<'TripDashboard'>> =
  observer(({}) => {
    const tripStore = useTripStore()
    const {
      theme: {colors},
    } = useTheme()

    /* Settings Menu */

    const settingsOption: NavigateMenuData[] = [
      {title: '여행 정보 수정', path: 'EditTrip'},
      {title: '새 여행 만들기', path: 'TripList'},
    ]
    const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

    const handleSettingsButtonPress = useCallback(() => {
      settingsMenuBottomSheetRef.current?.present()
    }, [settingsMenuBottomSheetRef])

    useMainScreenHeader({
      title: '내 여행',
      rightComponent: (
        <TouchableOpacity
          onPress={handleSettingsButtonPress}
          style={$headerRightButtonStyle}>
          <HeaderIcon name="settings" />
        </TouchableOpacity>
      ),
      containerStyle: {backgroundColor: colors.secondaryBg},
    })

    const renderDestinationText: ListRenderItem<Destination> = destination => (
      <>{}</>
    )

    const handleAddDestination = useCallback(() => {
      navigateWithTrip('EditTripDestination')
    }, [])

    const {navigateWithTrip} = useNavigate()

    const handleViewTodolist = useCallback(() => {
      navigateWithTrip('Main', {screen: 'Todolist'})
    }, [])

    const handleViewAccomodationPlan = useCallback(() => {
      navigateWithTrip('AccomodationPlan')
    }, [])

    const todoStatusGridData = [
      {
        id: '0',
        category: '숙소 예약',
        icon: {name: '🛌'},
        title:
          tripStore.accomodationTodoStatusText ||
          `${tripStore.reservedNights}박 예약함`,
        onPress: handleViewAccomodationPlan,
      },
      {
        id: '1',
        category: '해외여행 준비',
        icon: {name: '🌐'},
        title: tripStore.foreignTodoStatusText,
        onPress: handleViewTodolist,
      },
      {
        id: '2',
        category: '기타 예약',
        icon: {name: '🎫'},
        title: tripStore.reservationTodoStatusText,
        onPress: handleViewTodolist,
      },
      {
        id: '3',
        category: '짐 챙기기',
        icon: {name: '💼'},
        title: tripStore.goodsTodoStatusText,
        onPress: handleViewTodolist,
      },
    ]

    const renderTodoStatusGridItem: ListRenderItem<
      (typeof todoStatusGridData)[0]
    > = ({item}) => (
      <ListItem style={$gridItemStyle} onPress={item.onPress}>
        <Avatar icon={item.icon} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.category}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    )
    return (
      <Screen backgroundColor={colors.secondaryBg}>
        <ScrollView>
          <SectionCard>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>
                  <Text h2>{tripStore.title}</Text>
                </ListItem.Title>
              </ListItem.Content>
              {tripStore.dDay && <Chip title={tripStore.dDay} />}
            </ListItem>
            {tripStore.isScheduleSet ? (
              <>
                <View style={{paddingHorizontal: 20}}>
                  <ScheduleText
                    startDate={tripStore.startDate}
                    endDate={tripStore.endDate}
                  />
                </View>
                <View style={{...$calendarContainerStyle}}>
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
                </View>
              </>
            ) : (
              <View></View>
            )}
          </SectionCard>
          {/* <SectionCard containerStyle={{paddingBottom: 0}}> */}
          <SectionCard>
            <ListSubheader title="여행 준비" />
            <FlatList
              data={todoStatusGridData}
              renderItem={renderTodoStatusGridItem}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={{width: '100%'}}
              columnWrapperStyle={{}}
            />
            {/* <Divider inset />
            <ListItem onPress={handleAddDestination}>
              <ListItem.Content>
                <ListItem.Title style={{fontSize: 16}}>
                  모든 할 일 보러가기
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem> */}
          </SectionCard>
          <SectionCard containerStyle={{marginBottom: 15}}>
            {tripStore.destination.length > 0 ? (
              <FlatList
                data={tripStore.destination}
                renderItem={renderDestinationText}
                keyExtractor={item => item.title}
              />
            ) : (
              <ListItem onPress={handleAddDestination}>
                <Avatar icon={{name: 'place', type: 'material'}} />
                <ListItem.Content>
                  <ListItem.Title style={{fontSize: 16}} numberOfLines={2}>
                    여행지를 설정하고 다양한 현지 정보를 확인해보세요
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
          </SectionCard>
        </ScrollView>
        <NavigateMenuBottomSheet
          data={settingsOption}
          ref={settingsMenuBottomSheetRef}
        />
      </Screen>
    )
  })

const $gridItemStyle = {
  flex: 1,
}
