import {
    Image,
    ImageProps,
    Icon as RNEIcon,
    IconProps as RNEIconProps,
    Text,
} from '@rneui/themed'

import * as visit_japan_logo from 'assets/images/third-party/visit-japan-logo.png'
import { ImageStyle } from 'react-native'
export interface IconProps extends RNEIconProps {}

export const Icon = ({ type = 'tossface', ...props }: IconProps) => {
    switch (type) {
        case 'tossface':
            return <Text>{props.name}</Text>
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
