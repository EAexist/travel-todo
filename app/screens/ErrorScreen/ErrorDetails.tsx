import { Screen } from '@/components'
import { Button, Text } from '@rneui/themed'
import { ErrorInfo } from 'react'
import { ScrollView, View } from 'react-native'

export interface ErrorDetailsProps {
    error: Error
    errorInfo: ErrorInfo | null
    onReset(): void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps) {
    return (
        <Screen preset="fixed" safeAreaEdges={['top', 'bottom']}>
            <View>
                {/* <Icon icon="ladybug" size={64} /> */}
                {/* <Text
          style={themed($heading)}
          preset="subheading"
          tx="errorScreen:title"
        />
        <Text tx="errorScreen:friendlySubtitle" /> */}
            </View>

            <ScrollView>
                <Text>{`${props.error}`.trim()}</Text>
                <Text>{`${props.errorInfo?.componentStack ?? ''}`.trim()}</Text>
            </ScrollView>
            <Button onPress={props.onReset} />
        </Screen>
    )
}
