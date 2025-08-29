import {Avatar, AvatarProps} from '@/components/Avatar'
import BottomSheetModal, {
  GestureHandlerRootViewWrapper,
  useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import {AddPresetTodo, AddTodo, TodoBase} from '@/components/Todo'
import {useTripStore} from '@/models'
import {Todo, TodoContent, TodoPreset} from '@/models/Todo'
import {useNavigate} from '@/navigators'
import {ListItem} from '@rneui/themed'
import {Observer, observer} from 'mobx-react-lite'
import {ReactNode, RefObject, useCallback, useRef} from 'react'
import {
  DefaultSectionT,
  FlatList,
  ListRenderItem,
  SectionListRenderItem,
  TextStyle,
  View,
} from 'react-native'
import TodolistEditScreenBase, {
  TodolistEditScreenBaseProps,
} from './TodolistEditScreenBase'

interface TodolistAddScreenBaseProps
  extends Pick<TodolistEditScreenBaseProps, 'title' | 'instruction'> {
  fab: ReactNode
  tripId: string
  callerName: 'TodolistSetting' | 'TodolistAdd'
}

export const useAddFlaggedPreset = () => {
  const tripStore = useTripStore()
  const addFlaggedPreset = useCallback(async () => {
    await tripStore.addFlaggedPreset()
  }, [tripStore])
  return addFlaggedPreset
}

export const useHandleAddTodo = ({
  callerName,
}: {
  callerName?: 'TodolistSetting' | 'TodolistAdd'
}) => {
  const tripStore = useTripStore()
  const {navigateWithTrip} = useNavigate()
  const handleAddTodo = useCallback(
    (todoCreateDTO: Partial<Todo>) => {
      const todo = tripStore.createCustomTodo(todoCreateDTO)
      if (todo) {
        let path = ''
        switch (todo.type) {
          case 'flight':
            path = 'FlightTodoCreate'
            break
          case 'flightTicket':
            path = 'FlightTicketTodoCreate'
            break
          default:
            path = 'TodoCreate'
            break
        }

        navigateWithTrip('TodoCreate', {
          todoId: todo?.id,
          isInitializing: true,
          callerName,
        })
      }
    },
    [tripStore.createCustomTodo],
  )
  return {
    handleAddTodo,
  }
}

export const TodolistAddScreenBase = observer(
  ({
    title,
    instruction,
    fab,
    tripId,
    callerName,
  }: TodolistAddScreenBaseProps) => {
    const tripStore = useTripStore()

    const {handleAddTodo} = useHandleAddTodo({})

    const renderItem: SectionListRenderItem<
      {todo?: Todo; preset?: TodoPreset},
      DefaultSectionT
    > = ({item: {preset, todo}}) => (
      <Observer
        render={() =>
          preset ? (
            <AddPresetTodo preset={preset} key={preset?.todoContent.id} />
          ) : (
            <AddTodo todo={todo as Todo} key={todo?.id} />
          )
        }
      />
    )

    /* BottomSheet */
    const bottomSheetRef = useRef<BottomSheetModal>(null)

    const renderSectionHeader = useCallback(
      ({section: {category, title}}: {section: DefaultSectionT}) => (
        <View>
          <ListSubheader lg title={title} />
          <TodoBase
            avatarProps={{icon: {name: 'add', type: 'material'}}}
            titleStyle={$titleStyleHighlighted}
            {...(category === 'reservation'
              ? {
                  title: '예약 할 일 추가하기',
                  subtitle: '항공권 · 기차표 · 입장권',
                  onPress: () => {
                    bottomSheetRef.current?.present()
                  },
                }
              : {
                  title:
                    category === 'foreign'
                      ? '해외여행 할 일 추가하기'
                      : '짐 추가하기',
                  subtitle: '',
                  onPress: () => handleAddTodo({category, type: 'custom'}),
                })}
          />
        </View>
      ),
      [handleAddTodo, bottomSheetRef.current],
    )

    const keyExtractor = useCallback(
      (item: any) =>
        item.todo
          ? `todo-${item.todo.id}`
          : `preset-${item.preset.todoContent.id}`,
      [],
    )

    return (
      <GestureHandlerRootViewWrapper>
        <TodolistEditScreenBase
          title={title}
          instruction={instruction}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          sections={tripStore.todolistWithPreset}
          keyExtractor={keyExtractor}>
          {fab}
          <ReservationTypeDropDownBottomSheet
            ref={bottomSheetRef}
            callerName={callerName}
          />
        </TodolistEditScreenBase>
      </GestureHandlerRootViewWrapper>
    )
  },
)

const ReservationTypeDropDownBottomSheet = ({
  ref,
  callerName,
}: {
  ref: RefObject<BottomSheetModal | null>
  callerName: 'TodolistSetting' | 'TodolistAdd'
}) => {
  const {handleAddTodo} = useHandleAddTodo({callerName})

  const {useActiveKey, handleBottomSheetModalChange, activate} =
    useNavigationBottomSheet(ref)

  useActiveKey(activeKey =>
    handleAddTodo({category: 'reservation', type: activeKey}),
  )

  interface ReservationTypeOptionData extends Pick<TodoContent, 'type'> {
    title: string
    avatarProps: AvatarProps
    isManaged?: boolean
  }

  const options: ReservationTypeOptionData[] = [
    {
      type: 'flight',
      title: '항공권',
      avatarProps: {
        icon: {name: '✈️'},
        containerStyle: {backgroundColor: 'bisque'},
      },
    },
    // {
    //   type: 'train',
    //   title: '열차',
    //   avatarProps: {icon: {name: '🚅'}, containerStyle: {backgroundColor: 'bisque'}},
    // },
    {
      type: 'custom',
      title: '직접 입력',
      avatarProps: {
        icon: {name: '✏️'},
        containerStyle: {backgroundColor: 'bisque'},
      },
    },
    // {
    //     type: 'accomodation',
    //     title: '숙소 예약',
    //     avatarProps: { icon: {name:'🛌'}, containerStyle: { backgroundColor: 'bisque' } },
    //     isManaged: true,
    // },
  ]

  const renderReservationTypeListItem: ListRenderItem<ReservationTypeOptionData> =
    useCallback(
      ({item}) => {
        const handlePress = () => activate(item.type)

        return (
          <ListItem
            onPress={handlePress}
            disabled={item.isManaged}
            useDisabledStyle={item.isManaged}>
            <Avatar
              //   size="medium"
              {...item.avatarProps}
            />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron
              iconProps={item.isManaged ? {name: 'check'} : undefined}
            />
          </ListItem>
        )
      },
      [activate],
    )

  return (
    <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
      <ContentTitle title={'무엇을 예약해야하나요?'} />
      <FlatList
        data={options}
        renderItem={renderReservationTypeListItem}
        keyExtractor={item => item.title}
      />
    </BottomSheetModal>
  )
}

const $titleStyleHighlighted: TextStyle = {
  fontWeight: 700,
}
