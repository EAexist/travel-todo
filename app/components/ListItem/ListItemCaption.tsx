import { FC, PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { TransText } from '../TransText'
import { useTheme } from '@rneui/themed'

export const ListItemCaption: FC<PropsWithChildren> = props => {
    const { theme } = useTheme()
    return (
        <TransText
            {...props}
            style={{ color: theme.colors.text.secondary, ...styles.style }}
        />
    )
}

const styles = StyleSheet.create({
    style: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        fontSize: 10,
        lineHeight: 1 * 10,
        paddingLeft: 10,
    },
})
