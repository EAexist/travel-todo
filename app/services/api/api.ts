/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { Destination } from '@/models/Destination'
import { ReservationSnapshot } from '@/models/Reservation/Reservation'
import { ResourceQuotaStoreSnapshotIn } from '@/models/stores/ResourceQuotaStore'
import { TripStoreSnapshot, TripSummary } from '@/models/stores/TripStore'
import { UserStoreSnapshotIn } from '@/models/stores/UserStore'
import {
    Flight,
    FlightRoute,
    Todo,
    TodoPresetItemSnapshotIn,
    TodoSnapshotIn,
} from '@/models/Todo'
import { KakaoProfile } from '@react-native-seoul/kakao-login'
import { ApiResponse, ApisauceInstance, create } from 'apisauce'
import {
    FileSystemUploadOptions,
    FileSystemUploadResult,
    FileSystemUploadType,
    uploadAsync,
} from 'expo-file-system'
import {
    type ApiConfig,
    CreateDestinationProps,
    CreateReservationProps,
    CreateTodoProps,
    DeleteDestinationProps,
    DeleteReservationProps,
    DeleteTodoProps,
    DeleteTripProps,
    DestinationDTO,
    GoogleUserDTO,
    PatchReservationProps,
    PatchTodoProps,
    ReservationDTO,
    TodoDTO,
    TodoPresetDTO,
    TripFetchDTO,
    TripPatchDTO,
    UserAccountDTO,
    mapToDestination,
    mapToReservation,
    mapToTodo,
    mapToTodoPreset,
    mapToTrip,
    mapToUserAccount,
} from './api.types'
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem'

export type ApiResult<T> =
    | { kind: 'ok'; data: T; location?: string }
    | GeneralApiProblem
// type ApiLocationResult = { kind: 'ok'; location: string } | GeneralApiProblem
// export type ApiStatus = {kind: 'ok'} | GeneralApiProblem

