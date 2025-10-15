import { FC, useCallback, useRef } from 'react'
import {
    FlatList,
    ListRenderItem,
    ScrollView,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
//
import { Avatar } from '@/components/Avatar'
import BottomSheetModal from '@/components/BottomSheetModal'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import ContentTitle from '@/components/Layout/Content'
import { ListItemCaption } from '@/components/ListItemCaption'
import ListSubheader from '@/components/ListSubheader'
import {
    NavigateMenuBottomSheet,
    NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'
import { Screen } from '@/components/Screen'
import SectionCard from '@/components/SectionCard'
import { TripModeHelpText } from '@/components/TripModeHelpText'
import { useReservationStore, useTripStore } from '@/models'
import { Destination } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import { MainTabScreenProps } from '@/navigators/MainTabNavigator'
import { useMainScreenHeader } from '@/utils/useHeader'
import { Chip, Icon, ListItem, Switch, Text, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'

export const TripDashboardScreen: FC<MainTabScreenProps<'TripDashboard'>> =
    observer(({}) => {
        const tripStore = useTripStore()
        const reservationStore = useReservationStore()
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

        const renderDestinationText: ListRenderItem<
            Destination
        > = destination => <>{}</>

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
                    tripStore.accomodationTodoStatusText ||
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
                category: '예약 준비',
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
                                    color={
                                        tripStore.dDay <= 0
                                            ? 'primary'
                                            : 'secondary'
                                    }
                                />
                            )}
                        </ListItem>
                        {tripStore.isScheduleSet ? (
                            <View
                                style={{
                                    paddingHorizontal: 20,
                                    paddingTop: 12,
                                }}>
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
                                        <TouchableOpacity
                                            onPress={handlePressHelpTravelMode}>
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
                                    {tripStore.isTripMode
                                        ? '사용중'
                                        : '사용 안 함'}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <Switch
                                value={tripStore.isTripMode}
                                onValueChange={value =>
                                    tripStore.setProp('isTripMode', value)
                                }
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
                            contentContainerStyle={{
                                width: '100%',
                                paddingHorizontal: 20,
                            }}
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
                                <Avatar
                                    icon={{ name: 'place', type: 'material' }}
                                />
                                <ListItem.Content>
                                    <ListItem.Title
                                        style={{ fontSize: 16 }}
                                        numberOfLines={2}>
                                        {`여행지를 설정하고\n현지 정보를 확인해보세요`}
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
                        subtitle={
                            tripStore.isTripMode ? '사용중' : '사용 안 함'
                        }
                        rightComponent={
                            <Switch
                                value={tripStore.isTripMode}
                                onValueChange={value =>
                                    tripStore.toggleTripMode()
                                }
                            />
                        }
                    />
                    <TripModeHelpText />
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
