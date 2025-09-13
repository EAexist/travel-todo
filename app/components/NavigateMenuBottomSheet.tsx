import { ListItem } from '@rneui/themed'
import { RefObject, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
//
import {
  BottomSheetModal,
  useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import { useNavigate } from '@/navigators'
import { Icon } from '@/models/Icon'
import { Avatar } from './Avatar'

export type NavigateMenuData = {
  title: string
  path: string
  icon?: Icon
  primary?: boolean
}
export const NavigateMenuBottomSheet = ({
  data,
  ref,
}: {
  data: NavigateMenuData[]
  ref: RefObject<BottomSheetModal | null>
}) => {
  const { useActiveKey, handleBottomSheetModalChange, activate } =
    useNavigationBottomSheet(ref)
  const { navigateWithTrip } = useNavigate()
  useActiveKey(activeKey => navigateWithTrip(activeKey))

  const renderSettingsListItem: ListRenderItem<NavigateMenuData> = useCallback(
    ({ item }) => {
      const handlePress = () => activate(item.path)

      return (
        <ListItem onPress={handlePress}>
          {item.icon && <Avatar icon={item.icon} />}
          <ListItem.Content>
            <ListItem.Title primary={item.primary}>{item.title}</ListItem.Title>
          </ListItem.Content>
          {/* <ListItem.Chevron onPress={handlePress} /> */}
        </ListItem>
      )
    },
    [activate],
  )

  return (
    <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
      <FlatList
        data={data}
        renderItem={renderSettingsListItem}
        keyExtractor={item => item.title}
      />
    </BottomSheetModal>
  )
}
