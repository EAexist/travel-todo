import { Screen } from '@/components'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import SectionCard from '@/components/SectionCard'
import { ReorderTodo } from '@/components/Todo'
import { TodolistEditContent, TodolistSectionT } from '@/components/TodoList'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { Divider, ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { FlatList, SectionListData, SectionListRenderItem } from 'react-native'
import Animated, { useAnimatedRef } from 'react-native-reanimated'
import type {
    SortableGridDragEndParams,
    SortableGridRenderItem,
} from 'react-native-sortables'
import Sortable from 'react-native-sortables'

export const TodoReorderList = observer(
    ({ sections }: { sections: SectionListData<Todo, TodolistSectionT>[] }) => {
        const scrollableRef = useAnimatedRef<Animated.ScrollView>()

        const tripStore = useTripStore()

        const [reorderData, setReorderData] = useState(
            sections as { category: string; title: string; data: Todo[] }[],
        )

        const renderItem = useCallback<SortableGridRenderItem<string | Todo>>(
            ({ item }) =>
                typeof item === 'string' ? item : <ReorderTodo todo={item} />,
            [],
        )

        const [isDraggingCategory, setIsDraggingCategory] = useState(false)

        const handleCategoryDragEnd = useCallback<
            (props: SortableGridDragEndParams<any>) => void
        >(({ keyToIndex }) => {
            'worklet'
            setIsDraggingCategory(false)
            tripStore.reorderTodoCategories(keyToIndex)
        }, [])

        const handleDragEnd = useCallback<
            (props: SortableGridDragEndParams<any>) => void
        >(({ keyToIndex }) => {
            'worklet'
            tripStore.reorderTodos(keyToIndex)
        }, [])

        return (
            <Animated.ScrollView ref={scrollableRef} style={{ paddingTop: 24 }}>
                <Sortable.Grid
                    keyExtractor={item => item.category}
                    columns={1}
                    data={reorderData}
                    customHandle
                    renderItem={({ item: { category, title, data } }) => (
                        <SectionCard
                            containerStyle={{
                                paddingVertical: 8,
                            }}>
                            <Sortable.Handle>
                                <ListItemBase
                                    title={title}
                                    rightContent={
                                        <ListItem.Chevron
                                            name="drag-handle"
                                            type="material"
                                        />
                                    }
                                />
                            </Sortable.Handle>
                            {!isDraggingCategory && (
                                <View>
                                    <Divider width={0.5} />
                                    <Sortable.Grid
                                        columns={1}
                                        data={data}
                                        renderItem={renderItem}
                                        scrollableRef={scrollableRef} // required for auto scroll
                                        overDrag="none"
                                        dragActivationDelay={100}
                                        onDragEnd={handleDragEnd}
                                    />
                                </View>
                            )}
                        </SectionCard>
                    )}
                    rowGap={8}
                    scrollableRef={scrollableRef} // required for auto scroll
                    overDrag="none"
                    dragActivationDelay={100}
                    onDragEnd={handleCategoryDragEnd}
                    onDragStart={({ key }) => {
                        setIsDraggingCategory(true)
                    }}
                />
            </Animated.ScrollView>
        )
    },
)

export const TodolistReorderScreen = observer(() => {
    const tripStore = useTripStore()

    const renderTabViewItem = useCallback((isSupply: boolean) => {
        return (
            <TodoReorderList
                sections={
                    isSupply
                        ? tripStore.incompleteSupplyTodolistSectionListData
                        : tripStore.incompleteWorkTodolistSectionListData
                }
            />
        )
    }, [])

    useHeader({
        backgroundColor: 'secondary',
    })

    return (
        <Screen backgroundColor="secondary">
            <ContentTitle
                title={'할 일 순서 바꾸기'}
                subtitle={'할 일이나 카테고리를 드래그해서 옮겨보세요'}
            />
            <TodolistEditContent
                renderTabViewItem={renderTabViewItem}
                variant="default"
            />
        </Screen>
    )
})
