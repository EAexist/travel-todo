import { FC, useEffect } from 'react'
//
import { useStores } from '@/models'
import { AppStackScreenProps } from '@/navigators'
import { StackActions, useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'

export const NotFoundScreen: FC<AppStackScreenProps<'NotFound'>> = observer(({ }) => {

    const navigation = useNavigation()
    const rootStore = useStores()

    useEffect(() => {
        navigation.dispatch(StackActions.replace(rootStore.isAuthenticated ? 'App' : 'Auth'))
    }, [rootStore.isAuthenticated]);

    return null;
})
