import { Accomodation, AccomodationSnapshotIn } from '@/models/Accomodation'
import { Destination, DestinationSnapshotIn } from '@/models/Destination'
import {
  Todo,
  TodoPresetItem,
  TodoPresetItemSnapshotIn,
  TodoSnapshotIn,
} from '@/models/Todo'
import { TripStore, TripStoreSnapshot } from '@/models/stores/TripStore'
import { UserStore, UserStoreSnapshot } from '@/models/stores/UserStore'
import { User } from '@react-native-google-signin/google-signin'
import { ApisauceConfig } from 'apisauce'
import { getSnapshot } from 'mobx-state-tree'

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

/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export type WithStatus<T> = T & {
  status: string
}

/*
 * DTO
 */

export type GoogleUserDTO = User['user']

export interface UserAccountDTO extends UserStoreSnapshot {}
// export interface UserAccountDTO extends Omit<UserStoreSnapshot, 'id'> {
//   id?: number
// }

export interface TripDTO
  extends Partial<
    Omit<
      TripStoreSnapshot,
      'id' | 'todoMap' | 'todolist' | 'accomodation' | 'destination'
    >
  > {
  id?: string
  todolist?: TodoDTO[]
  accomodation?: Accomodation[]
  destination?: DestinationDTO[]
}

export interface TodoDTO
  extends Partial<Omit<TodoSnapshotIn, 'id' | 'isFlaggedToDelete'>> {
  id?: string
}

// export interface CreateTodoDTO extends Omit<TodoDTO, 'id'> {
//   tripId: number
// }

// export interface DestinationDTO extends DestinationSnapshotIn {}
export interface DestinationDTO extends Omit<DestinationSnapshotIn, 'id'> {
  id?: string
}
export interface PresetDTO extends TodoPresetItemSnapshotIn {}
//   extends Omit<TodoPresetItemSnapshotIn, 'todoContent'> {
//   todoContent: PresetTodoContentDTO
// }

// export interface PresetTodoContentDTO extends TodoPresetItem {}
export interface PresetTodoContentDTO extends Omit<TodoPresetItem, 'id'> {
  id: string
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

/*
 * API Method Props
 */
// export interface PatchTripProps {
//   tripId: string
//   todo: TodoDTO
// }

export interface CreateTodoProps {
  tripId: string
  todoDTO: TodoDTO
}

export interface DeleteTodoProps {
  tripId: string
  todoId: string
}

export interface CreateDestinationProps {
  tripId: string
  destinationDTO: DestinationDTO
}

export interface DeleteDestinationProps {
  tripId: string
  destinationId: string
}

export interface CreateAccomodationProps {
  tripId: string
  accomodation: AccomodationSnapshotIn
}

export interface DeleteAccomodationProps {
  tripId: string
  accomodationId: string
}

/*
 * Mapper
 */

export const mapToUserAccount: (
  userAccountDTO: UserAccountDTO,
) => UserStoreSnapshot = userAccountDTO => {
  if (userAccountDTO.id)
    return {
      ...userAccountDTO,
      id: userAccountDTO.id?.toString(),
      //   trip: userAccountDTO.trip.map(trip => trip.toString()),
    } as UserStoreSnapshot
  else throw Error
}

export const mapToDestinationDTO: (
  destination: Destination,
) => DestinationDTO = destination => ({
  ...destination,
  //   id: destination.id ? Number(destination.id) : undefined,
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

export const mapToTodoDTO: (
  todo: Partial<Todo>,
  //   orderKey?: number,
  //   trip_id?: number,
) => TodoDTO = todo => ({
  ...todo,
  //   id: todo.id ? Number(todo.id) : undefined,
  //   isPreset: false,
  //   orderKey: orderKey,
  //   trip_id: trip_id,
})

export const mapToTodo: (todo: TodoDTO) => Partial<TodoSnapshotIn> = todo => ({
  ...todo,
  id: todo.id?.toString(),
  note: todo.note || '',
  isFlaggedToDelete: false,
})

export const mapToTripDTO: (
  trip: Partial<TripStore>,
) => Partial<TripDTO> = trip => ({
  ...getSnapshot(trip),
  //   id: Number(trip.id),
  todolist: trip.todolist?.values()
    ? Array.from(trip.todolist.values())
        .map(todolist => {
          return todolist.map((todo, index) =>
            mapToTodoDTO(trip.todoMap?.get(todo.id) as Todo),
          )
        })
        .flat()
    : undefined,
  accomodation: trip.accomodation?.values()
    ? Array.from(trip.accomodation.values())
    : undefined,
  destination: trip.destination?.map(dest => mapToDestinationDTO(dest)),
})

export const mapToTrip: (tripDTO: TripDTO) => TripStoreSnapshot = tripDTO => {
  const categories = [
    ...new Set(tripDTO.todolist.map(todo => todo.content?.category)),
  ].filter(c => c !== undefined)
  return {
    ...tripDTO,
    id: tripDTO.id?.toString(),
    // title: tripDTO.title || '',
    todoMap: tripDTO.todolist.reduce((acc: { [key: string]: any }, todoDTO) => {
      if (todoDTO.id) acc[todoDTO.id?.toString()] = mapToTodo(todoDTO)
      return acc
    }, {}),
    todolist: categories.reduce((acc: { [key: string]: any }, category) => {
      acc[category] = tripDTO.todolist
        .filter(todo => todo.content?.category === category)
        .toSorted((a, b) => (a.orderKey as number) - (b.orderKey as number))
        .map(todo => todo.id?.toString())
      return acc
    }, {}),
    accomodation: tripDTO.accomodation.reduce(
      (acc: { [key: string]: any }, accomodation) => {
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
export const mapToPreset: (
  preset: PresetDTO,
) => TodoPresetItemSnapshotIn = preset => ({
  ...preset,
  todoContent: {
    ...preset.todoContent,
    // id: preset.todoContent.id.toString(),
  },
})

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
