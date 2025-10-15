import { View } from 'react-native'
import { Avatar, AvatarProps } from './Avatar'
import { Text } from '@rneui/themed'

export const Label = ({
    title,
    avatarProps,
}: {
    title?: string
    avatarProps?: AvatarProps
}) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        }}>
        <Avatar {...avatarProps} />
        <Text>{title}</Text>
    </View>
)
