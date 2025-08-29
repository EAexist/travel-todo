import {AccomodationModel, AccomodationSnapshotIn} from '@/models/Accomodation'
import {
  Destination,
  DestinationContent,
  DestinationModel,
  DestinationSnapshotIn,
} from '@/models/Destination'
import {withSetPropAction} from '@/models/helpers/withSetPropAction'
import {
  CATEGORY_TO_TITLE,
  FlightModel,
  Todo,
  TodoModel,
  TodoPreset,
  TodoPresetModel,
  TodoSnapshotIn,
} from '@/models/Todo'
import {api} from '@/services/api'
import {toCalendarString} from '@/utils/date'
import {eachDayOfInterval} from 'date-fns'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {v4 as uuidv4} from 'uuid'
import {Accomodation} from '../Accomodation'

export const TodolistModel = types
  .model('Preset')
  .actions(withSetPropAction)
  .actions(presetItem => ({}))

export const TripStoreModel = types
  .model('TripStore')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    isInitialized: false,
    title: '',
    startDateISOString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    endDateISOString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    // destination: types.array(withLoading(DestinationModel)),
    destination: types.array(DestinationModel),
    todoMap: types.map(TodoModel),
    todolist: types.map(types.array(types.reference(TodoModel))),
    activeItem: types.maybeNull(types.reference(TodoModel)),
    accomodation: types.map(AccomodationModel),
    preset: types.map(types.array(TodoPresetModel)),
    recommendedFlight: types.array(FlightModel),
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
    addTodo(todoContent: Partial<Todo>) {
      const todo = TodoModel.create({
        ...todoContent,
        content: todoContent.content?.id as string,
      })
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
      store.setProp('startDateISOString', trip.startDateISOString)
      store.setProp('endDateISOString', trip.endDateISOString)
      store.setProp(
        'todoMap',
        trip.todoMap,
        // Object.fromEntries(
        //   trip.todolist.map(item => [item.id, item]),
        // ),
      )
      store.setProp('todolist', {reservation: [], foreign: [], goods: []})
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
    async fetchPreset() {
      console.log('[Tripstore.fetchPreset]')
      return api.getTodoPreset(store.id).then(response => {
        if (response.kind == 'ok') {
          const map = new Map<string, TodoPreset[]>()
          response.data.forEach(({isFlaggedToAdd, todoContent}) => {
            if (!map.has(todoContent.category)) {
              map.set(todoContent.category, [])
            }
            map.get(todoContent.category)?.push(
              TodoPresetModel.create({
                isFlaggedToAdd,
                todoContent: todoContent,
              }),
            )
          })
          store.setProp('preset', Object.fromEntries(map.entries()))
        }
        return response.kind
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
  }))
  .actions(store => ({
    // /**
    //  * Trip CRUD Actions
    //  */
    // /**
    //  * Create an empty trip and fetch it with backend-generated id.
    //  */
    // async create() {
    //   const response = await api.createTrip()
    //   if (response.kind === 'ok') {
    //     store.setProp('id', response.data.id)
    //   }
    // },
    /**
     * Fetch a trip with given id.
     */
    async fetch(id: string) {
      console.log('[Tripstore.fetch]')
      const response = await api.getTrip(id)
      if (response.kind === 'ok') {
        store.set(response.data as TripStoreSnapshot)
      } else {
        console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
      }
      console.log(store)
    },
    /**
     * Patch(update) a trip.
     */
    async patch() {
      console.log('[Tripstore.patch]')
      const response = await api.patchTrip(store as TripStore)
      if (response.kind == 'ok') {
        store.set(response.data as TripStoreSnapshot)
        console.log('[Tripstore.patch] returns')
      }
      return response.kind
    },

    /**
     * Todo CRUD Actions
     */
    /**
     * Create an empty todo and fetch it with backend-generated id.
     */
    createCustomTodo(todo: Partial<Todo>) {
      return store.addTodo(todo)
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
     * Patch(update) a trip.
     */
    async patchTodo(todo: Todo) {
      store.setTodo(todo)
      return todo
      //   const response = await api.patchTodo(store.id, todo)
      //   if (response.kind === 'ok') {
      //     console.log(`[patchTodo] todo=${JSON.stringify(todo)}`)
      //     store.setTodo(todo)
      //     return todo
      //   }
    },
    /**
     * Delete a trip.
     */
    async deleteTodo(todo: Todo) {
      store._deleteTodo(todo)
      //   await api.deleteTodo(store.id, todo.id).then(({kind}) => {
      //     if (kind == 'ok') {
      //       store._deleteTodo(todo)
      //       console.log('[deleteTodo]', todo)
      //     }
      //   })
    },

    /* TodoPreset Actions */

    // async fetchPreset() {
    //   const response = await api.getPreset('1')
    //   console.log(response)
    //   if (response.kind === 'ok') {
    //     response.preset.forEach(preset => {
    //       store.addTodo(preset.item)
    //       store.addPreset(preset)
    //     })
    //     console.log(store.preset)
    //   } else {
    //     console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
    //   }
    // },

    /**
     * Destination CRUD Actions
     */
    /**
     * Create an empty destination and fetch it with backend-generated id.
     */
    async createDestination(destination: DestinationContent) {
      store.addDestination(destination)
      //   store.pend()
      //   const response = await api.createDestination(store.id, destination)
      //   if (response.kind === 'ok') {
      //     store.addDestination(response.data)
      //     store.rest()
      //   }
    },
    /**
     * Delete a destination.
     */
    async deleteDestination(destination: Destination) {
      api.deleteDestination(store.id, destination.id).then(({kind}) => {
        console.log(kind, destination)
        if (kind == 'ok') {
          store._deleteDestination(destination)
        }
      })
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
      //   const response = await api.patchAccomodation(store.id, accomodation)
      //   if (response.kind === 'ok')
      //     store.accomodation.set(accomodation.id, accomodation)
    },
    /**
     * Delete a accomodation.
     */
    async deleteAccomodation(accomodation: AccomodationSnapshotIn) {
      store.accomodation.delete((accomodation as Accomodation).id)
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
      return store.startDateISOString
        ? new Date(store.startDateISOString)
        : undefined
    },
    get endDate() {
      return store.endDateISOString
        ? new Date(store.endDateISOString)
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
          title: CATEGORY_TO_TITLE[category],
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
        title: CATEGORY_TO_TITLE[category],
        data,
      }))
    },
    get sectionedNonEmptyTrip() {
      return this.sectionedTrip.filter(({data}) => data.length > 0)
    },
    get incompleteTrip() {
      return this.sectionedNonEmptyTrip.map(({title, data}) => {
        return {title, data: data.filter(item => !item.completeDateISOString)}
      })
    },
    get completedTrip() {
      return this.sectionedNonEmptyTrip
        .map(({title, data}) => {
          return {
            title,
            data: data.filter(item => !!item.completeDateISOString),
          }
        })
        .filter(({data}) => data.length > 0)
    },
    /*
     * Delete Todo
     */
    get deleteFlaggedCompletedTrip() {
      return this.completedTrip.map(({title, data}) => {
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
      return this.incompleteTrip.map(({title, data}) => {
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
        // const addedItemIds = addedItems?.map(item => item.id) as string[]
        return {
          category,
          title: CATEGORY_TO_TITLE[category],
          data: [
            ...((addedItems?.map(item => ({
              todo: item,
            })) as {todo?: Todo; preset?: TodoPreset}[]) || []),
            ...(store.preset.get(category)?.map(preset => ({
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
          const intervalDays = eachDayOfInterval({start, end}).slice(0, -1)
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
      //   await store.patch()
    },
    async completeAndPatchTodo(todo: Todo) {
      todo.complete()
      store.patchTodo(todo).then(todo => {
        if (todo) {
          if (todo.type == 'flight')
            store.createCustomTodo({
              ...todo,
              type: 'flightTicket',
            })
        }
      })
    },
    async deleteTodos() {
      await Promise.all(
        Array.from(store.todoMap.values())
          .filter(item => item.isFlaggedToDelete)
          .map(store.deleteTodo),
      )
    },
    async addFlaggedPreset() {
      await Promise.all(
        (Array.from(store.preset.values()).flat() as TodoPreset[])
          .filter(preset => preset.isFlaggedToAdd)
          .map(async preset => {
            store.addTodo({
              content: preset.todoContent,
              isPreset: true,
            })
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
