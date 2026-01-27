import {
    Avatar as RNEAvatar,
    AvatarProps as RNEAvatarProps
} from '@rneui/themed'
import * as charger from 'assets/images/icon/charger.png'
import * as pajamas from 'assets/images/icon/pajamas.png'
import * as powerBank from 'assets/images/icon/power-bank.png'
import * as sandals from 'assets/images/icon/sandals.png'
import * as towel from 'assets/images/icon/towel.png'
import * as visit_japan_logo from 'assets/images/third-party/visit-japan-logo.png'
import { PropsWithChildren, ReactNode } from 'react'
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
    let avatarProps: Partial<RNEAvatarProps> = {}
    let renderCustomContent: ReactNode | undefined = undefined

    let fontSize,
        width: number = 16

    switch (avatarSize) {
        case 'xsmall':
            fontSize = 16
            width = 20
            break
        case 'small':
            fontSize = 18
            width = 22
            break
        case 'medium':
            fontSize = 24
            width = 28
            break
        case 'large':
            fontSize = 28
            width = 32
            break
        case 'xlarge':
            fontSize = 32
            width = 36
            break
        default:
            fontSize = avatarSize
    }

    switch (icon?.type || 'tossface') {
        case 'tossface':
            avatarProps = {
                title: icon?.name,
                titleStyle: { fontFamily: 'Tossface', fontSize }
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
                case 'charger':
                    source = charger
                    break
                case 'visit-japan':
                    source = visit_japan_logo
                    break
                default:
                    break
            }

            avatarProps = {
                source,
                avatarStyle: {
                    width: width,
                    height: width,
                },
            }
            break
        default:
            avatarProps = {
                icon,
            }
            break
    }
    return (
        <RNEAvatar avatarSize={avatarSize} {...avatarProps} {...props}>
            {renderCustomContent || children}
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
