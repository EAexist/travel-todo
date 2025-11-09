import { TodolistSectionT } from '@/components/TodoList'
import {
    Destination,
    DestinationCreateDTO,
    DestinationModel,
    DestinationSnapshotIn,
} from '@/models/Destination'
import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
    isSupplyCategory,
    Todo,
    TODO_CATEGORY_TO_ICON,
    TODO_CATEGORY_TO_TITLE,
    TodoCategory,
    todoCategoryList,
    TodoContentModel,
    TodoModel,
    TodoPresetItem,
    TodoPresetItemModel,
} from '@/models/Todo'
import {
    api,
    CreateTodoProps,
    DeleteDestinationProps,
    DeleteTodoProps,
    mapToReservationPatchDTO,
    mapToTodoPatchDTO,
    mapToTripPatchDTO,
} from '@/services/api'
import { APIAction, enqueueAction, sync_db } from '@/tasks/BackgroundTask'
import { differenceInDays, isAfter, startOfDay } from 'date-fns'
import {
    applySnapshot,
    getSnapshot,
    Instance,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import { SectionListData } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '../Icon'
import {
    ReservationCategory,
    ReservationModel,
} from '../Reservation/Reservation'
import { ReservationStoreModel } from './ReservationStore'
import { TripSettingsModel } from './TripSettings'

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
        destinationTitles: types.array(types.string),
        isSample: types.optional(types.boolean, false),
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
        destinations: types.array(DestinationModel),
        todoMap: types.map(TodoModel),
        customTodoContent: types.array(TodoContentModel),
        activeItem: types.maybeNull(types.reference(TodoModel)),
        todoPreset: types.array(TodoPresetItemModel),
        reservationStore: types.optional(ReservationStoreModel, {}),
        settings: types.optional(TripSettingsModel, () =>
            TripSettingsModel.create(),
        ),
    })
    .actions(withSetPropAction)
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
                reservationDTO: mapToReservationPatchDTO(reservation),
            })

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
        // createCustomTodoContent(todoContent: TodoContent) {
        //     let title = ''
        //     let icon = {}

        //     switch (todoContent.category) {
        //         case 'RESERVATION':
        //             title = '새 예약'
        //             icon = { name: '🎫', type: 'tossface' }
        //             break
        //         case 'FOREIGN':
        //             title = '새 할 일'
        //             icon = { name: '⭐️', type: 'tossface' }
        //             break
        //         case 'SUPPLY':
        //             title = '새 짐'
        //             icon = { name: '🧳', type: 'tossface' }
        //             break
        //         default:
        //             break
        //     }

        //     const newTodoContent = TodoContentModel.create({
        //         ...todoContent,
        //         title: todoContent.title || title,
        //         icon: todoContent.icon || icon,
        //     })
        //     store.customTodoContent.push(newTodoContent)
        //     return newTodoContent
        // },
        addTodo(todo: Todo) {
            store.todoMap.put(todo)
            return todo
        },
        set(trip: TripStoreSnapshot) {
            console.log('[Tripstore.set]')
            store.setProp('id', trip.id)
            store.setProp('title', trip.title)
            store.setProp('destinations', trip.destinations)
            store.setProp('startDateIsoString', trip.startDateIsoString)
            store.setProp('endDateIsoString', trip.endDateIsoString)
            store.setProp('todoMap', trip.todoMap)
            /* Nested Object: UseSetProps */
            store.setProp('todoPreset', trip.todoPreset)
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
            store.todoMap.delete(todo.id)
        },
        _deleteDestination(destination: Destination) {
            store.destinations.remove(destination)
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
        //       Array.from(store.todoPreset.entries())
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
            store.destinations.push(destination)
        },
        addDestinations(destinations: Destination[]) {
            store.destinations.clear()
            store.destinations.push(...destinations)
        },
    }))
    .actions(store => ({
        /*
         * Backend API calls
         */
        async fetchTodoPreset() {
            console.log('[Tripstore.fetchTodoPreset]')
            await sync_db()
            return api.getTodoPreset(store.id).then(response => {
                if (response.kind == 'ok') {
                    applySnapshot(store.todoPreset, response.data)
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
        async createDestination(destinationCreateDTO: DestinationCreateDTO) {
            return api
                .createDestination({
                    tripId: store.id,
                    destinationDTO: destinationCreateDTO,
                })
                .then(response => {
                    if (response.kind === 'ok') {
                        return api.getDestinations(store.id).then(response => {
                            if (response.kind === 'ok') {
                                store.addDestinations(response.data)
                            }
                        })
                    } else return
                })
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
        patch(tripDTO: Partial<TripStoreSnapshot>) {
            console.log('[Tripstore.patch]')
            enqueueAction(
                APIAction.PATCH_TRIP,
                mapToTripPatchDTO({
                    ...tripDTO,
                    id: store.id,
                }),
            )
        },

        /**
         * Todo CRUD Actions
         */
        /**
         * Create an empty todo and fetch it with backend-generated id.
         */
        createCustomTodo(category: TodoCategory, type: string) {
            let title: string
            let icon: Icon = TODO_CATEGORY_TO_ICON[category]
            switch (type) {
                case 'FLIGHT_TICKET':
                    title = '탑승 수속'
                    break
                default:
                    switch (category) {
                        case 'RESERVATION':
                            title = '새 예약'
                            break
                        case 'SUPPLY':
                            title = '새 짐 준비'
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
                todoDTO: mapToTodoPatchDTO(createdTodo),
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
        deleteTodo(todoId: string) {
            store.todoMap.delete(todoId)
            enqueueAction(APIAction.DELETE_TODO, {
                tripId: store.id,
                todoId: todoId,
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
         * Delete a destinations.
         */
        deleteDestination(destination: Destination) {
            const destinationId = destination.id
            store.destinations.remove(destination)

            enqueueAction(APIAction.DELETE_DESTINATION, {
                tripId: store.id,
                destinationId,
            } as DeleteDestinationProps)

            //   api.deleteDestination(store.id, destinations.id).then(({kind}) => {
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
            return store.endDateIsoString !== null
        },
        get isDestinationSet() {
            return store.destinations.length > 0
        },
        get destinationTitles() {
            return store.destinations.map(item => item.title)
            // return store.destinations.map((item) => item.title).join(', ')
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
        get isActive() {
            return store.activeItem !== null
        },
    }))
    .views(store => ({
        /*
         * Presets
         */
        get numOfAddFlags() {
            return store.todoPreset.filter(preset => preset.isFlaggedToAdd)
                .length
        },
        get numOfWorkToAdd() {
            return store.todoPreset.filter(
                ({ isFlaggedToAdd, content }) =>
                    isFlaggedToAdd && !content.isSupply,
            ).length
        },
        get numOfSupplyToAdd() {
            return store.todoPreset.filter(
                ({ isFlaggedToAdd, content }) =>
                    isFlaggedToAdd && content.isSupply,
            ).length
        },
        /*
         * Todos
         */
        get todos() {
            return [...store.todoMap.values()]
        },
        get numOfTodo() {
            return store.todoMap.size
            // return store.destinations.map((item) => item.title).join(', ')
        },
        get numOfIncompleteTodo() {
            return this.todos.filter(item => !item.isCompleted).length
            // return store.destinations.map((item) => item.title).join(', ')
        },
        // get nonEmptysections() {
        //     return Array.from(store.todolist.entries())
        //         .filter(([category, data]) => data.length > 0)
        //         .map(([category, _]) => ({
        //             category,
        //             title: TODO_CATEGORY_TO_TITLE[category],
        //             data: [category],
        //         }))
        // },
        // get sections() {
        //     return ['RESERVATION', 'FOREIGN', 'SUPPLY']
        // },
        // get sectionedTrip() {
        //     return Array.from(store.todolist.entries()).map(
        //         ([category, data]) => ({
        //             category,
        //             title: TODO_CATEGORY_TO_TITLE[category],
        //             data,
        //         }),
        //     )
        // },
        get allTodolistSectionListDataUnsorted(): SectionListData<
            Todo,
            TodolistSectionT
        >[] {
            return todoCategoryList
                .map(category => ({
                    category: category,
                    data: this.todos
                        .filter(todo => todo.category === category)
                        .sort((a, b) => a.orderKey - b.orderKey),
                }))
                .filter(({ data }) => data.length > 0)
                .sort(
                    (
                        { category: categoryA, data: dataA },
                        { category: categoryB, data: dataB },
                    ) => {
                        if (
                            dataA.filter(todo => !todo.isCompleted).length ==
                                0 &&
                            dataB.filter(todo => !todo.isCompleted).length > 0
                        ) {
                            return 1
                        } else if (
                            dataA.filter(todo => !todo.isCompleted).length >
                                0 &&
                            dataB.filter(todo => !todo.isCompleted).length == 0
                        ) {
                            return -1
                        } else {
                            return (
                                (store.settings.categoryKeyToIndex.get(
                                    categoryA,
                                ) || -1) -
                                (store.settings.categoryKeyToIndex.get(
                                    categoryB,
                                ) || -1)
                            )
                        }
                    },
                )
                .map(({ category, data }) => {
                    return {
                        category,
                        title: TODO_CATEGORY_TO_TITLE[category],
                        data,
                    }
                })
        },
        get allTodolistSectionListData() {
            return this.allTodolistSectionListDataUnsorted.map(
                ({ data, ...section }) => {
                    return {
                        ...section,
                        data: [...data].sort((todoA, todoB) => {
                            if (todoA.isCompleted && !todoB.isCompleted) {
                                return 1
                            }
                            if (!todoA.isCompleted && todoB.isCompleted) {
                                return -1
                            }
                            return 0
                        }),
                    }
                },
            )
        },
        get incompleteTodolistSectionListData() {
            return this.allTodolistSectionListDataUnsorted
                .map(({ data, ...section }) => ({
                    ...section,
                    data: data.filter(todo => !todo.isCompleted),
                }))
                .filter(({ data }) => data.length > 0)
        },
        // get completedTodolistSectionListData() {
        //     return store.allTodolistSectionListDataUnsorted.map(
        //         ({ data, ...section }) => ({
        //             ...section,
        //             data: data.filter(todo => todo.isCompleted),
        //         }),
        //     )
        // },
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
        get hasAccomodationTodo() {
            return this.todos.some(item => item.type === 'ACCOMODATION')
        },
        get accomodationTodoStatusText() {
            return store.endDate && store.startDate
                ? `${store.reservationStore.reservedNights}박 / ${differenceInDays(startOfDay(store.endDate), startOfDay(store?.startDate))}박`
                : `${store.reservationStore.reservedNights}박 예약 완료`
        },
        get workTodoStatusText() {
            const todos = this.todos.filter(
                todo => !isSupplyCategory(todo.category),
            )
            return `${todos?.filter(todo => todo.isCompleted).length} / ${todos?.length}`
        },
        get supplyTodoStatusText() {
            const todos = this.todos.filter(todo =>
                isSupplyCategory(todo.category),
            )
            return `${todos?.filter(todo => todo.isCompleted).length} / ${todos?.length}`
        },
        get todosWithPreset() {
            const addedStockIds = this.todos
                ?.filter(
                    item =>
                        item.content.isStock ||
                        item.content.type === 'FLIGHT_OUTBOUND' ||
                        item.content.type === 'FLIGHT_RETURN',
                )
                .map(item => item.content.id)

            const todos =
                this.todos?.map(item => ({
                    todo: item,
                })) || []
            const todoPreset =
                store.todoPreset
                    ?.filter(
                        preset => !addedStockIds?.includes(preset.content.id),
                    )
                    .map(preset => ({
                        preset,
                    })) || []

            return todoCategoryList.map(category => ({
                category: category,
                title: TODO_CATEGORY_TO_TITLE[category],
                data: [
                    ...todos.filter(({ todo }) => todo.category === category),
                    ...todoPreset.filter(
                        ({ preset }) => preset.content.category === category,
                    ),
                ] as { todo?: Todo; preset?: TodoPresetItem }[],
            }))
        },
        /*
         * Reservation
         */
        get reservationSections() {
            let data = store.settings.doSortReservationsByCategory
                ? store.reservationStore.sectionListDataSortedByCategory
                : store.reservationStore.sectionListDataSortedByDate

            if (store.settings.doHideCompletedReservation) {
                data = data.map(({ title, data }) => ({
                    title,
                    data: data.filter(r => !r.isCompleted),
                }))
            }
            return data.filter(({ title, data }) => data.length > 0)
        },
    }))
    .views(store => ({
        get todolistSectionListData() {
            return store.settings.doHideCompletedTodo
                ? store.incompleteTodolistSectionListData
                : store.allTodolistSectionListData
        },
        get incompleteTrip() {
            return this.todolistSectionListData.map(({ title, data }) => {
                return { title, data: data.filter(item => !item.isCompleted) }
            })
        },
        get completedTrip() {
            return this.todolistSectionListData
                .map(({ title, data }) => {
                    return {
                        title,
                        data: data.filter(item => item.isCompleted),
                    }
                })
                .filter(({ data }) => data.length > 0)
        },
    }))
    .views(store => ({
        get incompleteWorkTodolistSectionListData() {
            return store.incompleteTodolistSectionListData.filter(
                ({ category }) => !isSupplyCategory(category),
            )
        },
        get incompleteSupplyTodolistSectionListData() {
            return store.incompleteTodolistSectionListData.filter(
                ({ category }) => isSupplyCategory(category),
            )
        },
        get workTodolistSectionListData() {
            return store.todolistSectionListData.filter(
                ({ category }) => !isSupplyCategory(category),
            )
        },
        get supplyTodolistSectionListData() {
            return store.todolistSectionListData.filter(({ category }) =>
                isSupplyCategory(category),
            )
        },
        /*
         * Delete Todo
         */
        get deleteFlaggedTodolistSectionListData() {
            return store.todolistSectionListData
        },
    }))
    .actions(store => ({
        reorderTodoCategories(keyToIndex: Record<string, number>) {
            store.settings.setProp('categoryKeyToIndex', keyToIndex)
            store.patch({
                settings: getSnapshot(store.settings),
            })
        },
        toggleIsTripMode() {
            store.settings.setProp('isTripMode', !store.settings.isTripMode)
            store.patch({
                settings: getSnapshot(store.settings),
            })
        },
    }))
    .actions(store => ({
        initialize() {
            store.setProp('isInitialized', true)
            store.patch({
                isInitialized: store.isInitialized,
            })
        },
        completeAndPatchTodo(todo: Todo) {
            if (!todo.isCompleted) {
                todo.toggleIsCompleted()
                todo.patch({
                    completeDateIsoString: todo.completeDateIsoString,
                })
                if (
                    todo.type == 'FLIGHT_OUTBOUND' ||
                    todo.type == 'FLIGHT_RETURN'
                ) {
                    const newTodo = store.createCustomTodo(
                        'RESERVATION',
                        'FLIGHT_TICKET',
                    )
                    newTodo.content.setProp('subtitle', todo.content.subtitle)
                    applySnapshot(newTodo.content.icon, todo.content.icon)
                    // newTodo.content.setProp('icon', todo.content.icon)
                    newTodo.patch()
                }
            }
        },
        resetAddFlags() {
            store.todoPreset.forEach(preset => {
                preset.setProp('isFlaggedToAdd', false)
            })
        },
        addFlaggedPreset() {
            ;(store.todoPreset.flat() as TodoPresetItem[])
                .filter(preset => preset.isFlaggedToAdd)
                .forEach(preset => {
                    const todo = store.addTodo(
                        TodoModel.create({
                            content: TodoContentModel.create(
                                getSnapshot(preset.content),
                            ),
                        }),
                    )
                    enqueueAction(APIAction.CREATE_TODO, {
                        tripId: store.id,
                        todoDTO: mapToTodoPatchDTO(todo),
                    })
                    preset.setProp('isFlaggedToAdd', false)
                })
        },
        reorderTodos(keyToIndex: Record<string, number>) {
            Object.entries(keyToIndex).forEach(([todoId, index]) => {
                const todo = store.todoMap.get(todoId) as Todo
                todo.setProp('orderKey', index)
                todo.patch()
            })
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
