import { FC, useCallback, useRef } from 'react'
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
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { useNavigate } from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import BottomSheetModal from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import {
  NavigateMenuBottomSheet,
  NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'
import { Reservation } from '@/models/Reservation/Reservation'
import { MainTabScreenProps } from '@/navigators/MainTabNavigator'
import { useMainScreenHeader } from '@/utils/useHeader'
import { FAB, Text } from '@rneui/themed'
import { observer, Observer } from 'mobx-react-lite'
import { ReservationListItem } from './ReservationListItem'

export const ReservationListScreen: FC<MainTabScreenProps<'ReservationList'>> =
  observer(() => {
    const { navigateWithTrip } = useNavigate()
    const rootStore = useStores()
    const { reservationStore } = rootStore

    const handleAddReservation = useCallback(() => {
      navigateWithTrip('CreateReservation')
    }, [])

    const renderItem: SectionListRenderItem<
      //   Partial<ReservationSnapshot>,
      Reservation,
      DefaultSectionT
    > = ({ item }) => (
      <Observer render={() => <ReservationListItem reservation={item} />} />
    )

    const renderSectionHeader = useCallback(
      ({ section: { title } }: { section: DefaultSectionT }) => (
        <ListSubheader title={title} />
      ),
      [],
    )

    /* Menu */
    const handlePinButtonPress = useCallback(() => {}, [])

    const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

    const handleSettingsButtonPress = useCallback(() => {
      settingsMenuBottomSheetRef.current?.present()
    }, [settingsMenuBottomSheetRef])

    const settingsOption: NavigateMenuData[] = [
      {
        title: '예약 추가',
        path: 'CreateReservation',
        icon: { name: 'add', type: 'material' },
        primary: true,
      },
      {
        title: '예약 편집',
        path: 'CreateReservation',
        icon: { name: 'edit', type: 'material' },
      },
      {
        title: '예약 삭제',
        path: 'DeleteReservation',
        icon: { name: 'delete', type: 'material' },
      },
      // {
      //   title: '목록 순서 변경',
      //   path: 'TodolistReorder',
      //   icon: { name: 'swap-vert', type: 'material' },
      // },
    ]

    useMainScreenHeader({
      //   title: tripStore.title,
      title: '내 예약',
      rightComponent: (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={handlePinButtonPress}
            style={$headerRightButtonStyle}>
            <HeaderIcon name="pin" type="octicon" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSettingsButtonPress}
            style={$headerRightButtonStyle}>
            <HeaderIcon name="gear" type="octicon" />
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
            <Text style={{ padding: 24, textAlign: 'center' }}>
              이 곳에서
              <br />
              여행 중 필요한 다양한 예약을 관리해보세요
            </Text>
          )}
        </ScrollView>
        <FAB
          onPress={handleAddReservation}
          icon={{ name: 'add', color: 'white' }}
          // size="large"
          // color={'red'}
          placement="right"
        />
        <NavigateMenuBottomSheet
          data={settingsOption}
          ref={settingsMenuBottomSheetRef}
        />
      </Screen>
    )
  })
