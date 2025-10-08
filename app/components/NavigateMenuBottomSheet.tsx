import { ListItem } from '@rneui/themed'
import { FC, PropsWithChildren, ReactNode, RefObject, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
//
import {
  BottomSheetModal,
  useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import { useNavigate } from '@/navigators'
import { Icon } from '@/models/Icon'
import { Avatar } from './Avatar'
import { BottomSheetModalProps } from '@gorhom/bottom-sheet'

export type NavigateMenuData = {
  title: string
  path?: string
  icon?: Icon
  primary?: boolean
  rightContent?: ReactNode
}
export const NavigateMenuBottomSheet: FC<
  PropsWithChildren<
    Omit<BottomSheetModalProps, 'children'> & {
      data: NavigateMenuData[]
      ref: RefObject<BottomSheetModal | null>
    }
  >
> = ({ data, children, ref, ...props }) => {
  const { useActiveKey, handleBottomSheetModalChange, activate } =
    useNavigationBottomSheet(ref)
  const { navigateWithTrip } = useNavigate()
  useActiveKey(activeKey => navigateWithTrip(activeKey))

  const renderSettingsListItem: ListRenderItem<NavigateMenuData> = useCallback(
    ({ item }) => {
      const handlePress = () => {
        if (item.path) {
          activate(item.path)
        }
      }

      return (
        <ListItem onPress={handlePress}>
          {item.icon && <Avatar icon={item.icon} />}
          <ListItem.Content>
            <ListItem.Title primary={item.primary}>{item.title}</ListItem.Title>
          </ListItem.Content>
          {item.rightContent}
          {/* <ListItem.Chevron onPress={handlePress} /> */}
        </ListItem>
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
