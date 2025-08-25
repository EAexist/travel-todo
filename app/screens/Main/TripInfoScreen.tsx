import {FC, useCallback} from 'react'
import {
  DefaultSectionT,
  ScrollView,
  SectionList,
  SectionListRenderItem,
} from 'react-native'
//
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {useNavigate} from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import {ListItemBase} from '@/components/ListItem'
import {ReservationSnapshot} from '@/models/ReservationStore'
import {MainTabScreenProps} from '@/navigators/MainTabNavigator'
import {useHeader} from '@/utils/useHeader'
import {Text} from '@rneui/themed'
import {Observer} from 'mobx-react-lite'
import * as Fab from '@/components/Fab'

export const TripInfoScreen: FC<MainTabScreenProps<'Reservation'>> = ({
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

  useHeader({
    headerShown: true,
    backButtonShown: false,
    leftComponent: (
      <Text ellipsizeMode="tail" numberOfLines={1} h2>
        내 예약
      </Text>
    ),
    leftContainerStyle: {
      flexGrow: 1,
      paddingLeft: 16,
      paddingRight: 24,
    },
    //   rightComponent: (
    // <TouchableOpacity
    //   onPress={handleSettingsButtonPress}
    //   style={styles.headerRightButton}>
    //   <Icon name="settings" color="#333d4b" size={24} />
    // </TouchableOpacity>
    //   ),
    //   leftContainerStyle: styles.headerLeftContainer,
    //   rightContainerStyle: styles.headerRightContainer,
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
