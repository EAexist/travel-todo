import { ReorderTodo } from '@/components/Todo'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect } from 'react'
import { SectionListRenderItem } from 'react-native'
import Animated, { useAnimatedRef } from 'react-native-reanimated'
import type {
    SortableGridDragEndParams,
    SortableGridRenderItem,
} from 'react-native-sortables'
import Sortable from 'react-native-sortables'
import TodolistEditScreenBase from './TodolistEditScreenBase'

export const ReorderTrip = observer(({ category }: { category: string }) => {
    const scrollableRef = useAnimatedRef<Animated.ScrollView>()

    const tripStore = useTripStore()

    const renderItem = useCallback<SortableGridRenderItem<Todo>>(
        ({ item }) => (item.isCompleted ? <></> : <ReorderTodo todo={item} />),
        [],
    )

    const handleDragEnd = useCallback<
        (props: SortableGridDragEndParams<any>) => void
    >(
        ({ indexToKey, keyToIndex }) => {
            'worklet'
            tripStore.reorder(category, keyToIndex)
        },
        [tripStore, category],
    )

    return (
        <Animated.ScrollView ref={scrollableRef}>
            <Sortable.Grid
                columns={1}
                data={tripStore.todolist.get(category) as Todo[]}
                renderItem={renderItem}
                scrollableRef={scrollableRef} // required for auto scroll
                overDrag="none"
                dragActivationDelay={100}
                onDragEnd={handleDragEnd}
                // autoScrollActivationOffset={75}
                // autoScrollSpeed={1}
                // autoScrollEnabled={true}
                // customHandle
            />
        </Animated.ScrollView>
    )
})

interface TodolistReorderScreenProps {}

export const TodolistReorderScreen = observer(
    (props: TodolistReorderScreenProps) => {
        const tripStore = useTripStore()
        const { navigateWithTrip } = useNavigate()

        // Handler for the "완료" (Complete) button
        const handleToDeleteScreenPress = useCallback(() => {
            navigateWithTrip('TodolistDelete')
        }, [navigateWithTrip])

        useEffect(() => {
            console.log(tripStore.sections)
        }, [tripStore])
        useHeader({
            rightActionTitle: '삭제',
            onRightPress: handleToDeleteScreenPress,
        })

        const renderItem: SectionListRenderItem<string> = ({
            item: category,
        }) => <ReorderTrip category={category} />

        return (
            <TodolistEditScreenBase
                title={'할 일 순서 바꾸기'}
                instruction={'할 일이나 카테고리를 드래그해서 옮겨보세요'}
                renderItem={renderItem}
                sections={tripStore.nonEmptysections}
            />
        )
    },
)
