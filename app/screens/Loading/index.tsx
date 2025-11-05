import { ActivityIndicator } from '@/components/ActivityIndicator'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen/Screen'
import { TransText } from '@/components/TransText'
import { AppStackScreenProps, goBack, navigate } from '@/navigators'
import {
    ApiStatus,
    useApiStatus,
    useApiStatusDispatch,
} from '@/utils/useApiStatus'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { useNetInfo } from '@react-native-community/netinfo'
import { StackActions, useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

export const LoadingScreenBase: FC<{
    variant?: 'simple' | 'article'
    onProblem?: () => void
    pendingIndicatorTitle?: string[]
    // onSuccess?: () => void
    successContent?: ReactNode
}> = observer(
    ({
        pendingIndicatorTitle,
        // onSuccess = goBack,
        onProblem = () => {},
        successContent,
        variant = 'simple',
    }) => {
        const { apiStatus } = useApiStatus()
        const dispatch = useApiStatusDispatch()

        const { isConnected } = useNetInfo()

        const handleError = useCallback(() => {
            dispatch({ type: 'set_IDLE' })
            goBack()
            onProblem()
        }, [])

        // useEffect(() => {
        //   if (!isConnected) setProp('apiStatus', ApiStatus.NO_CONNECTION)
        // }, [isConnected])

        useEffect(() => {
            if (apiStatus === ApiStatus.SUCCESS) goBack()
        }, [apiStatus])

        useHeader({ backButtonShown: false })

        let title: string | null = null
        let subtitle: string | null = null
        let activityIndicator: ReactNode = null
        let fabTitle: string | undefined = undefined
        let onPressFab: (() => void) | undefined = undefined

        switch (apiStatus) {
            case ApiStatus.PENDING:
                if (pendingIndicatorTitle) title = pendingIndicatorTitle[0]
                activityIndicator = <ActivityIndicator />
                fabTitle = '돌아가기'
                onPressFab = handleError
                break
            case ApiStatus.NO_CONNECTION:
                title = '연결 상태가 좋지 않아요'
                subtitle = '다시 시도해 주세요.'
                activityIndicator = (
                    <Icon name="wifi-off" type="material" size={36} />
                )
                fabTitle = '확인'
                onPressFab = handleError
                break
            case ApiStatus.ERROR:
                title = '오류가 발생했어요'
                subtitle = '다시 시도해 주세요.'
                activityIndicator = <Icon name="😫" size={36} />
                fabTitle = '확인'
                onPressFab = handleError
                break
            case ApiStatus.SUCCESS:
                break
            default:
                break
        }

        return (
            <Screen>
                {apiStatus === ApiStatus.SUCCESS && successContent ? (
                    successContent
                ) : (
                    <>
                        {variant === 'article' && title && (
                            <ContentTitle title={title} subtitle={subtitle} />
                        )}
                        <View style={$statusViewStyle}>
                            {activityIndicator}
                            {variant === 'simple' && title && (
                                <TransText style={$statusMessageStyle}>
                                    {`${title}${subtitle ? `\n${subtitle}` : ''}`}
                                </TransText>
                            )}
                        </View>
                        <Fab.Container>
                            <Fab.Button title={fabTitle} onPress={onPressFab} />
                        </Fab.Container>
                    </>
                )}
            </Screen>
        )
    },
)

export const LoadingScreen: FC<AppStackScreenProps<'Loading'>> = observer(
    ({ route: { params }, navigation }) => {
        return <LoadingScreenBase {...params} />
    },
)

export const useLoadingScreen = (
    props: AppStackScreenProps<'Loading'>['route']['params'],
    name: string = 'Loading',
) => {
    const { apiStatus } = useApiStatus()

    useEffect(() => {
        console.log(`[useLoadingScreen] apiStatus=${apiStatus}`)
        if (apiStatus === ApiStatus.PENDING) navigate(name, props)
    }, [apiStatus])
}

// export const useLoadingScreen_ = (
//     props: AppStackScreenProps<'Loading'>['route']['params'],
// ) => {
//     const { apiStatus } = useApiStatus()

//     useEffect(() => {
//         console.log(`[useLoadingScreen] apiStatus=${apiStatus}`)
//         if (apiStatus === ApiStatus.PENDING) navigate('Loading', props)
//     }, [apiStatus])
// }

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
              }
            : {},
    )

    return (
        <Screen>
            <View style={$statusViewStyle}>
                <Icon name="wifi-off" type="material" size={36} />
                <TransText style={$statusMessageStyle}>
                    {
                        '네트워크 연결 상태가 좋지 않아요.\n확인 후 다시 시도해 주세요.'
                    }
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
            navigation.dispatch(
                StackActions.replace('RequireConnection', { title }),
            )
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
