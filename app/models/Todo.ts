import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'
import {v4 as uuidv4} from 'uuid'

export const CATEGORY_TO_TITLE: {[key: string]: string} = {
  reservation: '예약',
  foreign: '해외여행',
  goods: '짐',
}

// export const defaultTodo : TodoModel = {
//   id: '',
//   type: '',
//   category: '',
//   title: '',
//   note: '',
//   completeDateISOString: null, // Ex: 2022-08-12 21:05:36
//   isFlaggedToDelete: false,
//   orderKey: -1,
//   presetId: -1,
// }

export interface Location {
  name: string
  title: string
  countryISO: string
  region?: string
  IATACode?: string
}

export interface LocationPair {
  departure: Location
  arrival: Location
}

export const LocationModel = types.model('Location').props({
  name: types.string,
  title: types.string,
  countryISO: types.string,
  region: types.maybe(types.string),
  IATACode: types.maybe(types.string),
})

export const AirportModel = types.model('Airport').props({
  airportName: types.string,
  cityName: types.string,
  ISONationCode2Digit: types.string,
  IATACode: types.string,
})

export interface Airport {
  IATACode: string
  airportName: string
  cityName: string
  ISONationCode2Digit: string
}

export interface Airline {
  IATACode: string
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

export const IconModel = types.model('Icon').props({
  name: types.string,
  type: types.optional(types.string, 'tossface'),
})

export interface Icon extends SnapshotOut<typeof IconModel> {}

/**
 * PresetTodo
 */
export const TodoContentModel = types
  .model('TodoContent')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    category: types.string,
    type: types.string,
    title: types.string,
    icon: IconModel,
  })
  .actions(withSetPropAction)

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

/**
 * TodoPresetItem
 */
export const TodoPresetItemModel = types
  .model('Preset')
  .props({
    isFlaggedToAdd: types.boolean,
    todoContent: TodoContentModel,
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
    // category: types.string,
    // type: types.string,
    // title: types.string,
    // icon: IconModel,
    note: types.optional(types.string, ''),
    completeDateISOString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    isFlaggedToDelete: false,
    orderKey: types.optional(types.number, 0),
    isPreset: types.optional(types.boolean, false),
    content: types.reference(TodoContentModel),
    // presetId: types.maybeNull(types.number),
    // customTodoContent: types.maybeNull(types.reference(TodoContentModel)),
    // presetTodoContent: types.maybeNull(types.reference(PresetTodoContentModel)),
  })
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
      return CATEGORY_TO_TITLE[item.category]
    },
    get isCompleted() {
      return item.completeDateISOString !== ''
    },
  }))
  .actions(withSetPropAction)
  .actions(item => ({
    setTitle(title: string) {
      item.content.setProp('title', title)
    },
    setIcon(icon: Icon) {
      item.content.setProp('icon', icon)
    },
    setCategory(category: string) {
      item.content.setProp('category', category)
    },
  }))
  .actions(item => ({
    complete() {
      item.setProp('completeDateISOString', new Date().toISOString())
    },
    setIncomplete() {
      //   item.setProp('completeDateISOString', '')
      item.setProp('completeDateISOString', null)
    },
    toggleDeleteFlag() {
      item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
    },
  }))
  .views(item => ({
    get categoryTitle() {
      return CATEGORY_TO_TITLE[item.category]
    },
    get isCompleted() {
      //   return item.completeDateISOString !== ''
      return item.completeDateISOString !== null
    },
    get parsedTitleAndSubtitle() {
      const defaultValue = {title: item.title?.trim(), subtitle: ''}

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return {title: titleMatches[1], subtitle: titleMatches[2]}
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
          ? `${item.departure?.title}${item.departure?.IATACode ? ` (${item.departure?.IATACode})` : ''} → ${item.arrival?.title || '목적지'}${item.arrival?.IATACode ? ` (${item.arrival?.IATACode})` : ''}`
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
