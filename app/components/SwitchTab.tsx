import { typography } from '@/rneui/theme'
import {
    Tab as RNETab,
    SwitchTabProps,
    SwitchTabItemProps,
    withTheme,
} from '@rneui/themed'
import { FC } from 'react'

const SwitchTab: FC<SwitchTabProps> = props => {
    return <RNETab {...props} />
}

const SwitchTabItem_: FC<SwitchTabItemProps> = props => {
    return <RNETab.Item {...props} />
}

export default withTheme<SwitchTabProps>(SwitchTab, 'SwitchTab')
export const SwitchTabItem = withTheme<SwitchTabItemProps>(
    SwitchTabItem_,
    'SwitchTabItem',
)
