import { Avatar } from '@/components/Avatar'
import { GestureHandlerRootViewWrapper } from '@/components/BottomSheetModal'
import ContentTitle, { Title } from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import { useStores } from '@/models'
import {
  ReservationDataItemType,
  ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { withReservation } from '@/utils/withReservation'
import { Divider, ListItem, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import {
  FlatList,
  ListRenderItem,
  ScrollView,
  View,
  ViewStyle,
} from 'react-native'

export const ReservationScreen = withReservation<'Reservation'>(
  observer(({ reservation }) => {
    const { navigateWithTrip } = useNavigate()
    const { reservationStore } = useStores()

    const handleLinkPress = useCallback(() => {
      navigateWithTrip('EditReservationLink', {
        reservationId: reservation.id,
      })
    }, [navigateWithTrip, reservation.id])

    const handleBackPressBeforeNavigate = useCallback(async () => {
      reservationStore.patch(reservation as ReservationSnapshot)
    }, [reservationStore, reservation])

    useHeader({ onBackPressBeforeNavigate: handleBackPressBeforeNavigate })

    const [isLinkFocused, setIsLinkFocused] = useState(false)

    const renderReservationDetail: ListRenderItem<
      Pick<ReservationDataItemType, 'title' | 'value' | 'numberOfLines'>
    > = useCallback(({ item }) => {
      return (
        <TextInfoListItem title={item.title}>
          {item.numberOfLines ? (
            <Text numberOfLines={item.numberOfLines}>{item.value}</Text>
          ) : (
            item.value
          )}
        </TextInfoListItem>
      )
    }, [])

    const handleNavigateToEdit = useCallback(() => {
      navigateWithTrip('EditReservation', {
        reservationId: reservation.id,
      })
    }, [])

    useHeader({
      rightActionTitle: '편집',
      onRightPress: handleNavigateToEdit,
    })

    return (
      <GestureHandlerRootViewWrapper>
        <Screen>
          <ContentTitle
            variant="listItem"
            title={reservation.title}
            icon={reservation.icon}
          />
          <ScrollView>
            <TextInfoListItem
              onPress={handleLinkPress}
              title={'링크'}
              rightContent={
                <ListItem.Chevron
                  name={reservation.primaryHrefLink ? 'link' : 'chevron-right'}
                />
              }>
              <TransText
                primary={!reservation.primaryHrefLink}
                numberOfLines={1}>
                {reservation.primaryHrefLink || '예약 확인 링크를 입력하세요'}
              </TransText>
            </TextInfoListItem>
            {reservation.category === 'ACCOMODATION' ? (
              <>
                <TextInfoListItem title={'체크인'}>
                  <TransText numberOfLines={1}>
                    {reservation.time || '-'}
                  </TransText>
                </TextInfoListItem>
                <TextInfoListItem title={'체크아웃'}>
                  <TransText numberOfLines={1}>
                    {reservation.time || '-'}
                  </TransText>
                </TextInfoListItem>
              </>
            ) : (
              <TextInfoListItem title={reservation.timeDataTitle}>
                <TransText numberOfLines={1}>
                  {reservation.time || '-'}
                </TransText>
              </TextInfoListItem>
            )}
            <TextInfoListItem title={'메모'}>
              <TransText numberOfLines={2}>{reservation.note || '-'}</TransText>
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
                    keyExtractor={item => item.title}
                  />
                </View>
              )}
            {reservation.infoListItemProps.filter(({ value }) => value === null)
              .length > 0 && (
              <ListItem onPress={handleNavigateToEdit}>
                <ListItem.Content>
                  <ListItem.Title>{'상세 내역 추가하기'}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron name="add" />
              </ListItem>
            )}
          </ScrollView>
        </Screen>
      </GestureHandlerRootViewWrapper>
    )
  }),
)

const $listItemContainerStyle: ViewStyle = {
  height: 60,
}
