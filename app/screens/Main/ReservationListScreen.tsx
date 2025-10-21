import { FC, useCallback, useRef, useState } from 'react'
import { DefaultSectionT, TouchableOpacity, View } from 'react-native'
//
import {
    NavigateListItemProp,
    NavigateMenuBottomSheet,
} from '@/components/BottomSheet/NavigateMenuBottomSheet'
import BottomSheetModal from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import { ListItemBase } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import { useReservationStore, useTripStore } from '@/models'
import { Reservation } from '@/models/Reservation/Reservation'
import { MainTabScreenProps, useNavigate } from '@/navigators'
import { useMainScreenHeader } from '@/utils/useHeader'
import { FAB, ListItem, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { ReservationList } from '../../components/Reservation/ReservationList'

const ReservationListItem: FC<{ reservation: Reservation }> = observer(
    ({ reservation }) => {
        const { navigateWithTrip } = useNavigate()

        const [displayComplete, setDisplayComplete] = useState(
            reservation.isCompleted,
        )

        const {
            theme: { colors },
        } = useTheme()

        const handlePress = useCallback(async () => {
            navigateWithTrip('Reservation', {
                reservationId: reservation.id,
            })
        }, [])
        const handlePressComplete = useCallback(() => {
            setDisplayComplete(prev => !prev)
            reservation.toggleIsCompletedDelayed()
        }, [])

        return (
            <ListItemBase
                useDisabledStyle={reservation.isCompleted}
                avatarProps={{ icon: reservation.icon }}
                title={reservation.title}
                subtitle={reservation.subtitle || undefined}
                onPress={handlePress}
                rightContent={
                    <ListItem.CheckBox
                        onPress={handlePressComplete}
                        checked={displayComplete}
                        checkedIcon="radio-button-checked"
                        uncheckedIcon="radio-button-unchecked"
                        uncheckedColor={colors.grey2}
                        checkedColor={
                            reservation.isCompleted
                                ? colors.grey2
                                : colors.primary
                        }
                    />
                }
            />
        )
    },
)
export const ReservationListScreen: FC<MainTabScreenProps<'ReservationList'>> =
    observer(() => {
        const tripStore = useTripStore()
        const { navigateWithTrip } = useNavigate()
        const reservationStore = useReservationStore()

        const handleAddReservation = useCallback(() => {
            navigateWithTrip('ReservationCreate')
        }, [])

        const renderItem = (reservation: Reservation) => (
            <ReservationListItem reservation={reservation} />
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

        /* Menu */
        const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

        const handleSettingsButtonPress = useCallback(() => {
            settingsMenuBottomSheetRef.current?.present()
        }, [settingsMenuBottomSheetRef])

        const settingsOption: NavigateListItemProp[] = [
            {
                title: '예약 추가',
                path: 'ReservationCreate',
                icon: { name: 'add', type: 'material' },
                primary: true,
            },
            // {
            //     title: '예약 편집',
            //     path: 'ReservationEditList',
            //     icon: { name: 'edit', type: 'material' },
            // },
            {
                title: '예약 삭제',
                path: 'ReservationDelete',
                icon: { name: 'delete', type: 'material' },
            },
        ]

        const {
            theme: { colors },
        } = useTheme()

        useMainScreenHeader({
            title: '예약',
            backgroundColor: 'secondary',
            rightComponent: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={handleSettingsButtonPress}
                        style={$headerRightButtonStyle}>
                        <HeaderIcon name="gear" type="octicon" />
                    </TouchableOpacity>
                </View>
            ),
        })

        const [showHelp, setShowHelp] = useState(false)

        const handlePressHelpTravelMode = useCallback(() => {
            setShowHelp(true)
        }, [])

        return (
            <Screen backgroundColor={'secondary'}>
                <ReservationList renderItem={renderItem} />
                <FAB
                    onPress={handleAddReservation}
                    icon={{ name: 'add', color: 'white' }}
                    placement="right"
                />
                <NavigateMenuBottomSheet
                    data={settingsOption}
                    ref={settingsMenuBottomSheetRef}
                    onDismiss={() =>
                        setShowHelp(false)
                    }></NavigateMenuBottomSheet>
            </Screen>
        )
    })
