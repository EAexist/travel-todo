import {ActivityIndicator} from '@/components/ActivityIndicator'
import * as Fab from '@/components/Fab'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {ApiStatus, useStores} from '@/models'
import {AppStackScreenProps, goBack, navigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useNetInfo} from '@react-native-community/netinfo'
import {Icon, Text} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useEffect} from 'react'
import {TextStyle, View, ViewProps, ViewStyle} from 'react-native'

export const LoadingScreen: FC<AppStackScreenProps<'Loading'>> = observer(
  ({route: {params}}) => {
    const {apiStatus, setProp, setApiStatusIdle} = useStores()

    const {isConnected} = useNetInfo()

    const texts = params?.texts || undefined

    const handleNoConnection = useCallback(() => {
      setApiStatusIdle()
      goBack()
    }, [])

    useEffect(() => {
      if (apiStatus === ApiStatus.SUCCESS) {
        goBack()
      }
    }, [apiStatus])

    useEffect(() => {
      if (!isConnected) setProp('apiStatus', ApiStatus.NO_CONNECTION)
    }, [isConnected])

    useHeader({backButtonShown: false})

    return (
      <Screen>
        {apiStatus === ApiStatus.PENDING ? (
          <View style={$statusViewStyle}>
            <ActivityIndicator />
            {texts && (
              <TransText numberOfLines={1} style={$statusMessageStyle}>
                {texts.length > 0 && texts[0]}
              </TransText>
            )}
            <Fab.Container>
              <Fab.Button title={'돌아가기'} onPress={handleNoConnection} />
            </Fab.Container>
          </View>
        ) : apiStatus === ApiStatus.NO_CONNECTION ? (
          <>
            <View style={$statusViewStyle}>
              <Icon name="wifi-off" size={36} />
              <TransText style={$statusMessageStyle}>
                연결 상태가 좋지 않아요.
                <br />
                다시 시도해 주세요.
              </TransText>
            </View>
            <Fab.Container>
              <Fab.Button title={'확인'} onPress={handleNoConnection} />
            </Fab.Container>
          </>
        ) : apiStatus === ApiStatus.ERROR ? (
          <>
            <View style={$statusViewStyle}>
              <Text>😓</Text>
              <TransText style={$statusMessageStyle}>
                오류가 발생했어요.
                <br />
                다시 시도해 주세요.
              </TransText>
            </View>
            <Fab.Container>
              <Fab.Button title={'확인'} onPress={handleNoConnection} />
            </Fab.Container>
          </>
        ) : (
          <></>
        )}
      </Screen>
    )
  },
)

const $statusMessageStyle: TextStyle = {
  textAlign: 'center',
}

const $statusViewStyle: ViewStyle = {
  flex: 1,
  gap: 16,
  alignItems: 'center',
  justifyContent: 'center',
}

export const useLoadingScreen = () => {
  const {apiStatus} = useStores()
  useEffect(() => {
    switch (apiStatus) {
      case ApiStatus.PENDING:
        navigate('Loading')
    }
  }, [apiStatus])
}
