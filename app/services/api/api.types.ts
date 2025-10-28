import {
    Destination,
    DestinationCreateDTO,
    DestinationModel,
    DestinationSnapshotIn,
} from '@/models/Destination'
import { AccomodationSnapshotIn } from '@/models/Reservation/Accomodation'
import { ReservationSnapshot } from '@/models/Reservation/Reservation'
import {
    PresetTodoContentModel,
    Todo,
    TodoContent,
    TodoContentModel,
    TodoContentSnapshotIn,
    TodoModel,
    TodoPresetItem,
    TodoPresetItemModel,
    TodoPresetItemSnapshotIn,
    TodoSnapshotIn,
} from '@/models/Todo'
import { ReservationStoreModel } from '@/models/stores/ReservationStore'
import {
    TripSettings,
    TripSettingsSnapshot,
    TripStore,
    TripStoreModel,
    TripStoreSnapshot,
} from '@/models/stores/TripStore'
import { UserStoreSnapshot } from '@/models/stores/UserStore'
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
    tripBaseURL: string | null
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

export interface TripFetchDTO
    extends Omit<
        TripStoreSnapshot,
        'todoMap' | 'todolist' | 'destinations' | 'reservationStore' | 'preset'
    > {
    todolist: TodoDTO[]
    destinations: DestinationDTO[]
    reservations: ReservationDTO[]
    stockTodoContents: TodoContentSnapshotIn[]
}

export interface TripPatchDTO
    extends Partial<
        Omit<
            TripStoreSnapshot,
            | 'todoMap'
            | 'todolist'
            | 'destinations'
            | 'reservationStore'
            | 'settings'
        >
    > {
    id: string
    settings?: Partial<TripSettingsSnapshot>
}

export interface TodoDTO
    extends Partial<Omit<TodoSnapshotIn, 'isFlaggedToDelete' | 'content'>> {
    content: TodoContentSnapshotIn
}

export interface TodoPatchDTO
    extends Partial<Omit<TodoSnapshotIn, 'isFlaggedToDelete' | 'content'>> {
    content?: TodoContentSnapshotIn
    id: string
}

export interface ReservationDTO extends ReservationSnapshot {}

