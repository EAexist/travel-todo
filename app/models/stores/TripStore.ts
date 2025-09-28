import {
  AccomodationModel,
  AccomodationSnapshotIn,
} from '@/models/Reservation/Accomodation'
import {
  Destination,
  DestinationContent,
  DestinationModel,
  DestinationSnapshotIn,
} from '@/models/Destination'
import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
  TODO_CATEGORY_TO_TITLE,
  FlightModel,
  Todo,
  TodoContent,
  TodoContentModel,
  TodoModel,
  TodoPresetItem,
  TodoPresetItemModel,
} from '@/models/Todo'
import {
  api,
  CreateAccomodationProps,
  CreateTodoProps,
  DeleteAccomodationProps,
  DeleteDestinationProps,
  DeleteTodoProps,
  TodoDTO,
  TripDTO,
} from '@/services/api'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import { toCalendarString } from '@/utils/date'
import { eachDayOfInterval } from 'date-fns'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { Accomodation } from '../Reservation/Accomodation'

export const TodolistModel = types
  .model('Preset')
  .actions(withSetPropAction)
  .actions(presetItem => ({}))

export const TripSummaryModel = types
  .model('TripSummary')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    isInitialized: false,
    title: types.maybeNull(types.string),
    startDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    endDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    destination: types.array(types.string),
  })
  .views(store => ({
    get scheduleText() {
      return `${store.startDateIsoString ? new Date(store.startDateIsoString).toLocaleDateString() : ''}${store.endDateIsoString ? ` - ${new Date(store.endDateIsoString).toLocaleDateString()}` : ''}`
    },
  }))

export interface TripSummary extends Instance<typeof TripSummaryModel> {}

