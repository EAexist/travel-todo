import { BackButton } from '@/components/Header'
import { Login as LoginScreen } from '@/screens/Login'
import { AdminScreen } from '@/screens/Login/AdminScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Header, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { AuthStackParamList } from './navigationTypes'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = observer(function AuthenicatedStack() {
    const {
        theme: { colors },
    } = useTheme()

    // const navigation = useNavigation()
    // const rootStore = useStores()

    // useEffect(() => {
    //     if (rootStore.isAuthenticated) {
    //         navigation.dispatch(StackActions.replace('App'))
    //     }
    // }, [rootStore.isAuthenticated]);

    return (
        <AuthStack.Navigator
            screenOptions={{
                header: () => <Header leftComponent={<BackButton />} />,
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
            initialRouteName={'Login'}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Admin" component={AdminScreen} />
        </AuthStack.Navigator>
    )
})
