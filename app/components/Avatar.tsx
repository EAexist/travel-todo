import {
    Avatar as RNEAvatar,
    AvatarProps as RNEAvatarProps,
    Text,
} from '@rneui/themed'
import * as pajamas from 'assets/images/icon/pajamas.png'
import * as powerBank from 'assets/images/icon/power-bank.png'
import * as sandals from 'assets/images/icon/sandals.png'
import * as smartphone from 'assets/images/icon/smartphone.png'
import * as towel from 'assets/images/icon/towel.png'
import { PropsWithChildren } from 'react'
import { ImageSourcePropType, StyleSheet } from 'react-native'

export interface AvatarProps extends Omit<RNEAvatarProps, 'avatarSize'> {
    fontSize?: number
    avatarSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number
}

export const Avatar = ({
    children,
    icon,
    avatarSize = 'small',
    size,
    ...props
}: PropsWithChildren<AvatarProps>) => {
    let avatarProps: Partial<RNEAvatarProps>

    switch (icon?.type || 'tossface') {
        case 'tossface':
            avatarProps = {
                renderCustomContent: (
                    <Text
                        style={{
                            ...styles.titleStyle,
                            fontSize:
                                avatarSize === 'xsmall'
                                    ? 16
                                    : avatarSize === 'small'
                                      ? 18
                                      : avatarSize === 'medium'
                                        ? 24
                                        : avatarSize === 'large'
                                          ? 28
                                          : avatarSize === 'xlarge'
                                            ? 32
                                            : avatarSize,
                        }}>
                        {icon?.name}
                    </Text>
                ),
            }
            break
        case 'image':
            let source: ImageSourcePropType | undefined = undefined
            switch (icon?.name) {
                case 'towel':
                    source = towel
                    break
                case 'pajamas':
                    source = pajamas
                    break
                case 'power-bank':
                    source = powerBank
                    break
                case 'sandals':
                    source = sandals
                    break
                case 'smartphone':
                    source = smartphone
                    break
                default:
                    break
            }

            avatarProps = {
                source,
            }
            break
        default:
            avatarProps = {
                icon,
            }
            break
    }
    return (
        <RNEAvatar avatarSize={avatarSize} {...props} {...avatarProps}>
            {children}
        </RNEAvatar>
    )
}

const styles = StyleSheet.create({
    titleStyle: {
        fontFamily: 'Tossface',
        textAlign: 'center',
        // overflow: 'hidden',
    },
})

// export default withTheme<AvatarProps>(Avatar, 'Avatar')