export const TripStoreModel = types
  .model('TripStore')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    isInitialized: false,
    title: types.maybeNull(types.string),
    startDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    endDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    // destination: types.array(withLoading(DestinationModel)),
    destination: types.array(DestinationModel),
    todoMap: types.map(TodoModel),
    todolist: types.map(types.array(types.reference(TodoModel))),
    customTodoContent: types.array(TodoContentModel),
    activeItem: types.maybeNull(types.reference(TodoModel)),
    accomodation: types.map(AccomodationModel),
    preset: types.map(types.array(TodoPresetItemModel)),
    recommendedFlight: types.array(FlightModel),
    isReservationPinned: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    syncOrderInCategory(category: string) {
      store.todolist.get(category)?.sort((a, b) => a.orderKey - b.orderKey)
    },
  }))
  .actions(store => ({
    syncOrder() {
      store.todolist.forEach((v, k) => {
        store.syncOrderInCategory(k.toString())
      })
    },
  }))
  .actions(store => ({
    createCustomTodoContent(todoContent: TodoContent) {
      let title = ''
      let icon = {}

      switch (todoContent.category) {
        case 'reservation':
          title = '새 예약'
          icon = { name: '🎫', type: 'tossface' }
          break
        case 'foreign':
          title = '새 할 일'
          icon = { name: '⭐️', type: 'tossface' }
          break
        case 'goods':
          title = '새 짐'
          icon = { name: '🧳', type: 'tossface' }
          break
        default:
          break
      }

      const newTodoContent = TodoContentModel.create({
        ...todoContent,
        title: todoContent.title || title,
        icon: todoContent.icon || icon,
      })
      store.customTodoContent.push(newTodoContent)
      return newTodoContent
    },
    addTodo(todo: Todo) {
      store.todoMap.put(todo)
      if (!store.todolist.has(todo.category)) {
        store.todolist.set(todo.category, [])
      }
      store.todolist.get(todo.category)?.push(todo.id)
      return todo
    },
    set(trip: TripStoreSnapshot) {
      console.log('[Tripstore.set]')
      store.setProp('id', trip.id)
      store.setProp('title', trip.title)
      store.setProp('destination', trip.destination)
      store.setProp('startDateIsoString', trip.startDateIsoString)
      store.setProp('endDateIsoString', trip.endDateIsoString)
      store.setProp(
        'todoMap',
        trip.todoMap,
        // Object.fromEntries(
        //   trip.todolist.map(item => [item.id, item]),
        // ),
      )
      store.setProp('todolist', { reservation: [], foreign: [], goods: [] })
      //   Object.values(trip.todoMap).forEach(todo => {
      Object.values(store.todoMap).forEach(todo => {
        if (!store.todolist.has(todo.category)) {
          store.todolist.set(todo.category, [])
        }
        store.todolist.get(todo.category)?.push(todo.id)
      })
      store.syncOrder()
      /* Nested Object: UseSetProps */
      store.setProp('preset', trip.preset)
    },
    resetAllDeleteFlag() {
      ;[...store.todoMap.values()].forEach(todo =>
        todo.setProp('isFlaggedToDelete', false),
      )
    },
    setTodo(todo: Todo) {
      store.todoMap.set(todo.id, todo)
    },
    /* Active Item Actions */
    setActiveItem(todo?: Todo) {
      console.log('SETACTIVE', todo?.title)
      store.setProp('activeItem', todo ? todo.id : undefined)
    },
    removeActiveItem() {
      store.setProp('activeItem', undefined)
    },
    _deleteTodo(todo: Todo) {
      store.todolist.get(todo.category)?.remove(todo)
      store.todoMap.delete(todo.id)
    },
    _deleteDestination(destination: Destination) {
      store.destination.remove(destination)
    },
    // updatePreset() {
    //   const usedPresetIds = [
    //     ...new Set(
    //       Array.from(store.todoMap.values()).map(todo => todo.presetId),
    //     ),
    //   ]
    //     .filter(presetId => presetId != null)
    //     .map(presetId => presetId.toString())
    //   store.setProp(
    //     'preset',
    //     Object.fromEntries(
    //       Array.from(store.preset.entries())
    //         .map(([category, presets]) => [
    //           category,
    //           presets.filter(preset => !usedPresetIds.includes(preset.content.id)),
    //         ])
    //         .filter(([category, presets]) => presets.length > 0),
    //     ),
    //   )
    //   console.log('updatePreset')
    // },
  }))
  .actions(store => ({
    add(todo: Todo) {
      store.todoMap.put(todo)
      store.addTodo(todo)
    },
    addDestination(destination: DestinationSnapshotIn) {
      store.destination.push(destination)
    },
  }))
  .actions(store => ({
    /*
     * Backend API calls
     */
    async fetchPreset() {
      console.log('[Tripstore.fetchPreset]')
      return api.getTodoPreset(store.id).then(response => {
        if (response.kind == 'ok') {
          const map = new Map<string, TodoPresetItem[]>()
          response.data.forEach(({ isFlaggedToAdd, todoContent }) => {
            if (!map.has(todoContent.category)) {
              map.set(todoContent.category, [])
            }
            map.get(todoContent.category)?.push(
              TodoPresetItemModel.create({
                isFlaggedToAdd,
                todoContent: todoContent,
              }),
            )
          })
          store.setProp('preset', Object.fromEntries(map.entries()))
        }
        return response
      })
    },
    async fetchRecommendedFlight() {
      console.log('[fetchRecommendedFlight]')
      api.getRecommendedFlight(store.id).then(response => {
        if (response.kind == 'ok') {
          store.setProp('recommendedFlight', response.data)
          console.log(`[fetchRecommendedFlight] data=${response.data}`)
        }
      })
    },
    /**
     * Create an empty trip and fetch it with backend-generated id.
     */
    // async create() {
    //   const response = await api.createTrip()
    //   if (response.kind === 'ok') {
    //     store.setProp('id', response.data.id)
    //   }
    // },

    /**
     * Create an empty destination and fetch it with backend-generated id.
     */
    async createDestination(destination: DestinationContent) {
      //   store.addDestination(destination)
      const response = await api.createDestination({
        tripId: store.id,
        destinationDTO: destination,
      })
      if (response.kind === 'ok') {
        store.addDestination(response.data)
      }
    },

    /**
     * Trip CRUD Actions
     */
    /**
     * Fetch a trip with given id.
     */
    // async fetch(id: string) {
    //   console.log('[Tripstore.fetch]')
    //   const response = await api.getTrip(id)
    //   if (response.kind === 'ok') {
    //     store.set(response.data as TripStoreSnapshot)
    //   } else {
    //     console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
    //   }
    //   console.log(store)
    // },
    /**
     * Patch(update) a trip.
     * @TODO use only changed sub-data as payload, instead of full store
     */
    async patchToServer(tripDTO: TripDTO) {
      api.patchTrip(tripDTO).then(response => {
        return response.kind
        // if (response.kind === 'ok') {
        // }
      })
    },
    /**
     * Patch(update) a trip.
     * @TODO use only changed sub-data as payload, instead of full store
     */
    patch(tripDTO: TripDTO) {
      console.log('[Tripstore.patch]')
      enqueueAction(APIAction.CREATE_TODO, tripDTO as TripDTO)
    },

    /**
     * Todo CRUD Actions
     */
    /**
     * Create an empty todo and fetch it with backend-generated id.
     */
    createCustomTodo(todoContent: TodoContent) {
      return store.addTodo(
        TodoModel.create({
          content: store.createCustomTodoContent(todoContent),
          isPreset: false,
        }),
      )
      //   return store.todoMap.get(todo.id)
      //   const response = await api.createTodo({tripId: store.id, todo})
      //   if (response.kind === 'ok') {
      //     const todo = response.data
      //     store.addTodo(todo)
      //     return store.todoMap.get(todo.id)
      //   }
    },
    /**
     * Create an empty todo and fetch it with backend-generated id.
     */
    // async createPresetTodo(presetId: string) {
    //   const response = await api.createTodo({tripId: store.id, presetId})
    //   if (response.kind === 'ok') {
    //     const todo = response.data
    //     store.addTodo(todo)
    //   }
    // },

    /**
     * Patch(update) a todo.
     */
    patchTodo(todoDTO: TodoDTO) {
      enqueueAction(APIAction.PATCH_TODO, {
        tripId: store.id,
        todoDTO: todoDTO,
      } as CreateTodoProps)
    },
    /**
     * Delete a todo.
     */
    deleteTodo(todo: Todo) {
      store._deleteTodo(todo)
      enqueueAction(APIAction.DELETE_TODO, {
        tripId: store.id,
        todoId: todo.id,
      } as DeleteTodoProps)
      //   await api.deleteTodo(store.id, todo.id).then(({kind}) => {
      //     if (kind == 'ok') {
      //       store._deleteTodo(todo)
      //       console.log('[deleteTodo]', todo)
      //     }
      //   })
    },

    /**
     * Destination CRUD Actions
     */
    /**
     * Delete a destination.
     */
    async deleteDestination(destination: Destination) {
      store.destination.remove(destination)
      enqueueAction(APIAction.DELETE_DESTINATION, {
        tripId: store.id,
        destinationId: destination.id,
      } as DeleteDestinationProps)

      //   api.deleteDestination(store.id, destination.id).then(({kind}) => {
      //     console.log(kind, destination)
      //     if (kind == 'ok') {
      //       store._deleteDestination(destination)
      //     }
      //   })
    },
    /**
     * Create an empty accomodation and fetch it with backend-generated id.
     */
    async createAccomodation() {
      store.accomodation.put(AccomodationModel.create())
      //   const response = await api.createAccomodation(store.id)
      //   if (response.kind === 'ok') {
      //     const accomodation = response.data as AccomodationSnapshotIn
      //     store.accomodation.put(accomodation)
      //   }
    },
    /**
     * Patch(update) a accomodation.
     */
    async patchAccomodation(accomodation: AccomodationSnapshotIn) {
      store.accomodation.set((accomodation as Accomodation).id, accomodation)
      enqueueAction(APIAction.PATCH_ACCOMODATION, {
        tripId: store.id,
        accomodation: accomodation,
      } as CreateAccomodationProps)
      //   const response = await api.patchAccomodation(store.id, accomodation)
      //   if (response.kind === 'ok')
      //     store.accomodation.set(accomodation.id, accomodation)
    },
    /**
     * Delete a accomodation.
     */
    async deleteAccomodation(accomodation: AccomodationSnapshotIn) {
      store.accomodation.delete((accomodation as Accomodation).id)
      enqueueAction(APIAction.DELETE_ACCOMODATION, {
        tripId: store.id,
        accomodationId: accomodation.id,
      } as DeleteAccomodationProps)
      //   api.deleteAccomodation(store.id, item.id).then(({kind}) => {
      //     if (kind == 'ok') {
      //       store.accomodation.delete(item.id)
      //     }
      //   })
    },
    /**
     * Delete a accomodation.
     */
    // async uploadReservation(item: AccomodationSnapshotIn) {
    //   api.deleteAccomodation(store.id, item.id).then(({kind}) => {
    //     if (kind == 'ok') {
    //       store.accomodation.delete(item.id)
    //     }
    //   })
    // },
  }))
  .views(store => ({
    /*
     * Trip Metadata
     */
    get startDate() {
      return store.startDateIsoString
        ? new Date(store.startDateIsoString)
        : undefined
    },
    get endDate() {
      return store.endDateIsoString
        ? new Date(store.endDateIsoString)
        : undefined
    },
    get isScheduleSet() {
      return this.startDate !== null
    },
    get isDestinationSet() {
      return store.destination.length > 0
    },
    get destinationTitles() {
      return store.destination.map(item => item.title)
      // return store.destination.map((item) => item.title).join(', ')
    },
    get passportExpiryRequiredAfterThisDate() {
      const daysPadding = 1
      const passportExpiryRequiredAfterThisDate = this.endDate?.setDate(
        this.endDate?.getDate() + daysPadding,
      )
      const date = this.endDate?.getDate()
      const month = this.endDate?.toLocaleDateString('en', {
        month: 'short',
      })
      const monthLocale = this.endDate?.toLocaleDateString(undefined, {
        month: 'short',
      })
      const year = this.endDate?.getFullYear()
      return this.endDate
        ? `${date} ${monthLocale && `${monthLocale}/`}${month} ${year}`
        : '여행이 끝나는 날'
    },
    /*
     * Todolist
     */
    get nonEmptysections() {
      return Array.from(store.todolist.entries())
        .filter(([category, data]) => data.length > 0)
        .map(([category, _]) => ({
          category,
          title: TODO_CATEGORY_TO_TITLE[category],
          data: [category],
        }))
    },
    get sections() {
      //   const activeSections = [
      //     ...Array.from(store.todoMap.values()).map(item => item.category),
      //     ...(Array.from(store.preset.values()).flat() as Preset[]).map(
      //       preset => preset.content.category,
      //     ),
      //   ]
      //   return ['reservation', 'foreign', 'goods'].filter(section =>
      //     activeSections.includes(section),
      //   )
      return ['reservation', 'foreign', 'goods']
    },
    get sectionedTrip() {
      return Array.from(store.todolist.entries()).map(([category, data]) => ({
        category,
        title: TODO_CATEGORY_TO_TITLE[category],
        data,
      }))
    },
    get sectionedNonEmptyTrip() {
      return this.sectionedTrip.filter(({ data }) => data.length > 0)
    },
    get incompleteTrip() {
      return this.sectionedNonEmptyTrip.map(({ title, data }) => {
        return { title, data: data.filter(item => !item.isCompleted) }
      })
    },
    get completedTrip() {
      return this.sectionedNonEmptyTrip
        .map(({ title, data }) => {
          return {
            title,
            data: data.filter(item => item.isCompleted),
          }
        })
        .filter(({ data }) => data.length > 0)
    },
    /*
     * Delete Todo
     */
    get deleteFlaggedCompletedTrip() {
      return this.completedTrip
      return this.completedTrip.map(({ title, data }) => {
        return {
          title,
          data: data.toSorted((a, b) =>
            a.isFlaggedToDelete === b.isFlaggedToDelete
              ? 0
              : b.isFlaggedToDelete
                ? -1
                : 1,
          ),
        }
      })
    },
    get deleteFlaggedIncompleteTrip() {
      return this.incompleteTrip
      return this.incompleteTrip.map(({ title, data }) => {
        return {
          title,
          data: data.toSorted((a, b) =>
            a.isFlaggedToDelete === b.isFlaggedToDelete
              ? 0
              : b.isFlaggedToDelete
                ? -1
                : 1,
          ),
        }
      })
    },
    /*
     * Add Todo Preset
     */
    get todolistWithPreset() {
      return this.sections.map(category => {
        const addedItems = store.todolist.get(category)
        const addedStockIds = addedItems
          ?.filter(item => item.isPreset)
          .map(item => item.content.id)
        // const addedItemIds = addedItems?.map(item => item.id) as string[]
        return {
          category,
          title: TODO_CATEGORY_TO_TITLE[category],
          data: [
            ...((addedItems?.map(item => ({
              todo: item,
            })) as { todo?: Todo; preset?: TodoPresetItem }[]) || []),
            ...(store.preset
              .get(category)
              ?.filter(
                preset => !addedStockIds?.includes(preset.todoContent.id),
              )
              .map(preset => ({
                preset,
              })) || []),
          ],
        }
      })
    },
    get isActive() {
      return store.activeItem !== null
    },
  }))
  .views(store => ({
    get dDay() {
      const today = new Date()
      today.setMilliseconds(0)
      today.setSeconds(0)
      today.setMinutes(0)
      today.setHours(0)
      console.log('today: ', today, store.startDate)
      const dday = store.startDate
        ? Math.floor(
            (store.startDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null
      return dday
    },
    get reservedNights() {
      return [...store.accomodation.values()]
        .map(acc => acc.checkoutDate.getDate() - acc.checkinDate.getDate())
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        }, 0)
    },
    get accomodationTodoStatusText() {
      return store.endDate && store.startDate
        ? `${this.reservedNights}박/${store.endDate?.getDate() - store.startDate?.getDate()}박`
        : null
    },
    get reservationTodoStatusText() {
      const todos = store.todolist
        .get('reservation')
        ?.filter(todo => todo.type !== 'accomodation')
      return `${todos?.filter(todo => todo.isCompleted).length}/${todos?.length}`
    },
    get foreignTodoStatusText() {
      const todos = store.todolist.get('foreign')
      return `${todos?.filter(todo => todo.isCompleted).length}/${todos?.length}`
    },
    get goodsTodoStatusText() {
      const todos = store.todolist.get('goods')
      return `${todos?.filter(todo => todo.isCompleted).length}/${todos?.length}`
    },
    get orderedItems() {
      console.log(store.accomodation.values())
      return [...store.accomodation.values()].sort(
        (a, b) => a.checkinDate.getDate() - b.checkinDate.getDate(),
      )
    },
    get indexedUniqueTitles() {
      return [...new Set(this.orderedItems.map(item => item.title))]
    },
    get calendarMarkedDateEntries() {
      return this.orderedItems
        .map(item => {
          const start = item.checkinDate
          const end = item.checkoutDate
          console.log(start, end)
          const intervalDays = eachDayOfInterval({ start, end }).slice(0, -1)
          return intervalDays.map((date, index) => [
            toCalendarString(date),
            {
              startingDay: index === 0,
              endingDay: index === intervalDays.length - 1,
              selected: true,
              colorIndex: this.indexedUniqueTitles.indexOf(item.title),
            },
          ])
        })
        .flat() as [
        string,
        {
          startingDay: boolean
          endingDay: boolean
          selected: boolean
          colorIndex: number
        },
      ][]
    },
  }))
  .actions(store => ({
    async initialize() {
      store.setProp('isInitialized', true)
      enqueueAction(APIAction.PATCH_TRIP, {
        id: store.id,
        isInitialized: store.isInitialized,
      } as TripDTO)
    },
    completeAndPatchTodo(todo: Todo) {
      todo.complete()
      store.patchTodo(todo)
      if (todo) {
        if (todo.type == 'flight')
          store.createCustomTodo({
            ...todo,
            type: 'flightTicket',
          })
      }
    },
    deleteTodos() {
      Array.from(store.todoMap.values())
        .filter(item => item.isFlaggedToDelete)
        .forEach(item => store.deleteTodo(item))
    },
    async addFlaggedPreset() {
      await Promise.all(
        (Array.from(store.preset.values()).flat() as TodoPresetItem[])
          .filter(preset => preset.isFlaggedToAdd)
          .map(async preset => {
            store.addTodo(
              TodoModel.create({
                content: preset.todoContent,
                isPreset: true,
              }),
            )
            preset.setProp('isFlaggedToAdd', false)

            // const response = await api.createTodo({
            //   tripId: store.id,
            //   todo: {
            //     ...preset.content,
            //     id: undefined,
            //     presetId: Number(preset.content.id),
            //   },
            // })
            // if (response.kind === 'ok') {
            //   const todo = response.data
            //   store.addTodo(todo)
            // }
            // preset.setProp('isFlaggedToAdd', false)
          }),
      )
      store.syncOrder()
    },
    async reorder(category: string, keyToIndex: Record<string, number>) {
      await Promise.all(
        Object.entries(keyToIndex).map(([todoId, index]) => {
          const todo = store.todoMap.get(todoId) as Todo
          todo.setProp('orderKey', index)
          store.patchTodo(todo)
        }),
      )
      store.syncOrder()
    },
    // setPreset() {
    //   store.setProp('_presets', [])
    // },
    // toggleFavorite(item: Todo) {
    //   if (store.hasFavorite(todo)) {
    //     store.removeFavorite(todo)
    //   } else {
    //     store.addFavorite(todo)
    //   }
    // },
  }))

export interface TripStore extends Instance<typeof TripStoreModel> {}
export interface TripStoreSnapshot extends SnapshotOut<typeof TripStoreModel> {}
// export type TripStoreProps = keyof TripStoreSnapshot
