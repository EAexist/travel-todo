import { Trans } from '@lingui/react/macro'
import { Text, withTheme } from '@rneui/themed'
import { TextStyle, View, ViewStyle } from 'react-native'

export interface ListSubheaderProps {
    title: string
    size?: 'small' | 'medium' | 'large' | 'xlarge'
    lg?: boolean
    style?: ViewStyle
    titleStyle?: TextStyle
    dense?: boolean
}

const ListSubheader = ({
    size = 'medium',
    lg = false,
    title,
    style,
    titleStyle,
    ...props
}: ListSubheaderProps) => {
    //   const { theme, updateTheme, replaceTheme } = props

    return (
        <View style={style}>
            <Trans>
                <Text style={titleStyle}>{title}</Text>
            </Trans>
        </View>
    )
}

export default withTheme<ListSubheaderProps>(ListSubheader, 'ListSubheader')
