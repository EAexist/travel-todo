import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type WebDemoStackParamList = {
    FakeReservationSource: { type: string }
}

export type WebDemoStackScreenProps<T extends keyof WebDemoStackParamList> =
    NativeStackScreenProps<WebDemoStackParamList, T>