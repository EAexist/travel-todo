import { FC, useEffect } from 'react'
//
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthStackScreenProps } from '@/navigators'
import { observer } from 'mobx-react-lite'

export const LoginScreen: FC<AuthStackScreenProps<'Login'>> = observer(({}) => {
    const rootStore = useStores()

    useEffect(() => {
        rootStore.webBrowserLogin()
    }, [])

    return <Screen>HELLO</Screen>
})
