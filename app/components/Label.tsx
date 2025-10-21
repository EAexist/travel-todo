import { Text } from '@rneui/themed'
import { ReactElement } from 'react'
import { TextStyle, View } from 'react-native'

export const Label = ({
    title,
    leftContent,
    rightContent,
    style,
    dense = false,
}: {
    title?: string
    leftContent?: ReactElement
    rightContent?: ReactElement
    style?: TextStyle
    dense?: Boolean
}) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: dense ? 8 : 12,
        }}>
        {leftContent}
        <Text style={style || {}}>{title}</Text>
        {rightContent}
    </View>
)
