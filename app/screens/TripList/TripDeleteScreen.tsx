import BottomSheetModal from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import { useUserStore } from '@/models'
import { TripSummary } from '@/models/stores/TripStore'
import { AuthenticatedStackScreenProps, goBack } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { useLingui } from '@lingui/react/macro'
import { Divider, ListItem, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'
import { TripListItem, TripListItemProps } from './TripListitem'
import ListSubheader from '@/components/ListItem/ListSubheader'

const TripDeleteListItem: FC<Omit<TripListItemProps, 'renderRightContent'>> =
    observer(({ item, onPress, ...props }) => {
        const {
            theme: { colors },
        } = useTheme()

        return (
            <TripListItem
                item={item}
                renderRightContent={() => (
                    <TouchableOpacity
                        onPress={onPress ? () => onPress(item) : undefined}>
                        <ListItem.Chevron
                            name="do-not-disturb-on"
                            color={colors.error}
                        />
                    </TouchableOpacity>
                )}
                {...props}
            />
        )
    })

export const TripDeleteScreen: FC<AuthenticatedStackScreenProps<'TripDelete'>> =
    observer(({}) => {
        const userStore = useUserStore()
        const [itemToDelete, setItemToDelete] = useState<TripSummary | null>(
            null,
        )

        const confirmDeleteBottomSheetRef = useRef<BottomSheetModal>(null)
        const { t } = useLingui()

        const handleDelete = useCallback(
            (item: TripSummary) => {
                setItemToDelete(item)
                confirmDeleteBottomSheetRef.current?.present()
            },
            [confirmDeleteBottomSheetRef.current],
        )

        const renderTripDeleteItem: ListRenderItem<TripSummary> = useCallback(
            ({ item }) => (
                <TripDeleteListItem item={item} onPress={handleDelete} />
            ),
            [],
        )

        useEffect(() => {
            console.log(userStore.tripSummary)
        }, [userStore])

        useHeader({
            backgroundColor: 'secondary',
            rightActionTitle: '완료',
            onRightPress: () => goBack(),
        })

        return (
            <Screen backgroundColor={'secondary'}>
                <ContentTitle title={t`여행 삭제하기`} />
                <>
                    <ListSubheader
                        title={'사용 중인 여행은 삭제할 수 없어요.'}
                        dense
                    />
                    <TripListItem
                        item={userStore.activeTripSumamry}
                        // subtitle={'사용 중인 여행은 삭제할 수 없어요.'}
                        disabled={true}
                    />
                    {userStore.otherTripSummaryList.length > 0 && (
                        <>
                            <Divider />
                            <FlatList
                                data={userStore.otherTripSummaryList}
                                renderItem={renderTripDeleteItem}
                                keyExtractor={item => item.id}
                            />
                        </>
                    )}
                </>
                <BottomSheetModal ref={confirmDeleteBottomSheetRef}>
                    <ContentTitle title={'여행을 삭제할까요?'} />
                    {itemToDelete && (
                        <>
                            <TripListItem item={itemToDelete} />
                            <Fab.Container fixed={false} dense>
                                <Fab.Button
                                    title={'삭제하기'}
                                    onPress={async () => {
                                        await userStore.deleteTrip(
                                            itemToDelete.id,
                                        )
                                        confirmDeleteBottomSheetRef.current?.close()
                                    }}
                                />
                                <Fab.Button
                                    color={'secondary'}
                                    title={'닫기'}
                                    onPress={() => {
                                        confirmDeleteBottomSheetRef.current?.close()
                                    }}
                                />
                            </Fab.Container>
                        </>
                    )}
                </BottomSheetModal>
            </Screen>
        )
    })
