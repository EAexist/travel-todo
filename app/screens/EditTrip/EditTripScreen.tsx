import { Avatar } from '@/components/Avatar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import { ScheduleViewerCalendar } from '@/components/Calendar/ScheduleViewerCalendar'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen/Screen'
import { useTripStore } from '@/models'
import { Destination } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { Divider, ListItem, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { FlatList, ListRenderItem, ScrollView } from 'react-native'
import { DestinationListItemBase } from '../CreateTrip/DestinationSettingScreen'

export const EditTripScreen: FC<{}> = observer(({}) => {
    const tripStore = useTripStore()
    const renderDestinationText: ListRenderItem<Destination> = ({ item }) => (
        <DestinationListItemBase item={item} />
    )

    const { navigateWithTrip } = useNavigate()

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
    })

    const {
        theme: { colors },
    } = useTheme()

    return (
        <Screen>
            <ScrollView>
                <ListSubheader title={'여행 이름'} />
                <ListItem onPress={handleEditTitle}>
                    <ListItem.Content>
                        <ListItem.Title>{tripStore.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <Divider />
                <ListSubheader title={'여행지'} />
                {tripStore.isDestinationSet ? (
                    <FlatList
                        data={tripStore.destinations}
                        renderItem={renderDestinationText}
                        keyExtractor={item => item.title}
                    />
                ) : (
                    <ListItem onPress={handleEditDestination}>
                        <ListItem.Chevron name={'error'} />
                        <ListItem.Content>
                            <ListItem.Title>설정 안함</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                )}
                <ListItem onPress={handleEditDestination}>
                    {!tripStore.isDestinationSet && (
                        <ListItem.Chevron name={'error'} />
                    )}
                    <Avatar
                        icon={{
                            name: 'edit',
                            type: 'material',
                            color: colors.text.secondary,
                        }}
                    />
                    <ListItem.Content>
                        <ListItem.Title>
                            {tripStore.isDestinationSet
                                ? '여행지 수정'
                                : '설정 안함'}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <Divider />
                {/* <EditTripSubheader title={'일정'} path={'ScheduleSetting'} /> */}
                <ListSubheader title={'일정'} />
                <ListItem onPress={handleEditSchedule}>
                    {!tripStore.isScheduleSet && (
                        <ListItem.Chevron name={'error'} />
                    )}
                    <ListItem.Content style={{ alignItems: 'stretch' }}>
                        {tripStore.isScheduleSet ? (
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
                <CalendarContainer style={{ paddingHorizontal: 12 }}>
                    <ScheduleViewerCalendar />
                </CalendarContainer>
            </ScrollView>
        </Screen>
    )
})
