import { ActivityIndicator } from '@/components/ActivityIndicator'
import * as Fab from '@/components/Fab'
import { Screen } from '@/components/Screen'
import { TransText } from '@/components/TransText'
import { AppStackScreenProps, goBack, navigate } from '@/navigators'
import {
  ApiStatus,
  useApiStatus,
  useApiStatusDispatch,
} from '@/utils/useApiStatus'
import {
  $headerCenterTitleContainerStyle,
  HeaderCenterTitle,
  useHeader,
} from '@/utils/useHeader'
import { useNetInfo } from '@react-native-community/netinfo'
import { StackActions, useNavigation } from '@react-navigation/native'
import { Icon, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

export const LoadingScreen: FC<AppStackScreenProps<'Loading'>> = observer(
  ({ route: { params } }) => {
    const { apiStatus } = useApiStatus()
    const dispatch = useApiStatusDispatch()

    const { isConnected } = useNetInfo()

    const texts = params?.texts || undefined
    const onProblem = params?.onProblem || undefined

    const handleNoConnection = useCallback(() => {
      dispatch({ type: 'set_IDLE' })
      goBack()
      if (onProblem) onProblem()
    }, [])

    // useEffect(() => {
    //   if (!isConnected) setProp('apiStatus', ApiStatus.NO_CONNECTION)
    // }, [isConnected])

    useEffect(() => {
      if (apiStatus === ApiStatus.SUCCESS) goBack()
    }, [apiStatus])

    useHeader({ backButtonShown: false })

    return (
      <Screen>
        {apiStatus === ApiStatus.PENDING ? (
          <>
            <View style={$statusViewStyle}>
              <ActivityIndicator />
              {texts && (
                <TransText numberOfLines={1} style={$statusMessageStyle}>
                  {texts.length > 0 && texts[0]}
                </TransText>
              )}
            </View>
            <Fab.Container>
              <Fab.Button title={'돌아가기'} onPress={handleNoConnection} />
            </Fab.Container>
          </>
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
              <Text style={{ fontFamily: 'Tossface', fontSize: 36 }}>😓</Text>
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

export const useLoadingScreen = (props: { onProblem?: () => void }) => {
  const { apiStatus } = useApiStatus()

  useEffect(() => {
    console.log(`[useLoadingScreen] apiStatus=${apiStatus}`)
    if (apiStatus === ApiStatus.PENDING) navigate('Loading', props)
  }, [apiStatus])
}

export const RequireConnectionScreen: FC<
  AppStackScreenProps<'RequireConnection'>
> = observer(({ route: { params } }) => {
  const handlePressFab = useCallback(() => {
    goBack()
  }, [])

  useHeader(
    params.title
      ? {
          centerComponent: <HeaderCenterTitle title={params.title} />,
          centerContainerStyle: $headerCenterTitleContainerStyle,
        }
      : {},
  )

  return (
    <Screen>
      <View style={$statusViewStyle}>
        <Icon name="wifi-off" size={36} />
        <TransText style={$statusMessageStyle}>
          네트워크 연결 상태가 좋지 않아요.
          <br />
          확인 후 다시 시도해 주세요.
        </TransText>
      </View>
      <Fab.Container>
        <Fab.Button title={'확인'} onPress={handlePressFab} />
      </Fab.Container>
    </Screen>
  )
})

export const useRequireConnection = ({ title }: { title?: string }) => {
  //   const { isConnected } = useNetInfo()
  const isConnected = true
  const navigation = useNavigation()
  const [showScreen, setShowScreen] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      navigation.dispatch(StackActions.replace('RequireConnection', { title }))
    } else {
      setShowScreen(true)
    }
  }, [isConnected])

  return showScreen
}

const $statusMessageStyle: TextStyle = {
  textAlign: 'center',
}

const $statusViewStyle: ViewStyle = {
  flex: 1,
  gap: 16,
  alignItems: 'center',
  justifyContent: 'center',
}
