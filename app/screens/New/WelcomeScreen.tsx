import {LoadingScreen, useLoadingScreen} from '@/screens/LoadingScreen'
import {ApiStatus, useStores} from '@/models'
import {AppStackScreenProps, useNavigate} from '@/navigators'
import {observer} from 'mobx-react-lite'
import {FC, useEffect} from 'react'

export const WelcomeScreen: FC<AppStackScreenProps<'Welcome'>> = observer(
  () => {
    const rootStore = useStores()
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      const redirect = async () => {
        if (rootStore.tripStore != null && rootStore.tripStore?.isInitialized) {
          navigateWithTrip('Main', {screen: 'Todolist'})
        } else {
          if (rootStore.tripStore != null) {
            await rootStore.tripStore.patch()
          } else {
            await rootStore.createTrip()
          }
        }
      }
      redirect()
    }, [])

    useEffect(() => {
      if (rootStore.apiStatus === ApiStatus.SUCCESS) {
        rootStore.setProp('apiStatus', ApiStatus.IDLE)
        navigateWithTrip('DestinationSetting')
      }
    }, [rootStore.apiStatus])

    useLoadingScreen()

    return false
  },
)
