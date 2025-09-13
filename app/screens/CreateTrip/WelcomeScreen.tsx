import {LoadingScreen, useLoadingScreen} from '@/screens/Loading'
import {ApiStatus, useStores, useTripStore} from '@/models'
import {AppStackScreenProps, navigationRef, useNavigate} from '@/navigators'
import {observer} from 'mobx-react-lite'
import {FC, useEffect, useState} from 'react'
import {TripListScreen} from '../TripListScreen'
import {HeaderTitle, useHeader} from '@/utils/useHeader'
import {useTheme} from '@rneui/themed'

export const WelcomeScreen: FC<AppStackScreenProps<'TripList'>> = observer(
  props => {
    const {withApiStatus, createTrip} = useStores()
    const tripStore = useTripStore()
    const {navigateWithTrip} = useNavigate()
    const [isTripStoreInitialized, setIsTripStoreInitialized] = useState(false)

    useEffect(() => {
      const redirect = async () => {
        if (tripStore != null && tripStore?.isInitialized) {
          setIsTripStoreInitialized(true)
        } else {
          if (tripStore != null) {
            await withApiStatus(tripStore.patch)
          } else {
            await withApiStatus(createTrip)
          }
        }
      }
      redirect()
    }, [])

    useEffect(() => {
      if (isTripStoreInitialized && navigationRef.isReady())
        navigateWithTrip('Main', {screen: 'Todolist'})
    }, [isTripStoreInitialized, navigationRef.isReady()])

    useLoadingScreen({onSuccess: () => navigateWithTrip('DestinationSetting')})

    const {
      theme: {colors},
    } = useTheme()

    useHeader({
      backButtonShown: false,
      leftComponent: <HeaderTitle>{'내 여행 목록'}</HeaderTitle>,
      containerStyle: {backgroundColor: colors.secondaryBg},
    })

    return <TripListScreen {...props} />
  },
)
