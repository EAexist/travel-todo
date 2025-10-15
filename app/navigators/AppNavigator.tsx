/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { GestureHandlerRootViewWrapper } from '@/components/BottomSheetModal'
import { FabProvider } from '@/components/Fab'
import theme from '@/rneui/theme'
import * as Screens from '@/screens'
import { ApiStatusProvider } from '@/utils/useApiStatus'
import { useThemeProvider } from '@/utils/useAppTheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ThemeProvider, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Platform, View, ViewStyle } from 'react-native'
import Config from '../config'
import { useStores } from '../models'
import { AuthenticatedNavigator } from './AuthenticatedNavigator'
import { AuthNavigator } from './AuthNavigator'
import { AppStackParamList, NavigationProps } from './navigationTypes'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const AppStack = createNativeStackNavigator<AppStackParamList>()

const AppStackNavigator = observer(function AppStackNavigator() {
    const {
        theme: { colors },
    } = useTheme()
    const { isAuthenticated } = useStores()

    useEffect(() => {
        console.log('[AppStackNavigator] isAuthenticated:', isAuthenticated)
    }, [isAuthenticated])

    return (
        <AppStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
            initialRouteName={isAuthenticated ? 'App' : 'Auth'}>
            <AppStack.Screen name="Loading" component={Screens.Loading} />
            <AppStack.Screen
                name="RequireConnection"
                component={Screens.RequireConnection}
            />
            {isAuthenticated ? (
                <AppStack.Screen
                    name="App"
                    component={AuthenticatedNavigator}
                />
            ) : (
                <AppStack.Screen name="Auth" component={AuthNavigator} />
            )}
        </AppStack.Navigator>
    )
})
export const AppNavigator = observer(function AppNavigator(
    props: NavigationProps,
) {
    const {
        themeScheme,
        navigationTheme,
        setThemeContextOverride,
        ThemeProvider: AppThemeProvider,
    } = useThemeProvider()

    useBackButtonHandler(routeName => exitRoutes.includes(routeName))

    return (
        <AppThemeProvider value={{ themeScheme, setThemeContextOverride }}>
            <ThemeProvider theme={theme}>
                <View style={$outerContainerStyle}>
                    <View style={$innerContainerStyle}>
                        <GestureHandlerRootViewWrapper>
                            <BottomSheetModalProvider>
                                <NavigationContainer
                                    ref={navigationRef}
                                    theme={{
                                        ...navigationTheme,
                                        colors: {
                                            ...navigationTheme.colors,
                                            background: 'white',
                                        },
                                    }}
                                    {...props}>
                                    <ApiStatusProvider>
                                        <FabProvider>
                                            <Screens.ErrorBoundary
                                                catchErrors={
                                                    Config.catchErrors
                                                }>
                                                <AppStackNavigator />
                                            </Screens.ErrorBoundary>
                                        </FabProvider>
                                    </ApiStatusProvider>
                                </NavigationContainer>
                            </BottomSheetModalProvider>
                        </GestureHandlerRootViewWrapper>
                    </View>
                </View>
            </ThemeProvider>
        </AppThemeProvider>
    )
})

const $outerContainerStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? {} : {}),
}
const $innerContainerStyle: ViewStyle = {
    ...(Platform.OS === 'web'
        ? {
              // width: 480,
              width: '100%',
              // maxWidth: 480,
              flex: 1,
              // backgroundColor: 'red',
              // boxShadow: '0 0 20px #0000000d',
          }
        : {
              width: '100%',
              flex: 1,
          }),
}
