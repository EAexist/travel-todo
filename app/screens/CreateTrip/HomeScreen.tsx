import {
    NavigateListItemProp,
    NavigateMenuBottomSheet,
} from '@/components/BottomSheet/NavigateMenuBottomSheet'
import BottomSheetModal from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import { ListItemBase } from '@/components/ListItem/ListItem'
import { useStores, useTripStore } from '@/models'
import { AuthenticatedStackScreenProps, useNavigate } from '@/navigators'
import { LoadingBoundary } from '@/screens/Loading/LoadingBoundary'
import { TripListScreenBase } from '@/screens/TripList/TripListScreenBase'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'

export const HomeScreen: FC<AuthenticatedStackScreenProps<'Home'>> = observer(
    props => {
        const tripStore = useTripStore()
        const { navigateWithTrip } = useNavigate()
        const { logoutWithApiStatus } = useActionsWithApiStatus()

        const [isInitialRedirectComplete, setIsInitialRedirectComplete] =
            useState(false)

        const { isAuthenticated } = useStores()

        // useFocusEffect(
        //     useCallback(() => {
        //         console.log(
        //             !isInitialRedirectComplete,
        //             navigationRef.isReady(),
        //             tripStore != null,
        //         )
        //         if (
        //             !isInitialRedirectComplete &&
        //             navigationRef.isReady() &&
        //             tripStore != null
        //         ) {
        //             if (tripStore.isInitialized)
        //                 navigateWithTrip('Main', {
        //                     screen: tripStore.settings.isTripMode
        //                         ? 'ReservationList'
        //                         : 'Todolist',
        //                 })
        //             else if (isAuthenticated) {
        //                 navigateWithTrip('DestinationSetting')
        //                 setIsInitialRedirectComplete(true)
        //             }
        //         }
        //     }, [
        //         navigationRef.isReady(),
        //         tripStore?.isInitialized,
        //         isInitialRedirectComplete,
        //         isAuthenticated,
        //     ]),
        // )

        /* Menu */
        const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

        const handleSettingsButtonPress = useCallback(() => {
            settingsMenuBottomSheetRef.current?.present()
        }, [settingsMenuBottomSheetRef])

        const settingsOption: NavigateListItemProp[] = [
            {
                title: '여행 삭제',
                path: 'TripDelete',
                icon: { name: 'delete', type: 'material' },
            },
        ]

        useHeader({
            backButtonShown: false,
            backgroundColor: 'secondary',
            rightComponent: (
                <TouchableOpacity
                    onPress={handleSettingsButtonPress}
                    style={$headerRightButtonStyle}>
                    <HeaderIcon name="gear" type="octicon" />
                </TouchableOpacity>
            ),
            centerComponent: <HeaderCenterTitle title={'여행 목록'} />,
        })

        return (
            <LoadingBoundary>
                <TripListScreenBase />
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
            </LoadingBoundary>
        )
    },
)
