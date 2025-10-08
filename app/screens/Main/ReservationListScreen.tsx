import { FC, useCallback, useRef, useState } from 'react'
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
import { useStores, useTripStore } from '@/models'
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
import { Divider, FAB, Icon, Switch, Text } from '@rneui/themed'
import { observer, Observer } from 'mobx-react-lite'
import { ReservationListItem } from './ReservationListItem'
import { ListItem } from '@rneui/themed'
import { Pin } from 'lucide-react-native'
import { useTheme } from '@rneui/themed'
import { ListItemCaption } from '@/components/ListItemCaption'

export const ReservationListScreen: FC<MainTabScreenProps<'ReservationList'>> =
  observer(() => {
    const tripStore = useTripStore()
    const { navigateWithTrip } = useNavigate()
    const rootStore = useStores()
    const { reservationStore } = rootStore

    const handleAddReservation = useCallback(() => {
      navigateWithTrip('ReservationCreate')
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
    const handlePinButtonPress = useCallback(() => {
      tripStore.toggleTripMode()
    }, [])

    const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

    const handleSettingsButtonPress = useCallback(() => {
      settingsMenuBottomSheetRef.current?.present()
    }, [settingsMenuBottomSheetRef])

    const settingsOption: NavigateMenuData[] = [
      {
        title: '예약 추가',
        path: 'ReservationCreate',
        icon: { name: 'add', type: 'material' },
        primary: true,
      },
      {
        title: '예약 편집',
        path: 'ReservationEditList',
        icon: { name: 'edit', type: 'material' },
      },
      {
        title: '예약 삭제',
        path: 'ReservationDelete',
        icon: { name: 'delete', type: 'material' },
      },
      // {
      //   title: '목록 순서 변경',
      //   path: 'TodolistReorder',
      //   icon: { name: 'swap-vert', type: 'material' },
      // },
    ]

    const tripModeHelpBottomSheetRef = useRef<BottomSheetModal>(null)

    const {
      theme: { colors },
    } = useTheme()

    useMainScreenHeader(
      {
        //   title: tripStore.title,
        title: '내 예약',
        rightComponent: (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              //   onPress={handlePinButtonPress}
              disabled
              style={$headerRightButtonStyle}>
              {tripStore.isTripMode ? (
                <Pin fill={colors.text.primary} />
              ) : (
                <Pin />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSettingsButtonPress}
              style={$headerRightButtonStyle}>
              <HeaderIcon name="gear" type="octicon" />
            </TouchableOpacity>
          </View>
        ),
      },
      [tripStore.isTripMode],
    )

    const [showHelp, setShowHelp] = useState(false)

    const handlePressHelpTravelMode = useCallback(() => {
      setShowHelp(true)
    }, [])

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
          onDismiss={() => setShowHelp(false)}>
          <Divider width={1} />
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
          {showHelp && (
            <Text
              style={{ fontSize: 15, paddingHorizontal: 24, paddingTop: 12 }}>
              여행 중 간편하게 사용할 수 있도록
              <br />
              1.앱을 켜면 <b>할 일</b> 대신 <b>예약</b> 페이지를 바로 열어요.
              <br />
              2.에약 항목을 누르면 <b>저장한 링크로 바로 연결</b>해요
            </Text>
          )}
        </NavigateMenuBottomSheet>
      </Screen>
    )
  })
