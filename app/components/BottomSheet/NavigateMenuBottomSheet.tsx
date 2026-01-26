import { FC, PropsWithChildren, RefObject, useCallback, useRef } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
//
import {
    BottomSheetModal,
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
    id: string
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

    const { navigateWithTrip } = useNavigate();
    const pendingPathRef = useRef<string | null>(null);

    const handleInternalChange = useCallback((index: number) => {
        console.log(`[handleInternalChange] index: ${index} pendingPathRef.current: ${pendingPathRef.current}`)
        if (index <= -1 && pendingPathRef.current) {
            navigateWithTrip(pendingPathRef.current);
            pendingPathRef.current = null;
        }
    }, [navigateWithTrip]);

    const renderSettingsListItem: ListRenderItem<NavigateListItemProp> =
        useCallback(
            ({ item: { path, icon, ...props } }) => {
                const handlePress = () => {
                    console.log(`[renderSettingsListItem.handlePress] path: ${path}`)
                    if (path) {
                        pendingPathRef.current = path
                        ref?.current?.dismiss()
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
            [ref],
        )

    return (
        <BottomSheetModal
            ref={ref}
            onChange={handleInternalChange}
            {...props}>
            <FlatList
                data={data}
                renderItem={renderSettingsListItem}
                keyExtractor={item => item.id}
            />
            {children}
        </BottomSheetModal>
    )
}