export interface ReservationPatchDTO extends Partial<ReservationSnapshot> {
    id: string
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
        | 'checkinDateIsoString'
        | 'checkoutDateIsoString'
        | 'checkinStartTimeIsoString'
        | 'checkinEndTimeIsoString'
        | 'checkoutTimeIsoString'
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
export interface PatchTripProps {
    tripId: string
}
export interface DeleteTripProps {
    tripId: string
}

export interface CreateTodoProps {
    tripId: string
    todoDTO: TodoPatchDTO
}

export interface PatchTodoProps {
    todoDTO: TodoPatchDTO
}

export interface DeleteTodoProps {
    todoId: string
}

export interface CreateDestinationProps {
    tripId: string
    destinationDTO: DestinationCreateDTO
}

export interface DeleteDestinationProps {
    tripId: string
    destinationId: string
}

export interface CreateReservationProps {
    tripId: string
    reservationDTO: ReservationPatchDTO
}

export interface PatchReservationProps {
    reservationDTO: ReservationPatchDTO
}

export interface DeleteReservationProps {
    id: string
}

/*
 * Mapper
 */

/* UserAccount */
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

/* Trip */
export const mapToTripPatchDTO: (
    trip: Partial<TripStoreSnapshot> & { id: string },
) => TripPatchDTO = trip => ({
    id: trip.id,
    isInitialized: trip.isInitialized,
    title: trip.title,
    startDateIsoString: trip.startDateIsoString,
    endDateIsoString: trip.endDateIsoString,
    settings: trip.settings
        ? {
              isTripMode: trip.settings.isTripMode,
              categoryKeyToIndex: trip.settings.categoryKeyToIndex,
          }
        : undefined,
})

export const mapToTrip: (tripFetchDTO: TripFetchDTO) => TripStoreSnapshot = ({
    todolist,
    destinations,
    reservations,
    stockTodoContents,
    ...tripDTO
}) => {
    const categories = [
        ...new Set(todolist?.map(todo => todo.content?.category)),
    ].filter(c => c !== undefined)

    return {
        ...tripDTO,
        todoMap: todolist
            ? todolist.reduce((acc: { [key: string]: any }, todoDTO) => {
                  if (todoDTO.id)
                      acc[todoDTO.id?.toString()] = mapToTodo(todoDTO)
                  return acc
              }, {})
            : {},
        destinations: destinations.map(dest => mapToDestination(dest)),
        reservationStore: ReservationStoreModel.create({
            reservations: reservations
                ? reservations.reduce(
                      (acc: { [key: string]: any }, reservationDTO) => {
                          if (reservationDTO.id)
                              acc[reservationDTO.id?.toString()] =
                                  mapToReservation(reservationDTO)
                          return acc
                      },
                      {},
                  )
                : {},
        }),
        preset: stockTodoContents.map(stockTodoContent =>
            TodoPresetItemModel.create({
                isFlaggedToAdd: false,
                todoContent: PresetTodoContentModel.create(stockTodoContent),
            }),
        ),
    }
}

/* Destination */
export const mapToDestinationDTO: (
    destination: Destination,
) => DestinationDTO = destination => ({
    ...destination,
    //   id: destination.id ? Number(destination.id) : undefined,
})

export const mapToDestination: (
    destination: DestinationDTO,
) => Destination = destination => {
    if (destination.id) return DestinationModel.create(destination)
    else throw Error
}

/* Todo */
export const mapToTodoPatchDTO: (
    todo: Partial<TodoSnapshotIn> & {
        id: string
    },
) => TodoPatchDTO = todo => ({
    id: todo.id,
    note: todo.note,
    completeDateIsoString: todo.completeDateIsoString,
    orderKey: todo.orderKey,
    content: todo.content,
})

export const mapToTodo: (todoDTO: TodoDTO) => Todo = todoDTO =>
    TodoModel.create({
        ...todoDTO,
        content: TodoContentModel.create(
            todoDTO.content as TodoContentSnapshotIn,
        ),
    })

// export const mapFetchToTripDTO: (trip: Partial<TripStore>) => PartiaFetchl<TripDTO> = ({
//     todolist,
//     destination,
//     ...trip
// }) => ({
//     ...getSnapshot(trip),
//     todolist: todolist?.values()
//         ? Array.from(todolist.values())
//               .map(todos => {
//                   return todos.map((todo, index) =>
//                       mapToTodoPatchDTO(trip.todoMap?.get(todo.id) as Todo),
//                   )
//               })
//               .flat()
//         : undefined,
//     destination: destination?.map(dest => mapToDestinationDTO(dest)),
// })
export const mapToPreset: (
    preset: PresetDTO,
) => TodoPresetItemSnapshotIn = preset => ({
    ...preset,
    todoContent: {
        ...preset.todoContent,
        // id: preset.todoContent.id.toString(),
    },
})

export const mapToReservation: (
    reservation: ReservationDTO,
) => ReservationSnapshot = reservation => ({
    ...reservation,
})

export const mapToReservationPatchDTO: (
    reservation: Partial<ReservationSnapshot> & {
        id: string
    },
) => ReservationPatchDTO = reservation => ({
    id: reservation.id,
    category: reservation.category,
    primaryHrefLink: reservation.primaryHrefLink,
    code: reservation.code,
    note: reservation.note,
    flightBooking: reservation.flightBooking,
    flightTicket: reservation.flightTicket,
    accomodation: reservation.accomodation,
    visitJapan: reservation.visitJapan,
    generalReservation: reservation.generalReservation,
    isCompleted: reservation.isCompleted,
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
