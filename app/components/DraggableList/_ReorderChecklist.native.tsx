import DraggableFlatList, {
    DraggableFlatListProps,
} from 'react-native-draggable-flatlist'

export default function ReorderTrip<T>(props: DraggableFlatListProps<T>) {
    const [listData, setListData] = useState(
        tripStore.sectionListDataforDraggableFlatList,
    )

    const renderItem = useCallback(
        ({ item, drag, isActive }: RenderItemParams<Todo> & {}) => {
            return (
                // <ScaleDecorator>
                <ReorderTodo onLongPress={drag} disabled={isActive} {...item} />
                // </ScaleDecorator>
            )
        },
        [],
    )

    const renderDraggableFlatList: SectionListRenderItem<
        Todo[],
        DefaultSectionT
    > = useCallback(
        ({ item, section }) => (
            <DraggableList
                data={item}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onDragEnd={({ data }) => {
                    const newSections = listData.map(s =>
                        s.title === section.title ? { ...s, data: [data] } : s,
                    )
                    setListData(newSections)
                }}
            />
        ),
        [],
    )
    return <DraggableFlatList {...props} />
}
