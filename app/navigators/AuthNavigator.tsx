import { LoginScreen } from '@/screens/Login/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { AuthStackParamList } from './navigationTypes'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = observer(function AuthenicatedStack() {
    const {
        theme: { colors },
    } = useTheme()

    return (
        <AuthStack.Navigator
            // screenOptions={{
            //     header: () => <Header leftComponent={<BackButton />} />,
            //     contentStyle: {
            //         backgroundColor: colors.background,
            //     },
            // }}
            initialRouteName={'Login'}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    )
})
