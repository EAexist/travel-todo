import { FC } from 'react'
import { ScrollView } from 'react-native'
//
import { Screen } from '@/components/Screen/Screen'
import { useStores } from '@/models'
import { AuthenticatedStackScreenProps } from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import { Image } from '@rneui/themed'

export const FullScreenImageScreen: FC<
    AuthenticatedStackScreenProps<'FullScreenImage'>
> = ({ route }) => {
    const rootStore = useStores()

    const { reservationId, localAppStorageFileUri } = route.params

    return (
        <Screen>
            <ScrollView>
                <Image
                    source={{ uri: localAppStorageFileUri }}
                    style={{}}
                    resizeMode="cover" // Or "contain", "stretch" depending on desired scaling
                />
            </ScrollView>
        </Screen>
    )
}
