import {
    Destination,
    DestinationContent,
    DestinationModel,
    DestinationSnapshotIn,
} from '@/models/Destination'
import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
    Todo,
    TODO_CATEGORY_TO_TITLE,
    TodoContent,
    TodoContentModel,
    TodoContentSnapshotIn,
    TodoModel,
    TodoPresetItem,
    TodoPresetItemModel,
    TodoSnapshotIn,
} from '@/models/Todo'
import {
    api,
    CreateReservationProps,
    CreateTodoProps,
    DeleteDestinationProps,
    DeleteTodoProps,
    mapToTodoDTO,
    TodoDTO,
    TripDTO,
} from '@/services/api'
import { APIAction, sync_db, enqueueAction } from '@/tasks/BackgroundTask'
import { differenceInDays, isAfter, startOfDay } from 'date-fns'
import { getSnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { ReservationStoreModel } from './ReservationStore'
import { DotIcon } from 'lucide-react-native'
import { Icon } from '../Icon'
import {
    ReservationCategory,
    ReservationModel,
} from '../Reservation/Reservation'

export const TripSummaryModel = types
    .model('TripSummary')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        createDateIsoString: types.optional(
            types.string,
            new Date().toISOString(),
        ),
        isInitialized: types.boolean,
        title: types.maybeNull(types.string),
        startDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
        endDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
        destination: types.array(types.string),
    })
    .views(store => ({
        get scheduleText() {
            return `${store.startDateIsoString ? `${new Date(store.startDateIsoString).toLocaleDateString()} -` : ''}${store.endDateIsoString ? ` ${new Date(store.endDateIsoString).toLocaleDateString()}` : ''}`
        },
        get isCompleted() {
            return (
                store.endDateIsoString &&
                isAfter(
                    startOfDay(new Date()),
                    startOfDay(new Date(store.endDateIsoString)),
                )
            )
        },
    }))

export interface TripSummary extends Instance<typeof TripSummaryModel> {}

