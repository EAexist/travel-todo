import { Avatar } from '@/components/Avatar'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { AppStackScreenProps, useNavigate } from '@/navigators'
import { Input, ListItem } from '@rneui/themed'
import { FC, useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'

export const ReservationCreateScreen: FC<
  AppStackScreenProps<'ReservationCreate'>
> = ({ route: { params } }) => {
  const {
    reservationStore: { createCustomReservation },
  } = useStores()
  const { navigateWithTrip } = useNavigate()

  const handleCreateFromText = useCallback(() => {
    navigateWithTrip('ReservationCreateFromText')
  }, [])

  const handleCreateFromGmail = useCallback(() => {
    // navigateWithTrip('')
  }, [])

  const handleCustomReservationCreate = useCallback(() => {
    const reservation = createCustomReservation(params.defaultCategory)
    if (reservation) {
      navigateWithTrip('CustomReservationCreate', {
        reservationId: reservation?.id,
      })
    }
  }, [])
  //   const handleCustomReservationCreate = useCallback(
  //     (category: ReservationCategory) => {
  //       const reservation = createCustomReservation(category)
  //       if (reservation) {
  //         let path = ''
  //         switch (reservation.category) {
  //           case 'ACCOMODATION':
  //             path = 'CreateAccomodationReservation'
  //             break
  //           case 'FLIGHT_BOOKING':
  //             path = 'CreateFlightBookingReservation'
  //             break
  //           case 'FLIGHT_TICKET':
  //             path = 'CreateFlightTicketReservation'
  //             break
  //           case 'GENERAL':
  //             path = 'CustomReservationCreate'
  //             break
  //           default:
  //             break
  //         }

  //         navigateWithTrip(path, {
  //           reservationId: reservation?.id,
  //           isInitializing: true,
  //         })
  //       }
  //     },
  //     [],
  //   )

  //   interface reservationCategoryMenuType {
  //     category: ReservationCategory
  //     title: string
  //     subtitle?: string
  //     icon: Icon
  //   }
  //   const reservationCategoryMenu: reservationCategoryMenuType[] = [
  //     {
  //       category: 'ACCOMODATION',
  //       title: '숙박',
  //       icon: { name: '🛌', type: 'tossface' },
  //     },
  //     {
  //       category: 'FLIGHT_BOOKING',
  //       title: '항공권 예약',
  //       subtitle: '발권 전',
  //       icon: { name: '✈️', type: 'tossface' },
  //     },
  //     {
  //       category: 'FLIGHT_TICKET',
  //       title: '항공권 모바일 탑승권',
  //       subtitle: '발권 후',
  //       icon: { name: '🛫', type: 'tossface' },
  //     },
  //     {
  //       category: 'GENERAL',
  //       title: '기타 예약',
  //       icon: { name: '🎫', type: 'tossface' },
  //     },
  //   ]

  //   const renderCategoryMenuItem: ListRenderItem<reservationCategoryMenuType> =
  //     useCallback(({ item }) => {
  //       return (
  //         <ListItem onPress={() => handleCustomReservationCreate(item.category)}>
  //           <Avatar icon={item.icon} />
  //           <ListItem.Content>
  //             <ListItem.Title>{item.title}</ListItem.Title>
  //             <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
  //           </ListItem.Content>
  //           <ListItem.Chevron />
  //         </ListItem>
  //       )
  //     }, [])

  return (
    <Screen>
      <ContentTitle
        subtitle={'글에서 예약에 관한 내용만\n자동으로 정리해드려요'}
      />
      <TouchableOpacity onPress={handleCreateFromText}>
        <Input
          //   containerStyle={{ marginVertical: 24 }}
          placeholder="예약 내역 붙여넣기"
          //   label="글에서 예약에 관한 내용만 자동으로 정리해드려요"
        />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 24 }}>
        <ListSubheader title={'다른 방법으로 불러오기'} />
        {/* <ListItem
          onPress={handleCreateFromGmail}
        >
          <Avatar icon={{ name: 'mail', type: 'material' }} />
          <ListItem.Content>
            <ListItem.Title>{'Gmail에서 내역 추가하기'}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem> */}
        <ListItem onPress={handleCustomReservationCreate}>
          <Avatar icon={{ name: 'edit', type: 'material' }} />
          <ListItem.Content>
            <ListItem.Title>{'직접 입력하기'}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
      {/* <FlatList
        data={reservationCategoryMenu}
        renderItem={renderCategoryMenuItem}
        keyExtractor={item => item.category}
      /> */}
    </Screen>
  )
}
