import { useStores, useTripStore } from '@/models'
import { AppStackScreenProps, navigationRef, useNavigate } from '@/navigators'
import { useLoadingScreen } from '@/screens/Loading'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { HeaderTitle, useHeader } from '@/utils/useHeader'
import { useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { TripListScreen } from '../TripListScreen'

export const WelcomeScreen: FC<AppStackScreenProps<'TripList'>> = observer(
  props => {
    const tripStore = useTripStore()
    const { createTripWithApiStatus } = useActionsWithApiStatus()
    const { navigateWithTrip } = useNavigate()
    const [isTripStoreInitialized, setIsTripStoreInitialized] = useState(false)

    useEffect(() => {
      const redirect = async () => {
        if (tripStore != null && tripStore?.isInitialized) {
          setIsTripStoreInitialized(true)
        } else {
          if (tripStore != null) {
          } else {
            await createTripWithApiStatus({
              onSuccess: () => navigateWithTrip('DestinationSetting'),
            })
          }
        }
      }
      redirect()
    }, [])

    useEffect(() => {
      if (isTripStoreInitialized && navigationRef.isReady())
        navigateWithTrip('Main', {
          screen: tripStore.isTripMode ? 'ReservationList' : 'Todolist',
        })
    }, [isTripStoreInitialized, navigationRef.isReady()])

    useLoadingScreen({})

    const {
      theme: { colors },
    } = useTheme()

    useHeader({
      backButtonShown: false,
      leftComponent: <HeaderTitle>{'내 여행 목록'}</HeaderTitle>,
      backgroundColor: 'secondary',
    })

    return <TripListScreen {...props} />
  },
)
