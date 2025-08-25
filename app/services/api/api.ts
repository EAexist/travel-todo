/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import {AccomodationItemSnapshotIn} from '@/models/AccomodationItem'
import {DestinationSnapshotIn} from '@/models/Destination'
import {
  ReservationSnapshot,
  ReservationStoreSnapshot,
} from '@/models/ReservationStore'
import {Flight, FlightRoute, LocationPair, TodoSnapshotIn} from '@/models/Todo'
import {
  PresetSnapshotIn,
  TripStore,
  TripStoreSnapshot,
} from '@/models/TripStore'
import {UserStoreSnapshot} from '@/models/UserStore'
import {KakaoProfile} from '@react-native-seoul/kakao-login'
import {ApiResponse, ApisauceInstance, create} from 'apisauce'
import {
  FileSystemUploadOptions,
  FileSystemUploadResult,
  FileSystemUploadType,
  uploadAsync,
} from 'expo-file-system'
import {
  type ApiConfig,
  GoogleUserDTO,
  PresetDTO,
  TodoDTO,
  type TripDTO,
  UserAccountDTO,
  mapToPreset,
  mapToTodo,
  mapToTodoDTO,
  mapToTrip,
  mapToTripDTO,
  mapToUserAccount,
} from './api.types'
import {GeneralApiProblem, getGeneralApiProblem} from './apiProblem'

type ApiResult<T> = {kind: 'ok'; data: T} | GeneralApiProblem

function handleResponse<T>(response: ApiResponse<T>): ApiResult<T> {
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }
  try {
    if (!response.data) {
      throw Error
    }
    return {
      kind: 'ok',
      data: response.data,
    }
  } catch (e) {
    if (__DEV__ && e instanceof Error) {
      console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return {kind: 'bad-data'}
  }
}

function handleDeleteResponse(response: ApiResponse<void>): ApiResult<null> {
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }
  console.log(
    `[handleDeleteResponse] response.status=${response.status} response=${response}`,
  )
  try {
    if (response.status !== 204) {
      throw Error
    }
    return {
      kind: 'ok',
      data: null,
    }
  } catch (e) {
    if (__DEV__ && e instanceof Error) {
      console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return {kind: 'bad-data'}
  }
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: process.env.API_URL,
  //   withCredentials: true,
  timeout: 10000,
}

