import { Platform } from 'react-native'
import { LoginScreen as LoginScreenNative } from './LoginScreen'
import { LoginScreen as LoginScreenWeb } from './LoginScreen.web'

export default Platform.OS == 'web' ? LoginScreenWeb : LoginScreenNative
