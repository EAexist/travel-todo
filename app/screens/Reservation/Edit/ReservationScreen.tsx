import BottomSheetModal from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen/Screen'
import StyledSwitch from '@/components/StyledSwitch'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import { useReservationStore } from '@/models'
import {
    ReservationDataItemType,
    ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { withReservation } from '@/utils/withReservation'
import { Divider, ListItem, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { useCallback, useRef, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    ScrollView,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
import { ReservationDetailListItem } from './ReservationDetailListItem'

export const ReservationScreen = withReservation<'Reservation'>(
    observer(({ reservation }) => {
        const { navigateWithTrip } = useNavigate()
        const reservationStore = useReservationStore()

        const handleBackPressBeforeNavigate = useCallback(async () => {
            reservation.patch(reservation as ReservationSnapshot)
        }, [])

        useHeader({ onBackPressBeforeNavigate: handleBackPressBeforeNavigate })

        const [isLinkFocused, setIsLinkFocused] = useState(false)

        const renderReservationDetail: ListRenderItem<
            Pick<
                ReservationDataItemType,
                'id' | 'title' | 'value' | 'numberOfLines'
            >
        > = useCallback(({ item }) => {
            return (
                <ReservationDetailListItem
                    reservation={reservation}
                    item={item}
                />
            )
        }, [])

        const handleNavigateToEdit = useCallback(() => {
            navigateWithTrip('ReservationEdit', {
                reservationId: reservation.id,
            })
        }, [])

        const confirmReservationDeleteBottomSheetModalRef =
            useRef<BottomSheetModal>(null)

        const handleDeletePress = useCallback(() => {
            confirmReservationDeleteBottomSheetModalRef.current?.present()
        }, [confirmReservationDeleteBottomSheetModalRef.current])

        useHeader({
            rightComponent: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={handleNavigateToEdit}
                        style={$headerRightButtonStyle}>
                        <HeaderIcon name="pencil" type="octicon" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDeletePress}
                        style={$headerRightButtonStyle}>
                        <HeaderIcon name="trash" type="octicon" />
                    </TouchableOpacity>
                </View>
            ),
        })

        return (
            <Screen>
                <ContentTitle
                    variant="listItem"
                    title={reservation.title}
                    icon={reservation.icon}
                    subtitle={reservation.categoryTitle}
                />
                <ScrollView>
                    <TextInfoListItem
                        title={'상태'}
                        rightContent={
                            <StyledSwitch
                                isActive={reservation.isCompleted}
                                onChange={reservation.toggleIsCompleted}
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
                        }>
                        <Text>
                            {reservation.isCompleted ? '사용 완료' : '사용 전'}
                        </Text>
                    </TextInfoListItem>
                    <ReservationDetailListItem
                        reservation={reservation}
                        item={{ id: 'primaryHrefLink' }}
                    />
                    <ReservationDetailListItem
                        reservation={reservation}
                        item={{ id: 'time' }}
                    />
                    <TextInfoListItem title={'메모'}>
                        <TransText numberOfLines={2}>
                            {reservation.note || '-'}
                        </TransText>
                    </TextInfoListItem>
                    {reservation.infoListItemProps &&
                        reservation.infoListItemProps.length > 0 && (
                            <View>
                                <Divider />
                                <ListSubheader title="상세 내역" />
                                <FlatList
                                    scrollEnabled={false}
                                    data={reservation.infoListItemProps.filter(
                                        ({ value }) => value !== null,
                                    )}
                                    renderItem={renderReservationDetail}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        )}
                    {reservation.infoListItemProps.filter(
                        ({ value }) => value === null,
                    ).length > 0 && (
                        <ListItem onPress={handleNavigateToEdit}>
                            <ListItem.Content>
                                <ListItem.Title>
                                    {'상세 내역 추가하기'}
                                </ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron name="add" />
                        </ListItem>
                    )}
                </ScrollView>
                <BottomSheetModal
                    ref={confirmReservationDeleteBottomSheetModalRef}>
                    <ContentTitle title={'이 예약을 삭제할까요?'} />
                    <Fab.Container fixed={false} dense>
                        <Fab.GoBackButton
                            promiseBeforeNavigate={async () => {
                                reservationStore.delete(reservation.id)
                                confirmReservationDeleteBottomSheetModalRef.current?.close()
                            }}
                            title={'확인'}
                        />
                    </Fab.Container>
                </BottomSheetModal>
            </Screen>
        )
    }),
)

const $listItemContainerStyle: ViewStyle = {
    height: 60,
}
