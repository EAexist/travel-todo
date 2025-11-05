import { Platform } from 'react-native'

export const isMobileWeb = /iphone|ipad|ipod|android|windows phone/g.test(
    navigator.userAgent.toLowerCase(),
)

export const isMobileNative = Platform.OS === 'android' || Platform.OS === 'ios'

export const isMobile = isMobileWeb || isMobileNative
