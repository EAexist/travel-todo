import {FC, PropsWithChildren} from 'react'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {observer} from 'mobx-react-lite'
import {useHeader} from '@/utils/useHeader'
import {ActivityIndicator} from 'react-native'
import {Text} from '@rneui/themed'
import {TransText} from './TransText'

export const LoadingScreen: FC<PropsWithChildren<{title: string}>> = observer(
  ({children, title}) => {
    const {
      tripStore: {isPending},
    } = useStores()

    useHeader({headerShown: !isPending}, [isPending])

    return isPending ? (
      <Screen>
        <ActivityIndicator />
        <TransText>{title}</TransText>
      </Screen>
    ) : (
      children
    )
  },
)