export const TripStoreModel = types
    .model('TripStore')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        isInitialized: types.optional(types.boolean, false),
        title: types.maybeNull(types.string),
        startDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
        endDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
        destination: types.array(DestinationModel),
        todoMap: types.map(TodoModel),
        todolist: types.optional(
            types.map(types.array(types.reference(TodoModel))),
            {
                reservation: [],
                foreign: [],
                goods: [],
            },
        ),
        customTodoContent: types.array(TodoContentModel),
        activeItem: types.maybeNull(types.reference(TodoModel)),
        preset: types.map(types.array(TodoPresetItemModel)),
        isTripMode: types.optional(types.boolean, false),
        reservationStore: types.optional(ReservationStoreModel, {}),
    })
    .actions(withSetPropAction)
    .actions(store => ({
        syncOrderInCategory(category: string) {
            store.todolist
                .get(category)
                ?.sort((a, b) => a.orderKey - b.orderKey)
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
        createCustomReservation(category?: ReservationCategory) {
            const reservation = store.reservationStore.addReservation(
                ReservationModel.create({
                    category: 'GENERAL',
                    generalReservation: {
                        title: '새 예약',
                    },
                }),
            )
            if (category) {
                reservation.setCategory(category)
            }
            enqueueAction(APIAction.CREATE_RESERVATION, {
                tripId: store.id,
                reservationDTO: reservation,
            } as CreateReservationProps)

            return reservation
        },
        async createReservationFromText(text: string) {
            store.reservationStore.clearConfirmRequiringList()
            return api
                .createReservationFromText(store.id, text)
                .then(response => {
                    if (response.kind === 'ok') {
                        console.log(response.data)
                        response.data.forEach(reservation => {
                            store.reservationStore.addConfirmRequiringList(
                                store.reservationStore.addReservation(
                                    ReservationModel.create(reservation),
                                ),
                            )
                        })
                    }
                    return response
                })
        },
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
            store.setProp('todolist', {
                reservation: [],
                foreign: [],
                goods: [],
            })
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
            await sync_db()
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
        // async fetchRecommendedFlight() {
        //   console.log('[fetchRecommendedFlight]')
        //   api.getRecommendedFlight(store.id).then(response => {
        //     if (response.kind == 'ok') {
        //       store.setProp('recommendedFlight', response.data)
        //       console.log(`[fetchRecommendedFlight] data=${response.data}`)
        //     }
        //   })
        // },
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
        // async patchToServer(tripDTO: TripDTO) {
        //     api.patchTrip(tripDTO).then(response => {
        //         return response.kind
        //         // if (response.kind === 'ok') {
        //         // }
        //     })
        // },
        /**
         * Patch(update) a trip.
         * @TODO use only changed sub-data as payload, instead of full store
         */
        patch(tripDTO: Partial<TripDTO>) {
            console.log('[Tripstore.patch]')
            enqueueAction(APIAction.PATCH_TRIP, {
                ...tripDTO,
                id: store.id,
            } as TripDTO)
        },

        /**
         * Todo CRUD Actions
         */
        /**
         * Create an empty todo and fetch it with backend-generated id.
         */
        createCustomTodo(category: string, type: string) {
            let title: string
            let icon: Icon
            switch (type) {
                case 'flight':
                    title = '항공권 예약'
                    icon = { name: '✈️', type: 'tossface' }
                    break
                case 'flightTicket':
                    title = '체크인'
                    icon = { name: '🛫', type: 'tossface' }
                    break
                default:
                    icon = { name: '⭐️', type: 'tossface' }
                    switch (category) {
                        case 'reservation':
                            title = '새 예약'
                            break
                        case 'goods':
                            title = '새 짐 챙기기'
                            break
                        default:
                            title = '새 할 일'
                            break
                    }
                    break
            }
            const createdTodo = store.addTodo(
                TodoModel.create({
                    content: TodoContentModel.create({
                        category,
                        type,
                        title: title,
                        icon: icon,
                    }),
                }),
            )
            enqueueAction(APIAction.CREATE_TODO, {
                tripId: store.id,
                todoDTO: mapToTodoDTO(createdTodo),
            } as CreateTodoProps)
            return createdTodo
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
        deleteDestination(destination: Destination) {
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
        // async createAccomodation() {
        //   store.accomodation.put(AccomodationModel.create())
        //   //   const response = await api.createAccomodation(store.id)
        //   //   if (response.kind === 'ok') {
        //   //     const accomodation = response.data as AccomodationSnapshotIn
        //   //     store.accomodation.put(accomodation)
        //   //   }
        // },
        // /**
        //  * Patch(update) a accomodation.
        //  */
        // async patchAccomodation(accomodation: AccomodationSnapshotIn) {
        //   store.accomodation.set((accomodation as Accomodation).id, accomodation)
        //   enqueueAction(APIAction.PATCH_ACCOMODATION, {
        //     tripId: store.id,
        //     accomodation: accomodation,
        //   } as CreateAccomodationProps)
        //   //   const response = await api.patchAccomodation(store.id, accomodation)
        //   //   if (response.kind === 'ok')
        //   //     store.accomodation.set(accomodation.id, accomodation)
        // },
        // /**
        //  * Delete a accomodation.
        //  */
        // async deleteAccomodation(accomodation: AccomodationSnapshotIn) {
        //   store.accomodation.delete((accomodation as Accomodation).id)
        //   enqueueAction(APIAction.DELETE_ACCOMODATION, {
        //     tripId: store.id,
        //     accomodationId: accomodation.id,
        //   } as DeleteAccomodationProps)
        //   //   api.deleteAccomodation(store.id, item.id).then(({kind}) => {
        //   //     if (kind == 'ok') {
        //   //       store.accomodation.delete(item.id)
        //   //     }
        //   //   })
        // },
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
            return store.startDateIsoString !== null
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
            return Array.from(store.todolist.entries()).map(
                ([category, data]) => ({
                    category,
                    title: TODO_CATEGORY_TO_TITLE[category],
                    data,
                }),
            )
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
                    ?.filter(item => item.content.isStock)
                    .map(item => item.content.id)
                // const addedItemIds = addedItems?.map(item => item.id) as string[]
                return {
                    category,
                    title: TODO_CATEGORY_TO_TITLE[category],
                    data: [
                        ...((addedItems?.map(item => ({
                            todo: item,
                        })) as { todo?: Todo; preset?: TodoPresetItem }[]) ||
                            []),
                        ...(store.preset
                            .get(category)
                            ?.filter(
                                preset =>
                                    !addedStockIds?.includes(
                                        preset.todoContent.id,
                                    ),
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
        get reservationTodoStatusText() {
            const todos = store.todolist
                .get('reservation')
                ?.filter(todo => todo.type !== 'accomodation')
            return `${todos?.filter(todo => todo.isCompleted).length}/${todos?.length}`
        },
        get accomodationTodoStatusText() {
            return store.endDate && store.startDate
                ? `${store.reservationStore.reservedNights}박/${differenceInDays(startOfDay(store.endDate), startOfDay(store?.startDate))}박`
                : null
        },
        get foreignTodoStatusText() {
            const todos = store.todolist.get('foreign')
            return `${todos?.filter(todo => todo.isCompleted).length}/${todos?.length}`
        },
        get goodsTodoStatusText() {
            const todos = store.todolist.get('goods')
            return `${todos?.filter(todo => todo.isCompleted).length}/${todos?.length}`
        },
    }))
    .actions(store => ({
        toggleTripMode() {
            store.setProp('isTripMode', !store.isTripMode)
            store.patch({
                isTripMode: store.isTripMode,
            })
        },
        initialize() {
            store.setProp('isInitialized', true)
            store.patch({
                isInitialized: store.isInitialized,
            })
        },
        completeAndPatchTodo(todo: Todo) {
            todo.complete()
            todo.patch({
                completeDateIsoString: todo.completeDateIsoString,
            })
            if (todo.type == 'flight') {
                const newTodo = store.createCustomTodo(
                    'reservation',
                    'flightTicket',
                )
                newTodo.setTitle(todo.title)
                newTodo.patch()
            }
        },
        deleteTodos() {
            Array.from(store.todoMap.values())
                .filter(item => item.isFlaggedToDelete)
                .forEach(item => store.deleteTodo(item))
        },
        addFlaggedPreset() {
            ;(Array.from(store.preset.values()).flat() as TodoPresetItem[])
                .filter(preset => preset.isFlaggedToAdd)
                .forEach(preset => {
                    const todo = store.addTodo(
                        TodoModel.create({
                            content: TodoContentModel.create(
                                getSnapshot(preset.todoContent),
                            ),
                        }),
                    )
                    enqueueAction(APIAction.CREATE_TODO, {
                        tripId: store.id,
                        todoDTO: mapToTodoDTO(todo),
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
                })
            store.syncOrder()
        },
        async reorder(category: string, keyToIndex: Record<string, number>) {
            await Promise.all(
                Object.entries(keyToIndex).map(([todoId, index]) => {
                    const todo = store.todoMap.get(todoId) as Todo
                    todo.setProp('orderKey', index)
                    todo.patch()
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
