import {LoadingScreen, useLoadingScreen} from '@/screens/LoadingScreen'
import {ApiStatus, useStores, useTripStore} from '@/models'
import {AppStackScreenProps, useNavigate} from '@/navigators'
import {observer} from 'mobx-react-lite'
import {FC, useEffect} from 'react'

export const WelcomeScreen: FC<AppStackScreenProps<'Welcome'>> = observer(
  () => {
    const {createTrip, withApiStatus} = useStores()
    const tripStore = useTripStore()
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      const redirect = async () => {
        if (tripStore != null && tripStore?.isInitialized) {
          navigateWithTrip('Main', {screen: 'Todolist'})
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
