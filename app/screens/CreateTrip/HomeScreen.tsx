import BottomSheetModal from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import { ListItemBase } from '@/components/ListItem'
import {
    NavigateMenuBottomSheet,
    NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'
import { useTripStore } from '@/models'
import {
    AuthenticatedStackScreenProps,
    navigationRef,
    useNavigate,
} from '@/navigators'
import { useLoadingScreen } from '@/screens/Loading'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { useFocusEffect } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { TripListScreen } from '../TripList/TripListScreen'

export const HomeScreen: FC<AuthenticatedStackScreenProps<'Home'>> = observer(
    props => {
        const tripStore = useTripStore()
        const { navigateWithTrip } = useNavigate()
        const { logoutWithApiStatus } = useActionsWithApiStatus()

        const [isInitialRedirectComplete, setIsInitialRedirectComplete] =
            useState(false)

        useFocusEffect(
            useCallback(() => {
                console.log(
                    !isInitialRedirectComplete,
                    navigationRef.isReady(),
                    tripStore != null,
                )
                if (
                    !isInitialRedirectComplete &&
                    navigationRef.isReady() &&
                    tripStore != null
                ) {
                    if (tripStore.isInitialized)
                        navigateWithTrip('Main', {
                            screen: tripStore.isTripMode
                                ? 'ReservationList'
                                : 'Todolist',
                        })
                    else {
                        navigateWithTrip('DestinationSetting')
                    }
                    setIsInitialRedirectComplete(true)
                }
            }, [
                navigationRef.isReady(),
                tripStore?.isInitialized,
                isInitialRedirectComplete,
            ]),
        )

        useLoadingScreen({})

        /* Menu */
        const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

        const handleSettingsButtonPress = useCallback(() => {
            settingsMenuBottomSheetRef.current?.present()
        }, [settingsMenuBottomSheetRef])

        const settingsOption: NavigateMenuData[] = [
            {
                title: '여행 삭제',
                path: 'TripDelete',
                icon: { name: 'delete', type: 'material' },
            },
        ]

        useHeader(
            {
                backButtonShown: false,
                backgroundColor: 'secondary',
                rightComponent: (
                    <TouchableOpacity
                        onPress={handleSettingsButtonPress}
                        style={$headerRightButtonStyle}>
                        <HeaderIcon name="gear" type="octicon" />
                    </TouchableOpacity>
                ),
            },
            [],
        )

        return (
            <>
                <TripListScreen {...props} />
                <NavigateMenuBottomSheet
                    data={settingsOption}
                    ref={settingsMenuBottomSheetRef}>
                    <ListItemBase
                        avatarProps={{
                            icon: { name: 'logout', type: 'material' },
                        }}
                        title="로그아웃"
                        onPress={() => logoutWithApiStatus()}
                    />
                </NavigateMenuBottomSheet>
            </>
        )
    },
)
