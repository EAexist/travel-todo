import { Avatar } from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import { Screen } from '@/components/Screen/Screen'
import SectionCard from '@/components/SectionCard'
import { ConfirmRequiringReservation } from '@/models/stores/ReservationStore'
import { AuthenticatedStackScreenProps, goBack } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ListItem, useTheme } from '@rneui/themed'
import { Observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { FlatList, ListRenderItem, ScrollView } from 'react-native'

export const ReservationConfirmFromTextScreen: FC<
    AuthenticatedStackScreenProps<'ReservationConfirmFromText'>
> = () => {
    const navigation = useNavigation()
    const reservationStore = useReservationStore()

    const reservationList: ConfirmRequiringReservation[] =
        reservationStore.confirmRequiringReservation

    const renderCreationResultListItem_: ListRenderItem<ConfirmRequiringReservation> =
        useCallback(
            ({ item }) => (
                <Observer
                    render={() => (
                        <SectionCard>
                            <ListItem>
                                <Avatar icon={item.reservation.icon} />
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {item.reservation.title}
                                    </ListItem.Title>
                                    <ListItem.Subtitle>
                                        {item.reservation.categoryTitle}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.CheckBox
                                    checked={item.isFlaggedToAdd}
                                    onPress={() => item.toggleIsFlaggedToAdd()}
                                />
                            </ListItem>
                            {item.reservation.primaryHrefLink ? (
                                <ListItem
                                    containerStyle={{ height: 32 }}
                                    onPress={() => {}}>
                                    <Icon name="link" type="material" />
                                    <ListItem.Content>
                                        <ListItem.Subtitle>
                                            {item.reservation.primaryHrefLink}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            ) : (
                                <Fab.Container fixed={false}>
                                    <Fab.Button
                                        title={'링크 추가하기'}
                                        color={'secondary'}
                                    />
                                </Fab.Container>
                            )}
                        </SectionCard>
                    )}
                />
            ),
            [],
        )

    const {
        theme: { colors },
    } = useTheme()

    const renderCreationResultListItem: ListRenderItem<ConfirmRequiringReservation> =
        useCallback(
            ({ item }) => (
                <Observer
                    render={() => (
                        <SectionCard>
                            <ContentTitle
                                variant="listItem"
                                title={item.reservation.title}
                                subtitle={item.reservation.categoryTitle}
                                icon={item.reservation.icon}
                                rightComponent={
                                    <ListItem.CheckBox
                                        checked={item.isFlaggedToAdd}
                                        onPress={() =>
                                            item.toggleIsFlaggedToAdd()
                                        }
                                    />
                                }
                                useSubtitleAvatar
                            />
                            <ListItemBase
                                avatarProps={{
                                    icon: {
                                        name: 'link',
                                        type: 'octicon',
                                        size: 20,
                                        color: colors.text.primary,
                                    },
                                    containerStyle: {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                                title={item.reservation.primaryHrefLink || '-'}
                            />
                            {item.reservation.category === 'ACCOMODATION' ? (
                                <>
                                    <ListItemBase
                                        avatarProps={{
                                            icon: {
                                                name: 'sign-in',
                                                type: 'octicon',
                                                size: 20,
                                                color: colors.text.primary,
                                            },
                                            containerStyle: {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        title={
                                            item.reservation.accomodation
                                                ?.checkinDateTimeParsed || '-'
                                        }
                                    />
                                    <ListItemBase
                                        avatarProps={{
                                            icon: {
                                                name: 'sign-out',
                                                type: 'octicon',
                                                size: 20,
                                                color: colors.text.primary,
                                            },
                                            containerStyle: {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        title={
                                            item.reservation.accomodation
                                                ?.checkoutDateTimeParsed || '-'
                                        }
                                    />
                                    {item.reservation.accomodation
                                        ?.nightsParsed && (
                                        <ListItemBase
                                            avatarProps={{
                                                icon: {
                                                    name: 'moon',
                                                    type: 'octicon',
                                                    size: 20,
                                                    color: colors.text.primary,
                                                },
                                                containerStyle: {
                                                    backgroundColor:
                                                        'transparent',
                                                },
                                            }}
                                            title={
                                                item.reservation.accomodation
                                                    ?.nightsParsed
                                            }
                                        />
                                    )}
                                </>
                            ) : (
                                <ListItemBase
                                    avatarProps={{
                                        icon: {
                                            name: 'clock',
                                            type: 'octicon',
                                            size: 20,
                                            color: colors.text.primary,
                                        },
                                        containerStyle: {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    title={item.reservation.timeParsed || '-'}
                                />
                            )}
                            <Fab.Container fixed={false} dense>
                                <Fab.NextButton
                                    navigateProps={{
                                        name: 'ReservationEdit',
                                        params: {
                                            reservationId: item.reservation.id,
                                        },
                                    }}
                                    title={'수정'}
                                    color={'secondary'}
                                />
                            </Fab.Container>
                        </SectionCard>
                    )}
                />
            ),
            [],
        )

    const handlePressConfirm = useCallback(() => {
        reservationStore.reservationsToDelete.forEach(r => {
            reservationStore.delete(r.id)
        })
        reservationStore.clearConfirmRequiringList()
        navigation.dispatch(StackActions.pop(2))
        goBack()
    }, [])

    useHeader({
        backgroundColor: 'secondary',
    })

    return (
        <Screen backgroundColor={'secondary'}>
            <Observer
                render={() => (
                    <ContentTitle
                        title={`${reservationStore.confirmRequiringReservation.filter(r => r.isFlaggedToAdd).length}개 예약을 추가할게요`}
                    />
                )}
            />
            <ScrollView>
                <FlatList
                    data={reservationStore.confirmRequiringReservation}
                    renderItem={renderCreationResultListItem}
                    keyExtractor={item => item.reservation.id}
                />
            </ScrollView>
            <Fab.Container>
                <Fab.Button title={'확인'} onPress={handlePressConfirm} />
            </Fab.Container>
        </Screen>
    )
}
