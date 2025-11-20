import {
    Image,
    ImageProps,
    Icon as RNEIcon,
    IconProps as RNEIconProps,
    Text,
    TextProps,
} from '@rneui/themed'

import * as visit_japan_logo from 'assets/images/third-party/visit-japan-logo.png'
import { ImageStyle } from 'react-native'
export interface IconProps extends RNEIconProps {
    textProps?: TextProps
}

export const Icon = ({ type = 'tossface', textProps, ...props }: IconProps) => {
    switch (type) {
        case 'tossface':
            return (
                <Text
                    {...textProps}
                    style={[{ fontFamily: 'tossface' }, textProps?.style]}>
                    {props.name}
                </Text>
            )
        case 'image':
            switch (props.name) {
                case 'visit-japan':
                    console.log('[Icon]' + props.name)
                    return <VisitJapan />
                default:
                    return <></>
            }
        default:
            return <RNEIcon type={type} {...props} />
    }
}

export const VisitJapan = ({ ...props }: ImageProps) => {
    return <Image source={visit_japan_logo} style={$imageStyle} {...props} />
}

const $imageStyle: ImageStyle = {
    width: 24,
    height: 24,
}
