import BottomSheetModal, {
    GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import { useTripStore, useUserStore } from '@/models'
import { TripSummary } from '@/models/stores/TripStore'
import {
    AuthenticatedStackScreenProps,
    goBack,
    navigate,
    useNavigate,
} from '@/navigators'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { useLingui } from '@lingui/react/macro'
import { useFocusEffect } from '@react-navigation/native'
import { Divider, ListItem, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { useLoadingScreen, useRequireConnection } from '../Loading'
import { TripListItem } from './TripListitem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { useResourceQuota } from '@/utils/resourceQuota/useResourceQuota'
import { View } from 'react-native'

export const TripListScreen: FC<AuthenticatedStackScreenProps<'TripList'>> =
    observer(({}) => {
        const userStore = useUserStore()
        const tripStore = useTripStore()
        const {
            createTripWithApiStatus,
            setActiveTripWithApiStatus,
            fetchTripSummaryWithApiStatus,
        } = useActionsWithApiStatus()
        const { navigateWithTrip } = useNavigate()
        const { t } = useLingui()

        const [isActiveTripChanged, setIsActiveTripChanged] = useState(false)

        const maxNumberOfTripHandleBottomSheetRef =
            useRef<BottomSheetModal>(null)

        const handlePressTripListItem = useCallback(
            (item: TripSummary) => {
                setActiveTripWithApiStatus({
                    args: item.id,
                    onSuccess: () => setIsActiveTripChanged(true),
                })
            },
            [setActiveTripWithApiStatus],
        )

        useFocusEffect(
            useCallback(() => {
                if (isActiveTripChanged) {
                    if (tripStore !== null) {
                        if (tripStore.isInitialized)
                            navigateWithTrip('Main', {
                                screen: tripStore.settings.isTripMode
                                    ? 'ReservationList'
                                    : 'Todolist',
                            })
                        else {
                            navigateWithTrip('DestinationSetting')
                        }
                    }
                    setIsActiveTripChanged(false)
                }
            }, [isActiveTripChanged, tripStore]),
        )

        const createTrip = useCallback(async () => {
            await createTripWithApiStatus({
                onSuccess: () => navigateWithTrip('DestinationSetting'),
            })
        }, [])

        const { maxTrips, hasReachedTripNumberLimit } = useResourceQuota()

        const handlePressCreateTrip = useCallback(() => {
            if (hasReachedTripNumberLimit) {
                maxNumberOfTripHandleBottomSheetRef.current?.present()
            } else {
                createTrip()
            }
        }, [maxNumberOfTripHandleBottomSheetRef.current])

        const [isTripSummaryLoaded, setIsTripSummaryLoaded] = useState(false)

        const renderTripListItem: ListRenderItem<TripSummary> = useCallback(
            ({ item }) => (
                <TripListItem
                    item={item}
                    onPress={handlePressTripListItem}
                    renderRightContent={() => <ListItem.Chevron />}
                />
            ),
            [],
        )

        useHeader(
            {
                backgroundColor: 'secondary',
                rightActionTitle: '삭제',
                onRightPress: () => navigate('TripDelete'),
            },
            [],
        )

        useFocusEffect(
            useCallback(() => {
                // fetchTripSummaryWithApiStatus({}).then(() => {
                //     setIsTripSummaryLoaded(true)
                // })
                userStore.fetchTripSummary({}).then(() => {
                    setIsTripSummaryLoaded(true)
                })
            }, []),
        )

        useRequireConnection({})
        useLoadingScreen({ onProblem: () => goBack() })

        const {
            theme: { colors },
        } = useTheme()

        return (
            <Screen backgroundColor={'secondary'}>
                <ContentTitle title={t`내 여행 목록`} />
                {isTripSummaryLoaded && (
                    <>
                        {userStore.activeTripSumamry && (
                            <TripListItem
                                item={userStore.activeTripSumamry}
                                onPress={() => {
                                    if (tripStore.isInitialized)
                                        navigateWithTrip('Main', {
                                            screen: 'TripDashboard',
                                        })
                                    else {
                                        navigateWithTrip('DestinationSetting')
                                    }
                                }}
                            />
                        )}
                        {userStore.otherTripSummaryList.length > 0 && (
                            <>
                                <Divider />
                                <FlatList
                                    data={userStore.otherTripSummaryList}
                                    renderItem={renderTripListItem}
                                    keyExtractor={item => item.id}
                                />
                            </>
                        )}
                    </>
                )}
                <Fab.Container>
                    <Fab.Button
                        title={'새 여행 만들기'}
                        onPress={handlePressCreateTrip}
                    />
                </Fab.Container>
                <BottomSheetModal ref={maxNumberOfTripHandleBottomSheetRef}>
                    <ContentTitle
                        title={'다음 여행을 삭제하고\n새 여행을 만들까요?'}
                        subtitle={`여행은 최대 ${maxTrips}개 까지 만들 수 있어요`}
                    />
                    {/* <ListSubheader title={'가장 오래된 여행'} /> */}
                    <View style={{ paddingVertical: 24 }}>
                        <TripListItem
                            item={userStore.tripSummary[0]}
                            asCard={false}
                            showCreateDate
                        />
                    </View>
                    <Fab.Container fixed={false} dense>
                        <Fab.Button
                            title={'확인'}
                            onPress={() => {
                                userStore.deleteTrip(
                                    userStore.tripSummary[0].id,
                                )
                                createTrip()
                                maxNumberOfTripHandleBottomSheetRef.current?.close()
                            }}
                        />
                        <Fab.Button
                            color={'secondary'}
                            title={'닫기'}
                            onPress={() => {
                                maxNumberOfTripHandleBottomSheetRef.current?.close()
                            }}
                        />
                    </Fab.Container>
                </BottomSheetModal>
            </Screen>
        )
    })
