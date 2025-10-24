import { FC, ReactNode, useCallback } from 'react'
import {
    DefaultSectionT,
    ScrollView,
    SectionList,
    SectionListRenderItem,
    View,
} from 'react-native'
//
import { Label } from '@/components/Label'
import ListSubheader from '@/components/ListItem/ListSubheader'
import SwitchTab, { SwitchTabItem } from '@/components/SwitchTab'
import { useTripStore } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import { ListItem, Text, useTheme } from '@rneui/themed'
import { observer, Observer } from 'mobx-react-lite'

interface ReservationListProps {
    renderItem: (reservation: Reservation) => ReactNode
}
export const ReservationList: FC<ReservationListProps> = observer(
    ({ renderItem }) => {
        const tripStore = useTripStore()

        const renderItem_: SectionListRenderItem<
            //   Partial<ReservationSnapshot>,
            Reservation,
            DefaultSectionT
        > = ({ item }) => (
            <Observer
                render={() => (
                    <View
                        style={{
                            backgroundColor: colors.white,
                            marginHorizontal: 15,
                        }}>
                        {renderItem(item)}
                    </View>
                )}
            />
        )

        const renderSectionHeader = useCallback(
            ({ section: { title } }: { section: DefaultSectionT }) => (
                <View style={{}}>
                    <ListSubheader title={title} size="large" />
                    <View
                        style={{
                            height: 16,
                            backgroundColor: colors.white,
                            marginHorizontal: 15,
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                        }}
                    />
                </View>
            ),
            [],
        )

        const renderSectionFooter = useCallback(
            ({ section: { title } }: { section: DefaultSectionT }) => (
                <View
                    style={{
                        height: 16,
                        backgroundColor: colors.white,
                        marginHorizontal: 15,
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                    }}
                />
            ),
            [],
        )
        const {
            theme: { colors },
        } = useTheme()

        return (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    <SwitchTab
                        variant="default"
                        value={
                            tripStore.settings.doSortReservationsByCategory
                                ? 1
                                : 0
                        }
                        onChange={e =>
                            tripStore.setDoSortReservationsByCategory(
                                e === 0 ? false : true,
                            )
                        }>
                        <SwitchTabItem title="날짜순" variant="default" />
                        <SwitchTabItem title="유형별" variant="default" />
                    </SwitchTab>
                </View>
                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                        paddingVertical: 16,
                    }}>
                    <Label
                        title="사용한 예약 숨기기"
                        style={{
                            fontSize: 13,
                        }}
                        dense
                        rightContent={
                            <ListItem.CheckBox
                                checked={
                                    tripStore.settings
                                        .doHideCompletedReservation
                                }
                                onPress={
                                    tripStore.toggleDoHideCompletedReservation
                                }
                                containerStyle={{ width: 'auto', marginTop: 1 }}
                                checkedColor={colors.contrastText.secondary}
                                size={20}
                            />
                        }
                    />
                </View>
                <ScrollView>
                    {tripStore.reservationSections ? (
                        <SectionList
                            sections={tripStore.reservationSections}
                            keyExtractor={item => item.id}
                            renderItem={renderItem_}
                            renderSectionHeader={renderSectionHeader}
                            renderSectionFooter={renderSectionFooter}
                        />
                    ) : (
                        <Text style={{ padding: 24, textAlign: 'center' }}>
                            {`예약 내역을 추가하고,\n여행 중 필요할 때 간편하게 꺼내보세요.`}
                        </Text>
                    )}
                </ScrollView>
            </View>
        )
    },
)
