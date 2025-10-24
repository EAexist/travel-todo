import { mapToTodoPatchDTO, PatchTodoProps, TodoPatchDTO } from '@/services/api'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import {
    flow,
    getSnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { createEnumType } from './helpers/createEnumtype'
import { wait } from './helpers/wait'
import { withSetPropAction } from './helpers/withSetPropAction'
import { Icon, IconModel } from './Icon'

export type TodoCategory =
    | 'TODO'
    | 'RESERVATION'
    | 'FOREIGN'
    | 'GOODS'
    | 'WASH'
    | 'ELECTRONICS'
    | 'CLOTHING'

export const TODO_CATEGORY_TO_TITLE: { [key: string]: string } = {
    TODO: '기타',
    RESERVATION: '예약',
    FOREIGN: '해외',
    WASH: '세면도구',
    ELECTRONICS: '전자기기',
    CLOTHING: '옷',
    GOODS: '기타',
}

export interface Location {
    name: string
    title: string
    iso2DigitNationCode: string
    region?: string
    iataCode?: string
}

export interface LocationPair {
    departure: Location
    arrival: Location
}

export const LocationModel = types.model('Location').props({
    name: types.string,
    title: types.string,
    iso2DigitNationCode: types.string,
    region: types.maybe(types.string),
    iataCode: types.maybe(types.string),
})

export const AirportModel = types.model('Airport').props({
    airportName: types.string,
    cityName: types.string,
    iso2DigitNationCode: types.string,
    iataCode: types.string,
})

export interface Airport {
    iataCode: string
    airportName: string
    cityName: string
    iso2DigitNationCode: string
}

export interface Airline {
    iataCode: string
    title: string
}

export interface ReservationLink {
    name: string
    title: string
    subtitle: string
    href: string
}

export interface FlightRoute {
    departureAirport: Airport
    arrivalAirport: Airport
    airlines: Airline[]
    reservationLinks: ReservationLink[]
}

export interface Flight {
    departure: Airport
    arrival: Airport
}

export const FlightModel = types.model('Flight').props({
    departure: AirportModel,
    arrival: AirportModel,
})

export const isCategoryTodo = (category: TodoCategory) =>
    category === 'TODO' || category === 'RESERVATION' || category === 'FOREIGN'

/**
 * PresetTodo
 */
export const TodoContentModel = types
    .model('TodoContent')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        category: createEnumType<TodoCategory>('TodoCategory'),
        type: types.maybeNull(types.string),
        title: types.string,
        icon: IconModel,
        isStock: types.optional(types.boolean, false),
    })
    .actions(withSetPropAction)
    .views(item => ({
        get isTodo() {
            return isCategoryTodo(item.category)
        },
    }))

export interface TodoContent extends Instance<typeof TodoContentModel> {}
export interface TodoContentSnapshotOut
    extends SnapshotOut<typeof TodoContentModel> {}
export interface TodoContentSnapshotIn
    extends SnapshotIn<typeof TodoContentModel> {}

// export const PresetTodoContentModel = types.model('PresetTodoContent').props({
//   id: types.identifier,
//   category: types.string,
//   type: types.string,
//   title: types.string,
//   icon: IconModel,
// })

export const PresetTodoContentModel = TodoContentModel.named(
    'PresetTodoContent',
)
    .props({
        id: types.string,
    })
    .actions(withSetPropAction)

/**
 * TodoPresetItem
 */
export const TodoPresetItemModel = types
    .model('Preset')
    .props({
        isFlaggedToAdd: types.boolean,
        todoContent: PresetTodoContentModel,
    })
    .actions(withSetPropAction)
    .actions(presetItem => ({
        toggleAddFlag() {
            presetItem.setProp('isFlaggedToAdd', !presetItem.isFlaggedToAdd)
        },
    }))

export interface TodoPresetItem extends Instance<typeof TodoPresetItemModel> {}
export interface TodoPresetItemSnapshotIn
    extends SnapshotOut<typeof TodoPresetItemModel> {}

/**
 * Todo
 */
