import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import { Screen } from '@/components/Screen/Screen'
import { TransText } from '@/components/TransText'
import { goBack } from '@/navigators'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { useNetInfo } from '@react-native-community/netinfo'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren, useCallback } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

export const NetworkConnectionRequiringBoundary: FC<
    PropsWithChildren<{ title?: string }>
> = observer(({ title, children }) => {
    const handlePressFab = useCallback(() => {
        goBack()
    }, [])

    useHeader(
        title
            ? {
                  centerComponent: <HeaderCenterTitle title={title} />,
              }
            : {},
    )

    const { isConnected } = useNetInfo()

    return isConnected ? (
        children
    ) : (
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

const $statusMessageStyle: TextStyle = {
    textAlign: 'center',
}

const $statusViewStyle: ViewStyle = {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
}
