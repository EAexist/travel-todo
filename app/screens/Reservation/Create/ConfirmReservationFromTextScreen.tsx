import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import { AppStackScreenProps, goBack, useNavigate } from '@/navigators'
import { FC, useCallback } from 'react'
import { FlatList, ListRenderItem, ScrollView, View } from 'react-native'
import * as Fab from '@/components/Fab'
import { Divider, ListItem, Text } from '@rneui/themed'
import { Avatar } from '@/components/Avatar'
import SectionCard from '@/components/SectionCard'
import { Icon } from '@/components/Icon'
import { useHeader } from '@/utils/useHeader'

export const ConfirmReservationFromTextScreen: FC<
  AppStackScreenProps<'ConfirmReservationFromText'>
> = (
  {
    //   route: {
    //     params: { reservationIdList },
    //   },
  },
) => {
  const { reservationStore } = useStores()
  const reservationList: Reservation[] =
    reservationStore.confirmRequiringReservation

  //   reservationIdList.map(
  //     id => reservationStore.reservation.get(id) as Reservation,
  //   )
  //   const { navigateWithTrip } = useNavigate()

  const renderCreationResultListItem: ListRenderItem<Reservation> = ({
    item: reservation,
  }) => (
    <SectionCard>
      <ListItem>
        <Avatar icon={reservation.icon} />
        <ListItem.Content>
          <ListItem.Title>{reservation.title}</ListItem.Title>
          <ListItem.Subtitle>{reservation.categoryTitle}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.CheckBox checked={true} />
      </ListItem>
      {reservation.primaryHrefLink ? (
        <ListItem containerStyle={{ height: 32 }} onPress={() => {}}>
          <Icon name="link" type="material" />
          <ListItem.Content>
            <ListItem.Subtitle>{reservation.primaryHrefLink}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ) : (
        <Fab.Container fixed={false}>
          <Fab.Button title={'링크 추가하기'} color={'secondary'} />
        </Fab.Container>
      )}
    </SectionCard>
  )

  const handlePressConfirm = useCallback(() => {
    goBack()
  }, [])

  useHeader({
    backgroundColor: 'secondary',
  })

  return (
    <Screen backgroundColor={'secondary'}>
      <ContentTitle
        title={`${reservationList.length}개 예약을 추가할게요`}
        // subtitle={
        //   '알림톡, 이메일, 또는 웹사이트의\n예약 내역 전체를 복사해 붙여넣어주세요.'
        // }
      />
      <ScrollView>
        <FlatList
          data={reservationList}
          renderItem={renderCreationResultListItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      <Fab.Container>
        <Fab.Button title={'확인'} onPress={handlePressConfirm} />
      </Fab.Container>
    </Screen>
  )
}
