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
import {
    NavigateListItemProp,
    NavigateMenuBottomSheet,
} from '@/components/BottomSheet/NavigateMenuBottomSheet'
import BottomSheetModal from '@/components/BottomSheetModal'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import { ListItemBase } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import SectionCard from '@/components/SectionCard'
import StyledSwitch from '@/components/StyledSwitch'
import { useReservationStore, useTripStore } from '@/models'
import { Destination } from '@/models/Destination'
import { MainTabScreenProps, useNavigate } from '@/navigators'
import { useMainScreenHeader } from '@/utils/useHeader'
import { Chip, ListItem, Text, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'

export const TripDashboardScreen: FC<MainTabScreenProps<'TripDashboard'>> =
    observer(({}) => {
        const tripStore = useTripStore()
        const reservationStore = useReservationStore()

        const {
            theme: { colors },
        } = useTheme()
        /* Settings Menu */

        const settingsOption: NavigateListItemProp[] = [
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
            title: '더보기',
            backgroundColor: 'secondary',
            rightComponent: (
                <TouchableOpacity
                    onPress={handleSettingsButtonPress}
                    style={$headerRightButtonStyle}>
                    <HeaderIcon name="gear" type="octicon" />
                </TouchableOpacity>
            ),
        })

        const renderDestinationText: ListRenderItem<
            Destination
        > = destination => <>{}</>

        const handleSetSchedule = useCallback(() => {
            navigateWithTrip('EditTripSchedule')
        }, [])

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
                title: tripStore.accomodationTodoStatusText,
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
                        <ListItem
                            containerStyle={{
                                height: 'auto',
                                paddingVertical: 16,
                            }}>
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
                                              : '여행중'
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
                            <ListItemBase
                                onPress={handleSetSchedule}
                                title={'여행 일정을 설정해보세요'}
                                titleColor="secondary"
                                rightContent={<ListItem.Chevron />}
                            />
                        )}
                    </SectionCard>
                    <SectionCard>
                        {/* <ListSubheader title="시작 탭" dense /> */}
                        <ListItemBase
                            title={'예약 탭에서 시작하기'}
                            rightContent={
                                <StyledSwitch
                                    isActive={tripStore.settings.isTripMode}
                                    onChange={tripStore.toggleIsTripMode}
                                    iconProps={{
                                        true: {
                                            name: 'check',
                                            type: 'material',
                                        },
                                        false: {
                                            name: 'remove',
                                            type: 'material',
                                        },
                                    }}
                                />
                            }
                        />
                        {/* <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 24,
                                gap: 4,
                            }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: colors.text.secondary,
                                }}>
                                {`현재 시작 탭: ${tripStore.settings.isTripMode ? '예약' : '여행 준비'}`}
                            </Text>
                            <Icon
                                size={20}
                                name={
                                    tripStore.settings.isTripMode
                                        ? 'qr-code'
                                        : 'checklist'
                                }
                                color={colors.text.secondary}
                            />
                        </View> */}
                    </SectionCard>
                    <SectionCard>
                        <ListSubheader title="완료한 할 일" dense />
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
                    </SectionCard>
                    {/* <SectionCard containerStyle={{ marginBottom: 15 }}>
                        <ListSubheader title="여행지 정보" />
                        {tripStore.destinations.length > 0 ? (
                            <FlatList
                                data={tripStore.destinations}
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
                    </SectionCard> */}
                </ScrollView>
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