export interface CreateTodoRequest {
  category?: string
  presetId?: number
}
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    })
    // function getCookie(name: String) {
    //   const value = `; ${document.cookie}`
    //   const parts = value.split(`; ${name}=`)
    //   if (parts.length === 2) return parts.pop()?.split(';').shift()
    // }

    // this.apisauce.addRequestTransform(async request => {
    //   const csrfToken = getCookie('csrftoken') // Function to get token from cookie

    //   if (csrfToken && request.headers) {
    //     request.headers['X-CSRFToken'] = csrfToken
    //   }
    // })
  }

  authenticate(userId: string) {
    this.apisauce.setBaseURL(`${this.config.baseURL}/user/${userId}`)
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async getReservation(
    tripId: string,
  ): Promise<ApiResult<ReservationStoreSnapshot>> {
    const response: ApiResponse<ReservationStoreSnapshot> =
      await this.apisauce.get(`trip/${tripId}/reservation`)

    const reservation = handleResponse<ReservationStoreSnapshot>(response)
    return reservation
    // return reservation.kind === 'ok'
    //   ? {
    //       kind: 'ok',
    //       data: mapToTrip(reservation.data),
    //     }
    //   : reservation
  }
  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async setLocalAppStorageFileUri(
    tripId: string,
    reservationId: string,
    localAppStorageFileUri: string,
  ): Promise<ApiResult<ReservationSnapshot>> {
    const response: ApiResponse<ReservationSnapshot> =
      await this.apisauce.patch(`trip/${tripId}/reservation/${reservationId}`, {
        localAppStorageFileUri: localAppStorageFileUri,
      })
    return handleResponse<ReservationSnapshot>(response)
  }
  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async addFlightTicket(
    tripId: string,
    ticketImageFile: File,
  ): Promise<ApiResult<ReservationSnapshot>> {
    const formData = new FormData()
    formData.append('image', ticketImageFile)

    const response: ApiResponse<ReservationSnapshot> = await this.apisauce.post(
      `trip/${tripId}/reservation/flight`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return handleResponse<ReservationSnapshot>(response)
  }
  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async uploadFlightTicket(
    tripId: string,
    localFileUri: string,
  ): Promise<FileSystemUploadResult> {
    const uploadUrl = `${this.config.baseURL}/trip/${tripId}/reservation/flight`
    const fileSystemUploadOptions: FileSystemUploadOptions = {
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'image', // This 'file' must match the @RequestParam name in Spring Boot
      parameters: {}, // Optional: Include other form data
    }
    const response = await uploadAsync(
      uploadUrl,
      localFileUri,
      fileSystemUploadOptions,
    )
    return response
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async kakaoLogin(
    idToken: string,
    profile: KakaoProfile,
  ): Promise<ApiResult<UserStoreSnapshot>> {
    const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
      `auth/kakao`,
      {idToken, profile},
    )
    const userAccountResponse = handleResponse<UserAccountDTO>(response)
    return userAccountResponse.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToUserAccount(userAccountResponse.data),
        }
      : userAccountResponse
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async googleLogin(
    googleUser: GoogleUserDTO,
  ): Promise<ApiResult<UserStoreSnapshot>> {
    const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
      `auth/google`,
      googleUser,
    )
    const userAccountResponse = handleResponse<UserAccountDTO>(response)
    return userAccountResponse.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToUserAccount(userAccountResponse.data),
        }
      : userAccountResponse
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async googleLoginWithIdToken(
    idToken: string,
  ): Promise<ApiResult<UserStoreSnapshot>> {
    const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
      `auth/google`,
      undefined,
      {
        params: {
          idToken: idToken,
        },
      },
    )
    const userAccountResponse = handleResponse<UserAccountDTO>(response)
    return userAccountResponse.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToUserAccount(userAccountResponse.data),
        }
      : userAccountResponse
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async guestLogin(): Promise<ApiResult<UserStoreSnapshot>> {
    const response: ApiResponse<UserAccountDTO> =
      await this.apisauce.post(`auth/guest`)
    const userAccountResponse = handleResponse<UserAccountDTO>(response)
    return userAccountResponse.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToUserAccount(userAccountResponse.data),
        }
      : userAccountResponse
  }
  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async getCsrf(): Promise<ApiResult<void>> {
    const response: ApiResponse<void> = await this.apisauce.get(`csrf`)
    return handleResponse<void>(response)
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async getUserAccount(): Promise<ApiResult<UserStoreSnapshot>> {
    const response: ApiResponse<UserAccountDTO> = await this.apisauce.get(``)

    const userDTO = handleResponse<UserAccountDTO>(response)
    return userDTO.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToUserAccount(userDTO.data),
        }
      : userDTO
  }
  /* Trip & Trip.todolist CRUD APIS */

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async getTrip(id: string): Promise<ApiResult<TripStoreSnapshot>> {
    const response: ApiResponse<TripDTO> = await this.apisauce.get(`trip/${id}`)

    const tripDTO = handleResponse<TripDTO>(response)
    return tripDTO.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToTrip(tripDTO.data),
        }
      : tripDTO
  }
  /**
   * Create a new Trip and get id generated by B/E.
   * @returns {kind} - Response Status.
   * @returns {id} - Trip Id.
   */
  async createTrip(): Promise<ApiResult<TripStoreSnapshot>> {
    const response: ApiResponse<TripDTO> = await this.apisauce.post(`/trip`)
    console.log(`[api.createTrip() config=${JSON.stringify(this.config)}`)
    console.log(`[api.createTrip() response=${JSON.stringify(response)}`)

    const tripDTO = handleResponse<TripDTO>(response)
    return tripDTO.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToTrip(tripDTO.data),
        }
      : tripDTO
  }

  /**
   * Update todolist of the trip.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Updated Trip.
   */
  async patchTrip(trip: TripStore): Promise<ApiResult<TripStoreSnapshot>> {
    const response: ApiResponse<TripDTO> = await this.apisauce.patch(
      `/trip/${trip.id}`,
      mapToTripDTO(trip),
    )

    const tripDTO = handleResponse<TripDTO>(response)
    return tripDTO.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToTrip(tripDTO.data),
        }
      : tripDTO
  }

  /* Todo CRUD APIS */

  /**
   * Create todo.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Updated Trip.
   */
  async createTodo({
    tripId,
    todo,
  }: {
    tripId: string
    todo: Partial<TodoSnapshotIn>
  }): Promise<ApiResult<TodoSnapshotIn>> {
    const response: ApiResponse<TodoDTO> = await this.apisauce.post(
      `/trip/${tripId}/todo`,
      mapToTodoDTO({...todo, completeDateISOString: ''} as TodoSnapshotIn),
    )

    const todoDTOResponse = handleResponse<TodoDTO>(response)
    return todoDTOResponse.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToTodo(todoDTOResponse.data) as TodoSnapshotIn,
        }
      : todoDTOResponse
  }

  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  async patchTodo(
    tripId: string,
    todo: TodoSnapshotIn,
  ): Promise<ApiResult<TodoSnapshotIn>> {
    const response: ApiResponse<TodoDTO> = await this.apisauce.patch(
      `/trip/${tripId}/todo/${todo.id}`,
      mapToTodoDTO(todo),
    )

    const todoDTOResponse = handleResponse<TodoDTO>(response)
    return todoDTOResponse.kind === 'ok'
      ? {
          kind: 'ok',
          data: mapToTodo(todoDTOResponse.data) as TodoSnapshotIn,
        }
      : todoDTOResponse
  }

  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  async deleteTodo(tripId: string, todoId: string): Promise<ApiResult<null>> {
    const response: ApiResponse<void> = await this.apisauce.delete(
      `/trip/${tripId}/todo/${todoId}`,
    )
    return handleDeleteResponse(response)
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getTodoPreset(id: string): Promise<ApiResult<PresetSnapshotIn[]>> {
    const response: ApiResponse<PresetDTO[]> = await this.apisauce.get(
      `/trip/${id}/todoPreset`,
    )
    const presetResponse = handleResponse<PresetDTO[]>(response)
    return presetResponse.kind === 'ok'
      ? {
          ...presetResponse,
          data: presetResponse.data.map(presetDTO => mapToPreset(presetDTO)),
        }
      : presetResponse
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getRecommendedFlightRoute(
    tripId: string,
    todoId: string,
  ): Promise<ApiResult<FlightRoute[]>> {
    const response: ApiResponse<FlightRoute[]> = await this.apisauce.get(
      `/trip/${tripId}/todo/${todoId}/recommendedFlightRoute`,
    )
    console.log(
      `[api.getRecommendedFlight] response=${JSON.stringify(response)}`,
    )
    const presetResponse = handleResponse<FlightRoute[]>(response)
    return presetResponse
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getRecommendedFlight(id: string): Promise<ApiResult<Flight[]>> {
    const response: ApiResponse<Flight[]> = await this.apisauce.get(
      `/trip/${id}/recommendedFlight`,
    )
    console.log(
      `[api.getRecommendedFlight] response=${JSON.stringify(response)}`,
    )
    const presetResponse = handleResponse<Flight[]>(response)
    return presetResponse
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getAirportList(input: string): Promise<ApiResult<Flight[]>> {
    const response: ApiResponse<Flight[]> = await this.apisauce.get(
      `/airport/search`,
      {input},
    )
    console.log(`[api.getAirportList] response=${JSON.stringify(response)}`)
    const presetResponse = handleResponse<Flight[]>(response)
    return presetResponse
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async createDestination(
    tripId: string,
    destination: Partial<DestinationSnapshotIn>,
  ): Promise<ApiResult<DestinationSnapshotIn>> {
    // make the api call
    const response: ApiResponse<DestinationSnapshotIn> =
      await this.apisauce.post(`trip/${tripId}/destination`, destination)

    const handledResponse = handleResponse<DestinationSnapshotIn>(response)
    console.log(JSON.stringify(handledResponse))
    return handledResponse.kind === 'ok'
      ? {
          ...handledResponse,
          data: {
            ...handledResponse.data,
            id: handledResponse.data.id.toString(),
          },
        }
      : handledResponse
  }

  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  async deleteDestination(
    tripId: string,
    destinationId: string,
  ): Promise<ApiResult<null>> {
    const response: ApiResponse<void> = await this.apisauce.delete(
      `/trip/${tripId}/destination/${destinationId}`,
    )

    return handleDeleteResponse(response)
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  //   async getAccomodationItem(): Promise<ApiResult<AccomodationItemSnapshotIn[]>> {
  //     const response: ApiResponse<AccomodationItemSnapshotIn[]> =
  //       await this.apisauce.get(`trip/1/accomodation`)

  //     const accomodationDTO =
  //       handleResponse<AccomodationItemSnapshotIn[]>(response)
  //     return accomodationDTO
  //   }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async createAccomodation(
    id: string,
  ): Promise<ApiResult<Partial<AccomodationItemSnapshotIn>>> {
    // make the api call
    const response: ApiResponse<Partial<AccomodationItemSnapshotIn>> =
      await this.apisauce.get(`trip/${id}/accomodation`)

    return handleResponse<Partial<AccomodationItemSnapshotIn>>(response)
  }

  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  async patchAccomodation(
    tripId: string,
    accomodation: AccomodationItemSnapshotIn,
  ): Promise<ApiResult<Partial<AccomodationItemSnapshotIn>>> {
    const response: ApiResponse<Partial<AccomodationItemSnapshotIn>> =
      await this.apisauce.patch(
        `/trip/${tripId}/accomodation/${accomodation.id}`,
        accomodation,
      )

    const accomodationDTO =
      handleResponse<Partial<AccomodationItemSnapshotIn>>(response)
    return accomodationDTO
  }
  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  async deleteAccomodation(
    tripId: string,
    accomodationId: string,
  ): Promise<ApiResult<null>> {
    const response: ApiResponse<void> = await this.apisauce.delete(
      `/trip/${tripId}/accomodation/${accomodationId}`,
    )

    return handleDeleteResponse(response)
  }

  //   amadeus = new Amadeus({
  //     clientId: CLIENT_ID,
  //     clientSecret: CLIENT_SECRET,
  //   })

  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  //   async fetchLocationsbyKeyword(
  //     tripId: string,
  //     accomodationId: string,
  //   ): Promise<ApiResult<Location>> {
  //     const response = await amadeus.client.get('/v1/reference-data/locations', {
  //       keyword,
  //       subType,
  //       'page[offset]': page * 10,
  //     })

  //     return handleResponse<Location>(response)
  //   }

  /**
   * Update todo.
   * @returns {kind} - Response Status.
   * @returns {...Todo} - Updated Trip.
   */
  //   async fetchFlightsWithNearbyArrival(
  //     tripId: string,
  //     accomodationId: string,
  //   ): Promise<ApiResult<Location>> {
  //     const response = await amadeus.client.get('/v1/reference-data/locations', {
  //       keyword,
  //       subType,
  //       'page[offset]': page * 10,
  //     })

  //     return handleResponse<Location>(response)
  //   }
  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  //   async fetchLocations(
  //     params: ReferenceDataLocationsParams,
  //   ): Promise<ApiResult<Location[]>> {
  //     const response: ApiResponse<ReferenceDataLocationsResult['data']> =
  //       await this.apisauce.get(`amadeus/locations`, params)
  //     const handledResponse =
  //       handleResponse<ReferenceDataLocationsResult['data']>(response)
  //     return handledResponse.kind === 'ok'
  //       ? {
  //           kind: 'ok',
  //           data: handledResponse.data.map(l => ({
  //             title: l.name || '',
  //             IATACode: l.IATACode,
  //             name: l.name || '',
  //           })),
  //         }
  //       : handledResponse
  //   }
}

// Singleton instance of the API for convenience
export const api = new Api()
