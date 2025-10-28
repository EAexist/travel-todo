import {
    Tab as RNETab,
    SwitchTabProps,
    SwitchTabItemProps,
    withTheme,
    TabItemProps,
} from '@rneui/themed'
import { FC } from 'react'
import { View, ViewProps } from 'react-native'

const SwitchTab: FC<SwitchTabProps> = ({ variant = 'primary', ...props }) => {
    return <RNETab variant={variant} {...props} />
}

const SwitchTabItem_: FC<SwitchTabItemProps> = ({
    variant = 'primary',
    ...props
}) => {
    return <RNETab.Item variant={variant} {...props} />
}
export const Container: FC<ViewProps> = props => (
    <View
        style={[
            props.style,
            {
                flexDirection: 'row',
                justifyContent: 'center',
            },
        ]}
        {...props}
    />
)

export const Tab = withTheme<SwitchTabProps>(SwitchTab, 'SwitchTab')
export const TabItem = withTheme<SwitchTabItemProps>(
    SwitchTabItem_,
    'SwitchTabItem',
)

export interface ToggleSwitchTabProps extends Pick<SwitchTabProps, 'variant'> {
    value: boolean
    onChange: () => void
    tabItemProps: {
        false: SwitchTabItemProps
        true: SwitchTabItemProps
    }
}

export const ToggleSwitchTab: FC<ToggleSwitchTabProps> = ({
    value,
    onChange,
    tabItemProps: { false: falseTabItemProps, true: trueTabItemProps },
    variant,
}) => {
    return (
        <Container>
            <Tab value={value ? 1 : 0} onChange={onChange} variant={variant}>
                <TabItem {...falseTabItemProps} variant={variant} />
                <TabItem {...trueTabItemProps} variant={variant} />
            </Tab>
        </Container>
    )
}

// const tripStore = useTripStore()

// const activeTabIndex = tripStore.settings.doShowSupplyTodosFirst ? 1 : 0
// const handleTabChange = useCallback((newIndex: number) => {
//     tripStore.settings.setDoShowSupplyTodosFirst(
//         newIndex === 0 ? false : true,
//     )
// }, [])
