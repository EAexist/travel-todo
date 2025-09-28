import { Screen } from '@/components'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem'
import { useStores } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import { goBack } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { ListItem } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  DefaultSectionT,
  ScrollView,
  SectionList,
  SectionListRenderItem,
} from 'react-native'
import * as Fab from '@/components/Fab'

interface DeleteReservationItemProps {
  reservation: Reservation
  isChecked: boolean
  onPress: () => void
}
const DeleteReservationItem: FC<{
  reservation: Reservation
  isChecked: boolean
  onPress: () => void
}> = ({ reservation, isChecked, onPress }) => {
  const handlePress = useCallback(() => {}, [])
  return (
    <ListItemBase
      avatarProps={{ icon: reservation.icon }}
      title={reservation.title}
      onPress={onPress}
      rightContent={<ListItem.CheckBox checked={isChecked} onPress={onPress} />}
    />
  )
}

export const EditReservationScreen: FC = observer(() => {
  const { reservationStore } = useStores()

  const [deleteList, setDeleteList] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(
      [...reservationStore.reservation.keys()].map(id => [id, false]),
    ),
  )

  const numberOfDeletion = Object.values(deleteList).filter(
    isChecked => isChecked,
  ).length

  const handleCompletePress = useCallback(async () => {
    Object.entries(deleteList)
      .filter(([_, isChecked]) => isChecked)
      .forEach(([id, _]) => {
        console.log('DELETE' + id)
        reservationStore.delete(id)
      })
  }, [deleteList])

  //   const renderSectionHeader = useCallback(
  //     ({ section: { title } }: { section: DefaultSectionT }) => (
  //       <ListSubheader title={title} />
  //     ),
  //     [],
  //   )
  const handlePress = useCallback(
    (reservationId: string) => {
      setDeleteList(prev => ({
        ...prev,
        [reservationId]: !prev[reservationId],
      }))
    },
    [setDeleteList],
  )

  //   useEffect(() => {
  //     console.log('deleteList', deleteList)
  //   }, [deleteList])

  const renderItem: SectionListRenderItem<
    DeleteReservationItemProps,
    DefaultSectionT
  > = useCallback(
    ({ item }) => (
      <Observer
        render={() => (
          <DeleteReservationItem
            reservation={item.reservation}
            isChecked={item.isChecked}
            onPress={item.onPress}
          />
        )}
      />
    ),
    [deleteList],
  )

  const handleReset = () => {
    setDeleteList(prev =>
      Object.fromEntries(Object.entries(prev).map(([k, _]) => [k, false])),
    )
  }

  useHeader({
    rightActionTitle: '선택 해제',
    onRightPress: handleReset,
  })

  const sections = reservationStore.reservationSections?.map(
    ({ title, data }) => {
      const newData = data.map(r => ({
        reservation: r,
        isChecked: deleteList[r.id],
        onPress: () => handlePress(r.id),
      }))
      return { title, data: newData }
    },
  )

  return (
    <Screen>
      <ContentTitle
        title={'할 일 삭제하기'}
        subtitle={'관리하지 않아도 되늗 할 일을 지울 수 있어요'}
      />
      <ScrollView>
        {sections && (
          <SectionList
            // sections={[...reservationStore.reservation.values()].map(r => ({
            //   reservation: r,
            // }))}
            sections={sections}
            keyExtractor={item => item.reservation.id}
            renderItem={renderItem}
            //   renderSectionHeader={renderSectionHeader}
          />
        )}
      </ScrollView>
      <Fab.Container>
        <Fab.GoBackButton
          title={
            numberOfDeletion > 0 ? `${numberOfDeletion}개 예약 삭제` : '확인'
          }
          promiseBeforeNavigate={handleCompletePress}
          disabled={numberOfDeletion <= 0}
        />
      </Fab.Container>
    </Screen>
  )
})
