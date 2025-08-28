import {useStores, useTripStore} from '@/models'
import {Todo} from '@/models/Todo'
import {useCallback} from 'react'
import {StyleSheet, View} from 'react-native'
import Animated, {useAnimatedRef} from 'react-native-reanimated'
import type {
  SortableGridDragEndParams,
  SortableGridRenderItem,
} from 'react-native-sortables'
import Sortable from 'react-native-sortables'
import {ReorderTodo} from '../Todo'
import {Text} from '@rneui/themed'

export const ReorderTrip = () => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>()

  const tripStore = useTripStore()

  const DATA = tripStore.todolist
  const renderItem = useCallback<SortableGridRenderItem<Todo>>(
    ({item}) => <ReorderTodo todo={item} />,
    [],
  )

  // const DATA = Array.from({length: 12}, (_, index) => `Item ${index + 1}`)

  // const renderItem = useCallback<SortableGridRenderItem<string>>(
  //   ({item}) => (
  //     <View style={styles.card}>
  //       <Text>{item}</Text>
  //     </View>
  //   ),
  //   [],
  // )
  const onDragEnd = useCallback(
    ({keyToIndex}: SortableGridDragEndParams<any>) => {
      'worklet'
      // Your code here
    },
    [],
  )
  return (
    <Animated.ScrollView
      contentContainerStyle={styles.contentContainer}
      ref={scrollableRef}>
      <Sortable.Grid
        columns={1}
        data={DATA}
        renderItem={renderItem}
        rowGap={10}
        scrollableRef={scrollableRef} // required for auto scroll
        // autoScrollActivationOffset={75}
        // autoScrollSpeed={1}
        // autoScrollEnabled={true}
        overDrag="none"
        dragActivationDelay={100}
      />
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#36877F',
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 10,
  },
})
