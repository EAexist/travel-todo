import {LoadingScreen, useLoadingScreen} from '@/screens/LoadingScreen'
import {ApiStatus, useStores, useTripStore} from '@/models'
import {AppStackScreenProps, navigationRef, useNavigate} from '@/navigators'
import {observer} from 'mobx-react-lite'
import {FC, useEffect, useState} from 'react'

export const WelcomeScreen: FC<AppStackScreenProps<'Welcome'>> = observer(
  () => {
    const {createTrip, withApiStatus} = useStores()
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

    // useEffect(() => {
    //   if (rootStore.apiStatus === ApiStatus.SUCCESS) {
    //     rootStore.setProp('apiStatus', ApiStatus.IDLE)
    //     navigateWithTrip('DestinationSetting')
    //   }
    // }, [rootStore.apiStatus])

    useLoadingScreen({onSuccess: () => navigateWithTrip('DestinationSetting')})

    return false
  },
)