export const TodoModel = types
    .model('Todo')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        note: types.optional(types.string, ''),
        completeDateIsoString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
        isFlaggedToDelete: false,
        orderKey: types.optional(types.number, 0),
        content: TodoContentModel,
    })
    .actions(withSetPropAction)
    .views(item => ({
        get category() {
            return item.content.category
            //       return item.presetTodoContent !== null
            // ? item.presetTodoContent.category
            // : item.customTodoContent?.category
        },
        get type() {
            return item.content.type
            //   return item.presetTodoContent !== null
            //     ? item.presetTodoContent.type
            //     : item.customTodoContent?.type
        },
        get title() {
            return item.content.title
            //   return item.presetTodoContent !== null
            //     ? item.presetTodoContent.title
            //     : item.customTodoContent?.title
        },
        get icon() {
            return item.content.icon
            //   return item.presetTodoContent !== null
            //     ? item.presetTodoContent.icon
            //     : item.customTodoContent?.icon
        },
    }))
    .views(item => ({
        get categoryTitle() {
            return TODO_CATEGORY_TO_TITLE[item.category]
        },
        get isCompleted() {
            return item.completeDateIsoString !== ''
        },
    }))
    .actions(item => ({
        setTitle(title: string) {
            item.content.setProp('title', title)
        },
        setIcon(icon: Icon) {
            item.content.setProp('icon', icon)
        },
        setCategory(category: TodoCategory) {
            item.content.setProp('category', category)
        },
        patch(todoDTO?: Partial<TodoSnapshotIn>) {
            enqueueAction(APIAction.PATCH_TODO, {
                todoDTO: mapToTodoPatchDTO(
                    todoDTO
                        ? {
                              id: item.id,
                              ...todoDTO,
                          }
                        : getSnapshot(item),
                ),
            })
        },
    }))
    .actions(item => ({
        toggleIsCompleted() {
            if (!item.isCompleted) {
                item.setProp('completeDateIsoString', new Date().toISOString())
            } else {
                item.setProp('completeDateIsoString', null)
            }
            item.patch({
                completeDateIsoString: item.completeDateIsoString,
            })
        },
    }))
    .actions(item => ({
        toggleIsCompletedDelayed: flow(function* () {
            yield wait()
            item.toggleIsCompleted()
        }),
        toggleDeleteFlag() {
            item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
        },
    }))
    .views(item => ({
        get categoryTitle() {
            return TODO_CATEGORY_TO_TITLE[item.category]
        },
        get isCompleted() {
            //   return item.completeDateIsoString !== ''
            return item.completeDateIsoString !== null
        },
        get parsedTitleAndSubtitle() {
            const defaultValue = { title: item.title?.trim(), subtitle: '' }

            if (!defaultValue.title) return defaultValue

            const titleMatches = defaultValue.title.match(
                /^(RNR.*\d)(?: - )(.*$)/,
            )

            if (!titleMatches || titleMatches.length !== 3) return defaultValue

            return { title: titleMatches[1], subtitle: titleMatches[2] }
        },
    }))

export const FlightTodoModel = types.compose(
    'FlightTodo',
    TodoModel,
    types
        .model({
            isRouteFixed: types.boolean,
            departure: types.maybeNull(LocationModel),
            arrival: types.maybeNull(LocationModel),
        })
        .views(item => ({
            get flightTitle() {
                return item.departure
                    ? `${item.departure?.title} → ${item.arrival?.title || '목적지'}`
                    : ''
            },
            get flightTitleWithCode() {
                return item.departure
                    ? `${item.departure?.title}${item.departure?.iataCode ? ` (${item.departure?.iataCode})` : ''} → ${item.arrival?.title || '목적지'}${item.arrival?.iataCode ? ` (${item.arrival?.iataCode})` : ''}`
                    : ''
            },
        }))
        .actions(withSetPropAction)
        .actions(item => ({
            setDeparture(departure: Location) {
                item.setProp('departure', departure)
                //   item.setProp('title', item.flightTitle)
            },
            setArrival(arrival: Location) {
                item.setProp('arrival', arrival)
                //   item.setProp('title', item.flightTitle)
            },
        })),
)

export interface Todo extends Instance<typeof TodoModel> {}
export interface TodoSnapshotOut extends SnapshotOut<typeof TodoModel> {}
export interface TodoSnapshotIn extends SnapshotIn<typeof TodoModel> {}

export interface FlightTodo extends Instance<typeof FlightTodoModel> {}
export interface FlightTodoSnapshotOut
    extends SnapshotOut<typeof FlightTodoModel> {}
export interface FlightTodoSnapshotIn
    extends SnapshotIn<typeof FlightTodoModel> {}
