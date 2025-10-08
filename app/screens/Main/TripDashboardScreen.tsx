import { FC, useCallback, useRef, useState } from 'react'
import {
  ListRenderItem,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
//
import { Avatar } from '@/components/Avatar'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import ListSubheader from '@/components/ListSubheader'
import {
  NavigateMenuBottomSheet,
  NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'
import { Screen } from '@/components/Screen'
import SectionCard from '@/components/SectionCard'
import { useStores, useTripStore } from '@/models'
import { Destination } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import { MainTabScreenProps } from '@/navigators/MainTabNavigator'
import { useMainScreenHeader } from '@/utils/useHeader'
import { Chip, Icon, ListItem, Text, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FlatList } from 'react-native-gesture-handler'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import { ListItemCaption } from '@/components/ListItemCaption'
import { Switch } from '@rneui/themed'
import BottomSheetModal from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'

export const TripDashboardScreen: FC<MainTabScreenProps<'TripDashboard'>> =
  observer(({}) => {
    const tripStore = useTripStore()
    const { reservationStore } = useStores()
    const {
      theme: { colors },
    } = useTheme()

    /* Settings Menu */

    const settingsOption: NavigateMenuData[] = [
      {
        title: '여행 정보 수정',
        path: 'EditTrip',
        icon: { name: 'edit', type: 'material' },
      },
      {
        title: '새 여행 만들기',
        path: 'TripList',
        icon: { name: 'add', type: 'material' },
      },
      {
        title: '지난 여행 보기',
        path: 'TripList',
        icon: { name: 'list', type: 'material' },
      },
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
          <HeaderIcon name="gear" type="octicon" />
        </TouchableOpacity>
      ),
      backgroundColor: 'secondary',
    })

    const renderDestinationText: ListRenderItem<Destination> = destination => (
      <>{}</>
    )

    const handleAddDestination = useCallback(() => {
      navigateWithTrip('EditTripDestination')
    }, [])

    const { navigateWithTrip } = useNavigate()

    const handleViewTodolist = useCallback(() => {
      navigateWithTrip('Main', { screen: 'Todolist' })
    }, [])

    const handleViewAccomodationPlan = useCallback(() => {
      navigateWithTrip('AccomodationPlan')
    }, [])

    const todoStatusGridData = [
      {
        id: '0',
        category: '숙박 예약',
        icon: { name: '🛌' },
        title:
          reservationStore.accomodationTodoStatusText ||
          `${reservationStore.reservedNights}박 예약 완료`,
        onPress: handleViewAccomodationPlan,
      },
      {
        id: '1',
        category: '해외여행 준비',
        icon: { name: '🌐' },
        title: tripStore.foreignTodoStatusText,
        onPress: handleViewTodolist,
      },
      {
        id: '2',
        category: '기타 예약',
        icon: { name: '🎫' },
        title: tripStore.reservationTodoStatusText,
        onPress: handleViewTodolist,
      },
      {
        id: '3',
        category: '짐 챙기기',
        icon: { name: '💼' },
        title: tripStore.goodsTodoStatusText,
        onPress: handleViewTodolist,
      },
    ]

    const renderTodoStatusGridItem: ListRenderItem<
      (typeof todoStatusGridData)[0]
    > = ({ item }) => (
      <ListItem
        style={$gridItemStyle}
        containerStyle={$gridListItemContainerStyle}
        onPress={item.onPress}>
        <Avatar icon={item.icon} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.category}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    )

    const tripModeHelpBottomSheetRef = useRef<BottomSheetModal>(null)
    const handlePressHelpTravelMode = useCallback(() => {
      tripModeHelpBottomSheetRef.current?.present()
    }, [tripModeHelpBottomSheetRef.current])

    return (
      <Screen backgroundColor={'secondary'}>
        <ScrollView>
          <SectionCard>
            <ListItem containerStyle={{ height: 'auto' }}>
              <ListItem.Content>
                <ListItem.Title
                  numberOfLines={undefined}
                  ellipsizeMode={undefined}>
                  <Text h2>{tripStore.title}</Text>
                </ListItem.Title>
              </ListItem.Content>
              {tripStore.dDay !== null && (
                <Chip
                  title={
                    tripStore.dDay > 0
                      ? `D-${tripStore.dDay}`
                      : tripStore.dDay === 0
                        ? 'D-day'
                        : '여행 중'
                  }
                  color={tripStore.dDay <= 0 ? 'primary' : 'secondary'}
                />
              )}
            </ListItem>
            {tripStore.isScheduleSet ? (
              <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                <ScheduleText
                  startDate={tripStore.startDate}
                  endDate={tripStore.endDate}
                />
              </View>
            ) : (
              <View></View>
            )}
          </SectionCard>
          <SectionCard>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>
                  {'여행 모드'}
                  <ListItemCaption>
                    <TouchableOpacity onPress={handlePressHelpTravelMode}>
                      <Icon
                        name="help-outline"
                        type="material"
                        size={20}
                        color={undefined}
                      />
                    </TouchableOpacity>
                  </ListItemCaption>
                </ListItem.Title>
                <ListItem.Subtitle>
                  {tripStore.isTripMode ? '사용중' : '사용 안 함'}
                </ListItem.Subtitle>
              </ListItem.Content>
              <Switch
                value={tripStore.isTripMode}
                onValueChange={value => tripStore.setProp('isTripMode', value)}
              />
            </ListItem>
          </SectionCard>
          {/* <SectionCard containerStyle={{paddingBottom: 0}}> */}
          <SectionCard>
            <ListSubheader title="완료한 할 일" />
            <FlatList
              data={todoStatusGridData}
              renderItem={renderTodoStatusGridItem}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={{ width: '100%', paddingHorizontal: 20 }}
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
          <SectionCard containerStyle={{ marginBottom: 15 }}>
            <ListSubheader title="여행지 정보" />
            {tripStore.destination.length > 0 ? (
              <FlatList
                data={tripStore.destination}
                renderItem={renderDestinationText}
                keyExtractor={item => item.title}
              />
            ) : (
              <ListItem onPress={handleAddDestination}>
                <Avatar icon={{ name: 'place', type: 'material' }} />
                <ListItem.Content>
                  <ListItem.Title style={{ fontSize: 16 }} numberOfLines={2}>
                    여행지를 설정하고
                    <br />
                    현지 정보를 확인해보세요
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
          </SectionCard>
        </ScrollView>
        <BottomSheetModal ref={tripModeHelpBottomSheetRef}>
          <ContentTitle
            variant="listItem"
            title={'여행 모드'}
            subtitle={tripStore.isTripMode ? '사용중' : '사용 안 함'}
            rightComponent={
              <Switch
                value={tripStore.isTripMode}
                onValueChange={value => tripStore.toggleTripMode()}
              />
            }
          />
          <Text style={{ fontSize: 15, paddingHorizontal: 24, paddingTop: 12 }}>
            여행 중 간편하게 사용할 수 있도록
            <br />
            1.앱을 켜면 <b>할 일</b> 대신 <b>예약</b> 페이지를 바로 열어요.
            <br />
            2.에약 항목을 누르면 <b>저장한 링크로 바로 연결</b>해요
          </Text>
        </BottomSheetModal>
        <NavigateMenuBottomSheet
          data={settingsOption}
          ref={settingsMenuBottomSheetRef}
        />
      </Screen>
    )
  })

const $gridItemStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 0,
}

const $gridListItemContainerStyle: ViewStyle = {
  paddingHorizontal: 0,
}
