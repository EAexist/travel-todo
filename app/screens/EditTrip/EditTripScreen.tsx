import { FC, useCallback } from 'react'
import { FlatList, ListRenderItem, ScrollView } from 'react-native'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import { useTripStore } from '@/models'
import { Destination } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import {
    $headerCenterTitleContainerStyle,
    HeaderCenterTitle,
    useHeader,
} from '@/utils/useHeader'
import { Divider, ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { DestinationListItemBase } from '../CreateTrip/DestinationSettingScreen'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import { ScheduleViewerCalendar } from '@/components/Calendar/ScheduleViewerCalendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'

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
                        <ListItem.Chevron name={'error'} />
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
