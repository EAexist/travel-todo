import { ActivityIndicator } from '@/components/ActivityIndicator'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen/Screen'
import { TransText } from '@/components/TransText'
import {
    ApiStatus,
    useApiStatus,
    useApiStatusDispatch,
} from '@/utils/useApiStatus'
import { useHeaderOnFocus } from '@/utils/useHeader'
import { useNetInfo } from '@react-native-community/netinfo'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren, ReactNode, useCallback } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

export const LoadingBoundary: FC<
    PropsWithChildren<{
        variant?: 'simple' | 'article'
        onProblem?: () => void
        pendingIndicatorTitle?: string[]
        // onSuccess?: () => void
        successContent?: ReactNode
    }>
> = observer(
    ({
        pendingIndicatorTitle,
        // onSuccess = goBack,
        onProblem = () => {},
        successContent,
        variant = 'simple',
        children,
    }) => {
        const { apiStatus } = useApiStatus()
        const dispatch = useApiStatusDispatch()

        const { isConnected } = useNetInfo()

        const handleError = useCallback(() => {
            dispatch({ type: 'set_IDLE' })
            onProblem()
        }, [])

        // useEffect(() => {
        //   if (!isConnected) setProp('apiStatus', ApiStatus.NO_CONNECTION)
        // }, [isConnected])

        let title: string | undefined = undefined
        let subtitle: string | undefined = undefined
        let activityIndicator: ReactNode = null
        let fabTitle: string | undefined = undefined
        let onPressFab: (() => void) | undefined = undefined

        switch (apiStatus) {
            case ApiStatus.PENDING:
            case ApiStatus.SUCCESS:
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
            default:
                break
        }

        return apiStatus === ApiStatus.IDLE ? (
            children
        ) : apiStatus === ApiStatus.SUCCESS && successContent ? (
            successContent
        ) : (
            <LoadingScreen
                title={title}
                subtitle={subtitle}
                activityIndicator={activityIndicator}
                fabTitle={fabTitle}
                onPressFab={onPressFab}
                variant={variant}
            />
        )
    },
)

export const LoadingScreen: FC<
    PropsWithChildren<{
        title?: string
        subtitle?: string
        activityIndicator?: ReactNode
        fabTitle?: string
        onPressFab?: () => void
        variant?: 'simple' | 'article'
    }>
> = observer(
    ({ title, subtitle, activityIndicator, fabTitle, onPressFab, variant }) => {
        useHeaderOnFocus({ backButtonShown: false })

        return (
            <Screen>
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
    paddingBottom: 48,
}
