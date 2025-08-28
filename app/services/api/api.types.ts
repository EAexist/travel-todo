import {AccomodationSnapshotIn} from '@/models/Accomodation'
import {DestinationSnapshotIn} from '@/models/Destination'
import {PresetTodoContentSnapshotIn, Todo, TodoSnapshotIn} from '@/models/Todo'
import {
  TripStoreSnapshot,
  Preset,
  TripStore,
  PresetSnapshotIn,
} from '@/models/stores/TripStore'
import {UserStoreSnapshot} from '@/models/stores/UserStore'
import {User} from '@react-native-google-signin/google-signin'
import {ApisauceConfig} from 'apisauce'
import {getSnapshot} from 'mobx-state-tree'

/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */

// export interface EpisodeItem {
//   title: string
//   pubDate: string
//   link: string
//   guid: string
//   author: string
//   thumbnail: string
//   description: string
//   content: string
//   enclosure: {
//     link: string
//     type: string
//     length: number
//     duration: number
//     rating: {scheme: string; value: string}
//   }
//   categories: string[]
// }

// export interface ApiFeedResponse {
//   status: string
//   feed: {
//     url: string
//     title: string
//     link: string
//     author: string
//     description: string
//     image: string
//   }
//   items: EpisodeItem[]
// }
// export type GoogleUserDTO = Omit<User, 'scopes' | 'serverAuthCode'>


export type GoogleUserDTO = User['user']

export interface DestinationDTO extends Omit<DestinationSnapshotIn, 'id'> {
  id?: number
}

export interface UserAccountDTO extends Omit<UserStoreSnapshot, 'id' | 'trip'> {
  id?: number
  trip: number[]
}

export const mapToUserAccount: (
  userAccountDTO: UserAccountDTO,
) => UserStoreSnapshot = userAccountDTO => {
  if (userAccountDTO.id)
    return {
      ...userAccountDTO,
      id: userAccountDTO.id?.toString(),
      trip: userAccountDTO.trip.map(trip => trip.toString()),
    }
  else throw Error
}

export const mapToDestinationDTO: (
  destination: DestinationSnapshotIn,
) => DestinationDTO = destination => ({
  ...destination,
  id: destination.id ? Number(destination.id) : undefined,
})

export const mapToDestination: (
  destination: DestinationDTO,
) => DestinationSnapshotIn = destination => {
  if (destination.id)
    return {
      ...destination,
      id: destination.id?.toString(),
    }
  else throw Error
}

export interface TodoDTO
  extends Omit<TodoSnapshotIn, 'id' | 'isFlaggedToDelete'> {
  id?: number
}

export interface CreateTodoDTO extends Omit<TodoDTO, 'id'> {
  tripId: number
}

export const mapToTodoDTO: (
  todo: TodoSnapshotIn,
  //   orderKey?: number,
  //   trip_id?: number,
) => TodoDTO = todo => ({
  ...todo,
  id: todo.id ? Number(todo.id) : undefined,
  //   isPreset: false,
  //   orderKey: orderKey,
  //   trip_id: trip_id,
})

export const mapToTodo: (todo: TodoDTO) => Partial<TodoSnapshotIn> = todo => ({
  ...todo,
  id: todo.id?.toString(),
  title: todo.title || '',
  note: todo.note || '',
  icon: todo.icon || '',
  isFlaggedToDelete: false,
})

export interface TripDTO
  extends Omit<
    TripStoreSnapshot,
    'id' | 'todoMap' | 'todolist' | 'accomodation' | 'destination'
  > {
  id: number
  todolist: TodoDTO[]
  accomodation: AccomodationSnapshotIn[]
  destination: DestinationDTO[]
}

export const mapToTripDTO: (trip: TripStore) => TripDTO = trip => ({
  ...getSnapshot(trip),
  id: Number(trip.id),
  todolist: Array.from(trip.todolist.values())
    .map(todolist => {
      return todolist.map((todo, index) =>
        mapToTodoDTO(trip.todoMap.get(todo.id) as TodoSnapshotIn),
      )
    })
    .flat(),
  accomodation: Array.from(trip.accomodation.values()),
  destination: trip.destination.map(dest => mapToDestinationDTO(dest)),
})

export const mapToTrip: (tripDTO: TripDTO) => TripStoreSnapshot = tripDTO => {
  const categories = [...new Set(tripDTO.todolist.map(todo => todo.category))]
  return {
    ...tripDTO,
    id: tripDTO.id.toString(),
    title: tripDTO.title || '',
    todoMap: tripDTO.todolist.reduce((acc: {[key: string]: any}, todoDTO) => {
      if (todoDTO.id) acc[todoDTO.id?.toString()] = mapToTodo(todoDTO)
      return acc
    }, {}),
    todolist: categories.reduce((acc: {[key: string]: any}, category) => {
      acc[category] = tripDTO.todolist
        .filter(todo => todo.category === category)
        .toSorted((a, b) => (a.orderKey as number) - (b.orderKey as number))
        .map(todo => todo.id?.toString())
      return acc
    }, {}),
    accomodation: tripDTO.accomodation.reduce(
      (acc: {[key: string]: any}, accomodation) => {
        acc[accomodation.id.toString()] = accomodation
        return acc
      },
      {},
    ),
    destination: tripDTO.destination
      .filter(dest => dest.id != undefined)
      .map(dest => mapToDestination(dest)),
  }
}

export const mapToPreset: (preset: PresetDTO) => PresetSnapshotIn = preset => ({
  ...preset,
  todo: {
    ...preset.todo,
    id: preset.todo.id.toString(),
  },
})

export type WithStatus<T> = T & {
  status: string
}

export interface PresetDTO extends Omit<PresetSnapshotIn, 'todo'> {
  todo: PresetTodoConentDTO
}

export interface PresetTodoConentDTO
  extends Omit<PresetTodoContentSnapshotIn, 'id'> {
  id: number
}

export interface ApiPresetResponse {
  preset: PresetDTO[]
  status: string
}

export interface ApiAccomodationResponse {
  //  Omit<TripStoreSnapshot, 'startDate' | 'endDate'> {
  status: string
  items: (Omit<
    AccomodationSnapshotIn,
    | 'checkinDateISOString'
    | 'checkoutDateISOString'
    | 'checkinStartTimeISOString'
    | 'checkinEndTimeISOString'
    | 'checkoutTimeISOString'
  > & {
    checkinDate: string
    checkoutDate: string
    checkinStartTime: string
    checkinEndTime: string
    checkoutTime: string
  })[]
  // startDate: string
  // endDate: string
}
/**
 * The options used to configure apisauce.
 */
export interface ApiConfig extends ApisauceConfig {
  //   /**
  //    * The URL of the api.
  //    */
  //   url: string
  //   /**
  //    * Milliseconds before we timeout the request.
  //    */
  //   timeout: number
}