function _handleResponse<T>(response: ApiResponse<T>): ApiResult<T> {
    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
    }
    try {
        if (!response.data || !response.headers) {
            throw Error
        }
        console.log(
            `_handleResponse] status:${response.status} data:${JSON.stringify(response.data)}`,
        )
        return {
            kind: 'ok',
            data: response.data,
            location: response.headers['location'],
        }
    } catch (e) {
        if (__DEV__ && e instanceof Error) {
            console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: 'bad-data' }
    }
}
function handleResponse<T, K>(
    response: ApiResponse<T>,
    mapper: (dto: T) => K,
): ApiResult<K> {
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
            data: mapper(response.data),
        }
    } catch (e) {
        if (__DEV__ && e instanceof Error) {
            console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: 'bad-data' }
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
        return { kind: 'bad-data' }
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
    // baseURL: 'http://192.168.0.29:8080',
    //   withCredentials: true,
    timeout: 10000,
    tripBaseURL: null,
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
        console.log('authenticate')
        // this.apisauce.setBaseURL(`${this.config.baseURL}/user/${userId}`)
    }
    /*
     * Login
     */

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    async kakaoLogin(
        idToken: string,
        profile: KakaoProfile,
    ): Promise<ApiResult<UserStoreSnapshotIn>> {
        const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
            `auth/kakao`,
            { idToken, profile },
        )
        const userAccountResponse = _handleResponse<UserAccountDTO>(response)
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
    ): Promise<ApiResult<UserStoreSnapshotIn>> {
        const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
            `auth/google`,
            googleUser,
        )
        const userAccountResponse = _handleResponse<UserAccountDTO>(response)
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
    ): Promise<ApiResult<UserStoreSnapshotIn>> {
        const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
            `auth/google`,
            undefined,
            {
                params: {
                    idToken: idToken,
                },
            },
        )
        const userAccountResponse = _handleResponse<UserAccountDTO>(response)
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
    async guestLogin(): Promise<ApiResult<UserStoreSnapshotIn>> {
        const response: ApiResponse<UserAccountDTO> =
            await this.apisauce.post(`auth/guest`)

        console.log(`[api.guestLogin] response: ${JSON.stringify(response)}`)
        const userAccountResponse = _handleResponse<UserAccountDTO>(response)
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
        return _handleResponse<void>(response)
    }

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    async getUserAccount(): Promise<ApiResult<UserStoreSnapshotIn>> {
        const response: ApiResponse<UserAccountDTO> =
            await this.apisauce.get(``)

        const userDTO = _handleResponse<UserAccountDTO>(response)
        return userDTO.kind === 'ok'
            ? {
                  kind: 'ok',
                  data: mapToUserAccount(userDTO.data),
              }
            : userDTO
    }

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    async getResourceQuota(): Promise<ApiResult<ResourceQuotaStoreSnapshotIn>> {
        const response: ApiResponse<ResourceQuotaStoreSnapshotIn> =
            await this.apisauce.get(`resourceQuota`)

        return _handleResponse<ResourceQuotaStoreSnapshotIn>(response)
    }

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    async getTripSummary(
        userId: string,
    ): Promise<ApiResult<{ tripSummary: TripSummary[] }>> {
        const response: ApiResponse<{ tripSummary: TripSummary[] }> =
            await this.apisauce.get(`user/${userId}/tripSummary`)

        const userDTO = _handleResponse<{ tripSummary: TripSummary[] }>(
            response,
        )
        return userDTO
    }

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    async getActiveTrip(userId: string): Promise<ApiResult<TripStoreSnapshot>> {
        const response: ApiResponse<TripFetchDTO> = await this.apisauce.get(
            `user/${userId}/activeTrip`,
        )

        const tripDTO = _handleResponse<TripFetchDTO>(response)
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
    async setActiveTrip(
        userId: string,
        tripId: string,
    ): Promise<ApiResult<TripStoreSnapshot>> {
        const response: ApiResponse<TripFetchDTO> = await this.apisauce.post(
            `user/${userId}/activeTrip/${tripId}`,
        )

        const tripDTO = _handleResponse<TripFetchDTO>(response)
        return tripDTO.kind === 'ok'
            ? {
                  ...tripDTO,
                  data: mapToTrip(tripDTO.data),
              }
            : tripDTO
    }

    /*
     * Trip CRUD
     */

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    // async getTrip(id: string): Promise<ApiResult<TripStoreSnapshot>> {
    //     const response: ApiResponse<TripDTO> = await this.apisauce.get(
    //         `trip/${id}`,
    //     )

    //     const tripDTO = _handleResponse<TripDTO>(response)
    //     return tripDTO.kind === 'ok'
    //         ? {
    //               kind: 'ok',
    //               data: mapToTrip(tripDTO.data),
    //           }
    //         : tripDTO
    // }

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    // async getTripByLocation(
    //     location: string,
    // ): Promise<ApiResult<TripStoreSnapshot>> {
    //     const response: ApiResponse<TripDTO> = await this.apisauce.get(
    //         `${location}`,
    //     )

    //     const tripDTO = _handleResponse<TripDTO>(response)
    //     return tripDTO.kind === 'ok'
    //         ? {
    //               kind: 'ok',
    //               data: mapToTrip(tripDTO.data),
    //           }
    //         : tripDTO
    // }
    /**
     * Create a new Trip and get id generated by B/E.
     * @returns {kind} - Response Status.
     * @returns {id} - Trip Id.
     */
    async createTrip({
        userId,
    }: {
        userId: string
    }): Promise<ApiResult<UserStoreSnapshotIn>> {
        const response: ApiResponse<UserAccountDTO> = await this.apisauce.post(
            `user/${userId}/trip`,
        )

        const userAccountDTO = _handleResponse<UserAccountDTO>(response)
        return userAccountDTO.kind === 'ok'
            ? {
                  ...userAccountDTO,
                  data: mapToUserAccount(userAccountDTO.data),
              }
            : userAccountDTO
    }

    /**
     * Create a new Trip and get id generated by B/E.
     * @returns {kind} - Response Status.
     * @returns {id} - Trip Id.
     */
    async deleteTrip({ tripId }: DeleteTripProps): Promise<ApiResult<null>> {
        const response: ApiResponse<void> = await this.apisauce.delete(
            `/trip/${tripId}`,
        )

        console.log(`[deleteTrip] response:${JSON.stringify(response)}`)

        return handleDeleteResponse(response)
    }

    /**
     * Update todolist of the trip.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Updated Trip.
     */
    async patchTrip(
        tripDTO: TripPatchDTO,
    ): Promise<ApiResult<TripStoreSnapshot>> {
        const response: ApiResponse<TripFetchDTO> = await this.apisauce.patch(
            `/trip/${tripDTO.id}`,
            tripDTO,
            //   mapToTripDTO(trip),
        )

        const patchedTripDTO = _handleResponse<TripFetchDTO>(response)
        return patchedTripDTO.kind === 'ok'
            ? {
                  kind: 'ok',
                  data: mapToTrip(patchedTripDTO.data),
              }
            : patchedTripDTO
    }
    /*
     * Reservation CRUD
     */

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    // async getReservation(
    //     tripId: string,
    // ): Promise<ApiResult<ReservationStoreSnapshot>> {
    //     const response: ApiResponse<ReservationStoreSnapshot> =
    //         await this.apisauce.get(`${this.config.tripBaseURL}/reservation`)

    //     const reservation = _handleResponse<ReservationStoreSnapshot>(response)
    //     return reservation
    //     // return reservation.kind === 'ok'
    //     //   ? {
    //     //       kind: 'ok',
    //     //       data: mapToTrip(reservation.data),
    //     //     }
    //     //   : reservation
    // }
    /**
     * Create reservation.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Updated Trip.
     */
    async createReservation({
        tripId,
        reservationDTO,
    }: CreateReservationProps): Promise<ApiResult<ReservationSnapshot>> {
        const response: ApiResponse<ReservationDTO> = await this.apisauce.post(
            `/trip/${tripId}/reservation`,
            reservationDTO,
            //   mapToReservationDTO({...reservation, completeDateIsoString: ''} as Reservation),
        )

        const reservationDTOResponse = _handleResponse<ReservationDTO>(response)
        return reservationDTOResponse.kind === 'ok'
            ? {
                  kind: 'ok',
                  data: mapToReservation(
                      reservationDTOResponse.data,
                  ) as ReservationSnapshot,
              }
            : reservationDTOResponse
    }

    /**
     * Update reservation.
     * @returns {kind} - Response Status.
     * @returns {...Reservation} - Updated Trip.
     */
    async patchReservation({
        reservationDTO,
    }: PatchReservationProps): Promise<ApiResult<ReservationSnapshot>> {
        const response: ApiResponse<ReservationDTO> = await this.apisauce.patch(
            `/reservation/${reservationDTO.id}`,
            reservationDTO,
            //   mapToReservationDTO(reservation),
        )

        const reservationDTOResponse = _handleResponse<ReservationDTO>(response)
        return reservationDTOResponse.kind === 'ok'
            ? {
                  kind: 'ok',
                  data: mapToReservation(
                      reservationDTOResponse.data,
                  ) as ReservationSnapshot,
              }
            : reservationDTOResponse
    }

    /**
     * Update reservation.
     * @returns {kind} - Response Status.
     * @returns {...Reservation} - Updated Trip.
     */
    async deleteReservation({
        id,
    }: DeleteReservationProps): Promise<ApiResult<null>> {
        const response: ApiResponse<void> = await this.apisauce.delete(
            `/reservation/${id}`,
        )
        return handleDeleteResponse(response)
    }

    /**
     * Gets a Trip data with given id.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Trip.
     */
    async createReservationFromText(
        tripId: string,
        confirmationText: string,
    ): Promise<ApiResult<ReservationSnapshot[]>> {
        const response: ApiResponse<ReservationDTO[]> =
            await this.apisauce.post(
                `/trip/${tripId}/reservation/analysis/text`,
                {
                    confirmationText,
                },
            )
        return handleResponse(response, (dto: ReservationDTO[]) =>
            dto.map(mapToReservation),
        )
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
            await this.apisauce.patch(
                `${this.config.tripBaseURL}/reservation/${reservationId}`,
                {
                    localAppStorageFileUri: localAppStorageFileUri,
                },
            )
        return _handleResponse<ReservationSnapshot>(response)
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

        const response: ApiResponse<ReservationSnapshot> =
            await this.apisauce.post(
                `${this.config.tripBaseURL}/reservation/flight`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
        return _handleResponse<ReservationSnapshot>(response)
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
        const uploadUrl = `${this.config.baseURL}/${this.config.tripBaseURL}/reservation/flight`
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
    /*
     * Todo CRUD
     */

    /**
     * Create todo.
     * @returns {kind} - Response Status.
     * @returns {...Trip} - Updated Trip.
     */
    async createTodo({
        tripId,
        todoDTO,
    }: CreateTodoProps): Promise<ApiResult<TodoSnapshotIn>> {
        const response: ApiResponse<TodoDTO> = await this.apisauce.post(
            `/trip/${tripId}/todo`,
            todoDTO,
        )

        const todoDTOResponse = _handleResponse<TodoDTO>(response)
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
    async patchTodo({
        todoDTO,
    }: PatchTodoProps): Promise<ApiResult<TodoSnapshotIn>> {
        const response: ApiResponse<TodoDTO> = await this.apisauce.patch(
            `/todo/${todoDTO.id}`,
            todoDTO,
        )

        const todoDTOResponse = _handleResponse<TodoDTO>(response)
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
    async deleteTodo({ todoId }: DeleteTodoProps): Promise<ApiResult<null>> {
        const response: ApiResponse<void> = await this.apisauce.delete(
            `/todo/${todoId}`,
        )
        return handleDeleteResponse(response)
    }

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    async getTodoPreset(
        tripId: string,
    ): Promise<ApiResult<TodoPresetItemSnapshotIn[]>> {
        const response: ApiResponse<TodoPresetDTO[]> = await this.apisauce.get(
            `/trip/${tripId}/todoPreset`,
        )
        const presetResponse = _handleResponse<TodoPresetDTO[]>(response)
        return presetResponse.kind === 'ok'
            ? {
                  ...presetResponse,
                  data: presetResponse.data.map(presetDTO =>
                      mapToTodoPreset(presetDTO),
                  ),
              }
            : presetResponse
    }

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    async getRecommendedFlightRoute(
        todoId: string,
    ): Promise<ApiResult<FlightRoute[]>> {
        const response: ApiResponse<FlightRoute[]> = await this.apisauce.get(
            `/todo/${todoId}/recommendedFlightRoute`,
        )
        console.log(
            `[api.getRecommendedFlight] response=${JSON.stringify(response)}`,
        )
        const presetResponse = _handleResponse<FlightRoute[]>(response)
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
        const presetResponse = _handleResponse<Flight[]>(response)
        return presetResponse
    }

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    async getAirportList(input: string): Promise<ApiResult<Flight[]>> {
        const response: ApiResponse<Flight[]> = await this.apisauce.get(
            `/airport/search`,
            { input },
        )
        console.log(`[api.getAirportList] response=${JSON.stringify(response)}`)
        const presetResponse = _handleResponse<Flight[]>(response)
        return presetResponse
    }

    /*
     * Destination CRUD
     */

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    async getDestinations(tripId: string): Promise<ApiResult<Destination[]>> {
        const response: ApiResponse<DestinationDTO[]> = await this.apisauce.get(
            `/trip/${tripId}/destination`,
        )

        const handledResponse = _handleResponse<DestinationDTO[]>(response)
        return handledResponse.kind === 'ok'
            ? {
                  ...handledResponse,
                  data: handledResponse.data.map(destinationDTO =>
                      mapToDestination(destinationDTO),
                  ),
              }
            : handledResponse
    }

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    async createDestination({
        tripId,
        destinationDTO,
    }: CreateDestinationProps): Promise<ApiResult<Destination>> {
        // make the api call
        const response: ApiResponse<Destination> = await this.apisauce.post(
            `/trip/${tripId}/destination`,
            destinationDTO,
        )

        const handledResponse = _handleResponse<Destination>(response)
        console.log(JSON.stringify(handledResponse))
        return handledResponse
    }

    /**
     * Update todo.
     * @returns {kind} - Response Status.
     * @returns {...Todo} - Updated Trip.
     */
    async deleteDestination({
        tripId,
        destinationId,
    }: DeleteDestinationProps): Promise<ApiResult<null>> {
        const response: ApiResponse<void> = await this.apisauce.delete(
            `/trip/${tripId}/destination/${destinationId}`,
        )

        return handleDeleteResponse(response)
    }

    /*
     * Accomodation CRUD
     */

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    //   async getAccomodation(): Promise<ApiResult<AccomodationSnapshotIn[]>> {
    //     const response: ApiResponse<AccomodationSnapshotIn[]> =
    //       await this.apisauce.get(`trip/1/accomodation`)

    //     const accomodationDTO =
    //       _handleResponse<AccomodationSnapshotIn[]>(response)
    //     return accomodationDTO
    //   }

    /**
     * Gets a list of recent React Native Radio episodes.
     */
    // async createAccomodation(
    //     tripId: string,
    // ): Promise<ApiResult<Partial<AccomodationSnapshotIn>>> {
    //     // make the api call
    //     const response: ApiResponse<Partial<AccomodationSnapshotIn>> =
    //         await this.apisauce.get(`${this.config.tripBaseURL}/accomodation`)

    //     return _handleResponse<Partial<AccomodationSnapshotIn>>(response)
    // }

    // /**
    //  * Update todo.
    //  * @returns {kind} - Response Status.
    //  * @returns {...Todo} - Updated Trip.
    //  */
    // async patchAccomodation({
    //     tripId,
    //     accomodation,
    // }: CreateAccomodationProps): Promise<
    //     ApiResult<Partial<AccomodationSnapshotIn>>
    // > {
    //     const response: ApiResponse<Partial<AccomodationSnapshotIn>> =
    //         await this.apisauce.patch(
    //             `/${this.config.tripBaseURL}/accomodation/${accomodation.id}`,
    //             accomodation,
    //         )

    //     const accomodationDTO =
    //         _handleResponse<Partial<AccomodationSnapshotIn>>(response)
    //     return accomodationDTO
    // }
    // /**
    //  * Update todo.
    //  * @returns {kind} - Response Status.
    //  * @returns {...Todo} - Updated Trip.
    //  */
    // async deleteAccomodation({
    //     tripId,
    //     accomodationId,
    // }: DeleteAccomodationProps): Promise<ApiResult<null>> {
    //     const response: ApiResponse<void> = await this.apisauce.delete(
    //         `/${this.config.tripBaseURL}/accomodation/${accomodationId}`,
    //     )

    //     return handleDeleteResponse(response)
    // }

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

    //     return _handleResponse<Location>(response)
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

    //     return _handleResponse<Location>(response)
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
    //       _handleResponse<ReferenceDataLocationsResult['data']>(response)
    //     return handledResponse.kind === 'ok'
    //       ? {
    //           kind: 'ok',
    //           data: handledResponse.data.map(l => ({
    //             title: l.name || '',
    //             iataCode: l.iataCode,
    //             name: l.name || '',
    //           })),
    //         }
    //       : handledResponse
    //   }
}

// Singleton instance of the API for convenience
export const api = new Api()
