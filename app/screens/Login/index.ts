import { Platform } from 'react-native'
import { LoginScreen as LoginScreenNative } from './LoginScreen'
import { LoginScreen as LoginScreenWeb } from './LoginScreen.web'

export const Login = Platform.OS == 'web' ? LoginScreenWeb : LoginScreenNative

export { DemoHomeScreen as DemoHome } from './DemoHomeScreen'
