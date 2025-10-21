import { Screen } from '@/components'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import { useReservationStore } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import { useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ListItem } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import {
    DefaultSectionT,
    ScrollView,
    SectionList,
    SectionListRenderItem,
} from 'react-native'

interface ReservationEditItemProps {
    reservation: Reservation
}
const ReservationEditItem: FC<ReservationEditItemProps> = ({ reservation }) => {
    const { navigateWithTrip } = useNavigate()
    const handlePress = useCallback(() => {
        navigateWithTrip('ReservationEdit', { reservationId: reservation.id })
    }, [])
    return (
        <ListItemBase
            avatarProps={{ icon: reservation.icon }}
            title={reservation.title}
            subtitle={reservation.categoryTitle || undefined}
            onPress={handlePress}
            rightContent={<ListItem.Chevron name={'edit'} />}
        />
    )
}

const ReservationEditListScreen: FC = observer(() => {
    const reservationStore = useReservationStore()

    //   const renderSectionHeader = useCallback(
    //     ({ section: { title } }: { section: DefaultSectionT }) => (
    //       <ListSubheader title={title} />
    //     ),
    //     [],
    //   )

    const renderItem: SectionListRenderItem<
        ReservationEditItemProps,
        DefaultSectionT
    > = useCallback(
        ({ item }) => (
            <Observer
                render={() => (
                    <ReservationEditItem reservation={item.reservation} />
                )}
            />
        ),
        [],
    )

    const sections = reservationStore.reservationSections?.map(
        ({ title, data }) => {
            return {
                title,
                data: data.map(r => ({
                    reservation: r,
                })),
            }
        },
    )

    const navigation = useNavigation()
    const { navigateWithTrip } = useNavigate()
    const handleNavigateToReservationDelete = useCallback(() => {
        navigation.dispatch(StackActions.pop(1))
        navigateWithTrip('ReservationDelete')
    }, [])

    useHeader({
        rightActionTitle: '삭제',
        onRightPress: handleNavigateToReservationDelete,
    })
    return (
        <Screen>
            <ContentTitle
                title={'예약 편집'}
                subtitle={'편집할 예약을 선택해주세요.'}
            />
            <ScrollView>
                {sections && (
                    <SectionList
                        // sections={[...reservationStore.reservations.values()].map(r => ({
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
                <Fab.GoBackButton title={'확인'} />
            </Fab.Container>
        </Screen>
    )
})
