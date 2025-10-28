import { AvatarProps } from '@/components/Avatar'
import BottomSheetModal from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'
import { ListItem } from '@rneui/themed'
import { FC, RefObject, useCallback } from 'react'
import { FlatList, ListRenderItem, ViewStyle } from 'react-native'
import { ListItemBase, ListItemBaseProps } from '../ListItem/ListItem'

export interface CategoryListItemProp {
    title: string
    subtitle?: string
    category: string
    avatarProps: AvatarProps
    isActive?: boolean
}

export const CategoryMenuBottomSheet: FC<{
    data: CategoryListItemProp[]
    setCategory: (category: string) => void
    ref: RefObject<BottomSheetModal | null>
    title?: string
}> = ({ title = '카테고리 선택', data, setCategory, ref }) => {
    const renderCategoryListItem: ListRenderItem<CategoryListItemProp> =
        useCallback(
            ({ item }) => {
                const handlePress = () => {
                    setCategory(item.category)
                    ref.current?.close()
                }
                return (
                    <ListItemBase
                        onPress={handlePress}
                        avatarProps={item.avatarProps}
                        title={item.title}
                        subtitle={item.subtitle}
                        rightContent={
                            item.isActive && (
                                <ListItem.Chevron
                                    primary
                                    onPress={handlePress}
                                    name="check"
                                />
                            )
                        }
                    />
                )
            },
            [ref.current],
        )

    return (
        <BottomSheetModal ref={ref}>
            <ContentTitle title={title} />
            <FlatList
                data={data}
                renderItem={renderCategoryListItem}
                keyExtractor={item => item.category}
            />
        </BottomSheetModal>
    )
}

const $s: ViewStyle = {
    gap: 32,
}
