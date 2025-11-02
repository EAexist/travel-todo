import { FC, PropsWithChildren, RefObject, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
//
import {
    BottomSheetModal,
    useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import { Icon } from '@/models/Icon'
import { useNavigate } from '@/navigators'
import { BottomSheetModalProps } from '@gorhom/bottom-sheet'
import { ListItemBase, ListItemBaseProps } from '../ListItem/ListItem'

export interface NavigateListItemProp
    extends Pick<
        ListItemBaseProps,
        | 'subtitle'
        | 'rightContent'
        | 'disabled'
        | 'subtitleStyle'
        | 'useDisabledStyle'
    > {
    title: string
    path: string
    icon?: Icon
    primary?: boolean
}
export const NavigateMenuBottomSheet: FC<
    PropsWithChildren<
        Omit<BottomSheetModalProps, 'children'> & {
            data: NavigateListItemProp[]
            ref: RefObject<BottomSheetModal | null>
        }
    >
> = ({ data, children, ref, ...props }) => {
    const { useActiveKey, handleBottomSheetModalChange, activate } =
        useNavigationBottomSheet(ref)
    const { navigateWithTrip } = useNavigate()
    useActiveKey(activeKey => navigateWithTrip(activeKey))

    const renderSettingsListItem: ListRenderItem<NavigateListItemProp> =
        useCallback(
            ({ item: { path, icon, ...props } }) => {
                const handlePress = () => {
                    if (path) {
                        activate(path)
                    }
                }

                return (
                    <ListItemBase
                        onPress={handlePress}
                        avatarProps={{ icon: icon }}
                        {...props}
                    />
                )
            },
            [activate],
        )

    return (
        <BottomSheetModal
            ref={ref}
            onChange={handleBottomSheetModalChange}
            {...props}>
            <FlatList
                data={data}
                renderItem={renderSettingsListItem}
                keyExtractor={item => item.path}
            />
            {children}
        </BottomSheetModal>
    )
}
