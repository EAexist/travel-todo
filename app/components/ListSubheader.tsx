import { Trans } from '@lingui/react/macro'
import { Text, withTheme } from '@rneui/themed'
import { TextStyle, View, ViewStyle } from 'react-native'

export interface ListSubheaderProps {
    title: string
    size?: 'sm' | 'md' | 'lg'
    lg?: boolean
    style?: ViewStyle
    titleStyle?: TextStyle
    dense?: boolean
}

const ListSubheader = ({
    size = 'md',
    lg = false,
    ...props
}: ListSubheaderProps) => {
    //   const { theme, updateTheme, replaceTheme } = props

    return (
        <View style={props.style}>
            <Trans>
                <Text style={props.titleStyle}>{props.title}</Text>
            </Trans>
        </View>
    )
}

// declare module '@rneui/themed' {
//   export interface ComponentTheme {
//     ListSubheader: Partial<ListSubheaderProps>
//   }
// }
export default withTheme<ListSubheaderProps>(ListSubheader, 'ListSubheader')
