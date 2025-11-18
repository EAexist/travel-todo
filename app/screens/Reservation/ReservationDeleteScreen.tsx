import { Screen } from '@/components'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import { useReservationStore } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import { AuthenticatedStackScreenProps } from '@/navigators'
import { useCheckedList } from '@/utils/useCheckedList'
import { useHeader } from '@/utils/useHeader'
import { ListItem, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { ScrollView } from 'react-native'
import { ReservationList } from '../../components/Reservation/ReservationList'

interface ReservationDeleteItemProps {
    reservation: Reservation
    isChecked: boolean
    onPress: () => void
}
const ReservationDeleteItem: FC<ReservationDeleteItemProps> = ({
    reservation,
    isChecked,
    onPress,
}) => {
    const {
        theme: { colors },
    } = useTheme()
    return (
        <ListItemBase
            avatarProps={{ icon: reservation.icon }}
            title={reservation.title}
            onPress={onPress}
            rightContent={
                <ListItem.CheckBox
                    checked={isChecked}
                    onPress={onPress}
                    checkedColor={colors.text.secondary}
                />
            }
        />
    )
}

export const ReservationDeleteScreen: FC<
    AuthenticatedStackScreenProps<'ReservationDelete'>
> = observer(() => {
    const reservationStore = useReservationStore()

    const {
        checkedlist: deleteList,
        handlePress,
        setCheckedList: setDeleteList,
        numOfCheckedItem: numOfDeleteFlags,
    } = useCheckedList([...reservationStore.reservations.keys()])

    const handleCompletePress = useCallback(async () => {
        Object.entries(deleteList)
            .filter(([_, isChecked]) => isChecked)
            .forEach(([id, _]) => {
                console.log('DELETE' + id)
                reservationStore.delete(id)
            })
    }, [deleteList])

    const renderItem = useCallback(
        (reservation: Reservation) => (
            <ReservationDeleteItem
                reservation={reservation}
                isChecked={deleteList[reservation.id]}
                onPress={() => handlePress(reservation.id)}
            />
        ),
        [deleteList],
    )

    const handleReset = () => {
        setDeleteList(prev =>
            Object.fromEntries(
                Object.entries(prev).map(([k, _]) => [k, false]),
            ),
        )
    }

    useHeader(
        {
            ...(numOfDeleteFlags <= 0
                ? {}
                : {
                      rightActionTitle: '선택 해제',
                      onRightPress: handleReset,
                  }),
            backgroundColor: 'secondary',
        },
        [numOfDeleteFlags],
    )

    return (
        <Screen backgroundColor="secondary">
            <ContentTitle
                title={'예약 삭제하기'}
                subtitle={'관리하지 않아도 되늗 예약을 지울 수 있어요'}
            />
            <ScrollView>
                <ReservationList renderItem={renderItem} />
            </ScrollView>
            <Fab.Container>
                <Fab.GoBackButton
                    title={
                        numOfDeleteFlags > 0
                            ? `${numOfDeleteFlags}개 예약 삭제`
                            : '확인'
                    }
                    promiseBeforeNavigate={handleCompletePress}
                    disabled={numOfDeleteFlags <= 0}
                />
            </Fab.Container>
        </Screen>
    )
})
