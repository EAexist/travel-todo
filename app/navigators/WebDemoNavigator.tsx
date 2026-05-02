import FakeReservationSourceScreen from '@/screens/WebDemo/FakeReservationSourceScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Header, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { WebDemoStackParamList } from './WebDemoStackTypes'

const WebDemoStack = createNativeStackNavigator<WebDemoStackParamList>()

export const WebDemoNavigator = observer(function WebDemoenicatedStack() {
    const {
        theme: { colors },
    } = useTheme()

    return (
        <WebDemoStack.Navigator
            screenOptions={{
                header: () => <Header />,
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
            initialRouteName={'FakeReservationSource'}>
            <WebDemoStack.Screen name="FakeReservationSource" component={FakeReservationSourceScreen} />
        </WebDemoStack.Navigator>
    )
})
