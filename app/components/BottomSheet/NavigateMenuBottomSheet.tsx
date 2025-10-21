import { FC, PropsWithChildren, ReactNode, RefObject, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
//
import {
    BottomSheetModal,
    useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import { Icon } from '@/models/Icon'
import { useNavigate } from '@/navigators'
import { BottomSheetModalProps } from '@gorhom/bottom-sheet'
import { ListItemBase } from '../ListItem/ListItem'

export type NavigateListItemProp = {
    title: string
    path?: string
    icon?: Icon
    primary?: boolean
    rightContent?: ReactNode
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
            ({ item }) => {
                const handlePress = () => {
                    if (item.path) {
                        activate(item.path)
                    }
                }

                return (
                    <ListItemBase
                        onPress={handlePress}
                        avatarProps={{ icon: item.icon }}
                        title={item.title}
                        rightContent={item.rightContent}
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
                keyExtractor={item => item.title}
            />
            {children}
        </BottomSheetModal>
    )
}
