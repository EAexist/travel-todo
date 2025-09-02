import {FC, useCallback} from 'react'
import {
  DefaultSectionT,
  ScrollView,
  SectionList,
  SectionListRenderItem,
  TouchableOpacity,
  View,
} from 'react-native'
//
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {useNavigate} from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import * as Fab from '@/components/Fab'
import {$headerRightButtonStyle, HeaderIcon} from '@/components/Header'
import {ListItemBase} from '@/components/ListItem'
import {ReservationSnapshot} from '@/models/stores/ReservationStore'
import {MainTabScreenProps} from '@/navigators/MainTabNavigator'
import {useMainScreenHeader} from '@/utils/useHeader'
import {Text} from '@rneui/themed'
import {Observer} from 'mobx-react-lite'

const ReservationListItem: FC<{reservation: ReservationSnapshot}> = ({
  reservation,
}) => {
  const {navigateWithTrip} = useNavigate()
  const handlePress = useCallback(() => {
    navigateWithTrip('FullScreenImage', {
      reservationId: reservation.id,
      localAppStorageFileUri: reservation.localAppStorageFileUri,
    })
  }, [])
  return <ListItemBase title={reservation.title} onPress={handlePress} />
}

export const ReservationScreen: FC<MainTabScreenProps<'Reservation'>> = ({
  route,
}) => {
  const rootStore = useStores()
  const {reservationStore} = rootStore

  const handleAddReservation = useCallback(() => {}, [])

  const renderItem: SectionListRenderItem<
    //   Partial<ReservationSnapshot>,
    ReservationSnapshot,
    DefaultSectionT
  > = ({item}) => (
    <Observer
      render={() => {
        switch (item.type) {
          case 'accomodation':
            return <ReservationListItem reservation={item} />
          case 'flightTicket':
            return <ReservationListItem reservation={item} />
          default:
            return <ReservationListItem reservation={item} />
        }
      }}
    />
  )

  const renderSectionHeader = useCallback(
    ({section: {title}}: {section: DefaultSectionT}) => (
      <ListSubheader title={title} />
    ),
    [],
  )

  /* Menu */
  const handlePinButtonPress = useCallback(() => {}, [])

  const handleSettingsButtonPress = useCallback(() => {}, [])

  useMainScreenHeader({
    //   title: tripStore.title,
    title: '내 예약',
    rightComponent: (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={handlePinButtonPress}
          style={$headerRightButtonStyle}>
          <HeaderIcon name="gear" type="octicon" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSettingsButtonPress}
          style={$headerRightButtonStyle}>
          <HeaderIcon name="pin" type="octicon" />
        </TouchableOpacity>
      </View>
    ),
  })

  return (
    <Screen>
      <ScrollView>
        {reservationStore.reservationSections &&
        reservationStore.reservationSections[0].data.length > 0 ? (
          <SectionList
            sections={reservationStore.reservationSections}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            //   renderSectionHeader={renderSectionHeader}
          />
        ) : (
          <Text style={{padding: 24, textAlign: 'center'}}>
            이 곳에서
            <br />
            여행 중 필요한 다양한 예약을 관리해보세요
          </Text>
        )}
      </ScrollView>
      <Fab.Container>
        <Fab.Button
          title={'예약 내역 추가하기'}
          onPress={handleAddReservation}
        />
      </Fab.Container>
    </Screen>
  )
}
