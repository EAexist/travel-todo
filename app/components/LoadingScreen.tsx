import {ActivityIndicator} from '@/components/ActivityIndicator'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useHeader} from '@/utils/useHeader'
import {observer} from 'mobx-react-lite'
import {FC, PropsWithChildren} from 'react'
import {View} from 'react-native'

export const LoadingScreen: FC<PropsWithChildren<{texts?: string[]}>> =
  observer(({children, texts = []}) => {
    // const {
    //   tripStore: {isPending},
    // } = useStores()

    const isPending = true

    useHeader({headerShown: !isPending}, [isPending])

    return isPending ? (
      <Screen>
        <View
          style={{
            flex: 1,
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator />
          <TransText numberOfLines={1}>
            {texts.length > 0 && texts[0]}
          </TransText>
        </View>
      </Screen>
    ) : (
      children
    )
  })
