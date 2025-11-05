import { Avatar } from '@/components/Avatar'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen/Screen'
import { useTripStore } from '@/models'
import { ReservationCategory } from '@/models/Reservation/Reservation'
import { AuthenticatedStackScreenProps, useNavigate } from '@/navigators'
import { Input, ListItem } from '@rneui/themed'
import { FC, useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'

export const ReservationCreateScreen: FC<
    AuthenticatedStackScreenProps<'ReservationCreate'>
> = ({ route: { params } }) => {
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

    const { createCustomReservation } = useTripStore()
    const { navigateWithTrip } = useNavigate()

    const handleCreateFromText = useCallback(() => {
        navigateWithTrip('ReservationCreateFromText', {
            category: params.category,
        })
    }, [])

    const handleCustomReservationCreate = useCallback(() => {
        const reservation = createCustomReservation(params.category)
        if (reservation) {
            navigateWithTrip('CustomReservationCreate', {
                reservationId: reservation?.id,
            })
        }
    }, [])

    const { placeholder } = useReservationCreateTexts(params.category)

    return (
        <Screen>
            <ContentTitle
                subtitle={'글에서 예약에 관한 내용만\n자동으로 정리해드려요'}
            />
            <TouchableOpacity onPress={handleCreateFromText}>
                <Input placeholder={placeholder} />
            </TouchableOpacity>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingBottom: 24,
                }}>
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
                        <ListItem.Title>{'직접 입력'}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>
        </Screen>
    )
}

export const useReservationCreateTexts = (category?: ReservationCategory) => {
    let instruction =
        '알림톡, 이메일, 또는 웹사이트에서\n예약 내역 글 전체를 복사해 붙여넣은 후\n확인 버튼을 눌러주세요.'
    let placeholder = '예약 내역 붙여넣기'

    switch (category) {
        case 'FLIGHT_BOOKING':
            instruction =
                '알림톡, 이메일, 또는 항공사 웹사이트에서\n예약 내역 글 전체를 복사해 붙여넣은 후\n확인 버튼을 눌러주세요.'
            placeholder = '항공권 내역 붙여넣기'
            break
        case 'FLIGHT_TICKET':
            instruction =
                '알림톡, 이메일, 또는 항공사 웹사이트에서\n예약 내역 글 전체를 복사해 붙여넣은 후\n확인 버튼을 눌러주세요.'
            placeholder = '탑승권 내역 붙여넣기'
            break
        default:
            break
    }
    return { instruction, placeholder }
}

export const ReservationCreateContent = ({
    category,
    placeholder = '예약 내역 붙여넣기',
}: {
    category?: ReservationCategory
    placeholder?: string
}) => {
    const { createCustomReservation } = useTripStore()
    const { navigateWithTrip } = useNavigate()

    const handleCreateFromText = useCallback(() => {
        navigateWithTrip('ReservationCreateFromText', { category })
    }, [])

    const handleCustomReservationCreate = useCallback(() => {
        const reservation = createCustomReservation(category)
        if (reservation) {
            navigateWithTrip('CustomReservationCreate', {
                reservationId: reservation?.id,
            })
        }
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleCreateFromText}>
                <Input placeholder={placeholder} />
            </TouchableOpacity>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                }}>
                {/* <ListSubheader title={'다른 방법으로 불러오기'} /> */}
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
                        <ListItem.Title>{'직접 입력'}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>
        </View>
    )
}
