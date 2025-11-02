import { useStores, useTripStore, useUserStore } from '@/models'
import { ReservationSnapshot } from '@/models/Reservation/Reservation'
import { UserStoreSnapshotIn } from '@/models/stores/UserStore'
import { TodoPresetItemSnapshotIn } from '@/models/Todo'
import { ApiResponseKind } from '@/services/api/apiProblem'
import { ApiResponse } from 'apisauce'
import {
    ActionDispatch,
    Context,
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react'

/* https://react.dev/learn/scaling-up-with-reducer-and-context */

export enum ApiStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
    NO_CONNECTION = 'no_onnection',
}

type ApiStatusContextType = {
    apiStatus: ApiStatus
    onSuccess: (() => void) | null
}

const initialContext = {
    apiStatus: ApiStatus.IDLE,
    onSuccess: null,
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(
    undefined,
)

const ApiStatusDispatchContext = createContext<
    ActionDispatch<[action: ApiStatusActionType]> | undefined
>(undefined)

export const ApiStatusProvider = ({ children }: PropsWithChildren) => {
    const [apiStatusContext, dispatch] = useReducer(
        apiStatusReducer,
        initialContext,
    )

    const { apiStatus, onSuccess } = apiStatusContext

    useEffect(() => {
        if (apiStatus === ApiStatus.SUCCESS) {
            if (onSuccess) {
                onSuccess()
            }
            dispatch({ type: 'set_IDLE' })
        }
    }, [apiStatus, onSuccess])

    useEffect(() => {
        console.log(`[ApiStatusProvider] apiStatus=${apiStatus}`)
    }, [apiStatus])

    return (
        <ApiStatusContext value={apiStatusContext}>
            <ApiStatusDispatchContext value={dispatch}>
                {children}
            </ApiStatusDispatchContext>
        </ApiStatusContext>
    )
}

export function useApiStatus() {
    return useContext(ApiStatusContext) as ApiStatusContextType
}

export function useApiStatusDispatch() {
    return useContext(ApiStatusDispatchContext) as ActionDispatch<
        [action: ApiStatusActionType]
    >
}

type ApiStatusActionType =
    | { type: 'setApiStatus'; props: { apiStatus: ApiStatus } }
    | { type: 'set_IDLE' }
    | { type: 'set_SUCCESS' }
    | { type: 'set_NO_CONNECTION' }
    | { type: 'set_ERROR' }
    | { type: 'setOnSuccess'; props: { onSuccess: (() => void) | null } }
    | { type: 'handleResponseStatus'; props: { onSuccess: () => void } }

const apiStatusReducer = (
    state: ApiStatusContextType,
    action: ApiStatusActionType,
): ApiStatusContextType => {
    console.log(`[apiStatusReducer] action=${JSON.stringify(action)}`)
    switch (action.type) {
        case 'setApiStatus': {
            return {
                ...state,
                apiStatus: action.props.apiStatus,
            }
        }
        case 'set_IDLE': {
            return {
                ...state,
                apiStatus: ApiStatus.IDLE,
            }
        }
        case 'set_SUCCESS': {
            return {
                ...state,
                apiStatus:
                    state.apiStatus === ApiStatus.PENDING
                        ? ApiStatus.SUCCESS
                        : state.apiStatus,
            }
        }
        case 'set_NO_CONNECTION': {
            return {
                ...state,
                apiStatus:
                    state.apiStatus === ApiStatus.PENDING
                        ? ApiStatus.NO_CONNECTION
                        : state.apiStatus,
            }
        }
        case 'set_ERROR': {
            return {
                ...state,
                apiStatus:
                    state.apiStatus === ApiStatus.PENDING
                        ? ApiStatus.ERROR
                        : state.apiStatus,
            }
        }
        case 'setOnSuccess': {
            return {
                ...state,
                onSuccess: action.props.onSuccess,
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type)
            return state
        }
    }
}

export function _useWithApiStatus<T extends {}, K = void>(
    action: (args: T) => Promise<ApiResponseKind & { data?: K }>,
) {
    const dispatch = useApiStatusDispatch()

    return (props?: { args?: T; onSuccess?: () => void }) => {
        const { args, onSuccess } = props || {}
        dispatch({
            type: 'setApiStatus',
            props: { apiStatus: ApiStatus.PENDING },
        })
        dispatch({
            type: 'setOnSuccess',
            props: { onSuccess: onSuccess || null },
        })
        return action(args as T).then(({ kind, data }) => {
            console.log(`[_useWithApiStatus] kind=${kind}`)
            switch (kind) {
                case 'ok':
                    dispatch({
                        type: 'set_SUCCESS',
                    })
                    break
                case 'timeout':
                case 'cannot-connect':
                    dispatch({
                        type: 'set_NO_CONNECTION',
                    })
                    break
                default:
                    dispatch({
                        type: 'set_ERROR',
                    })
                    break
            }
            return { kind, data }
        })
    }
}

export const useActionsWithApiStatus = () => {
    const rootStore = useStores()
    const userStore = useUserStore()
    const tripStore = useTripStore()
    return {
        guestLoginWithApiStatus: _useWithApiStatus<{}, UserStoreSnapshotIn>(
            rootStore.guestLogin,
        ),
        logoutWithApiStatus: _useWithApiStatus<{}>(rootStore.logout),
        ...(userStore
            ? {
                  createTripWithApiStatus: _useWithApiStatus<{}>(
                      userStore.createTrip,
                  ),
                  setActiveTripWithApiStatus: _useWithApiStatus<string>(
                      userStore.setActiveTrip,
                  ),
                  fetchTripSummaryWithApiStatus: _useWithApiStatus<{}>(
                      userStore.fetchTripSummary,
                  ),
              }
            : {
                  createTripWithApiStatus: async () => {},
                  setActiveTripWithApiStatus: async () => {},
                  fetchTripSummaryWithApiStatus: async () => {},
              }),
        ...(tripStore
            ? {
                  fetchTodoPresetWithApiStatus: _useWithApiStatus<
                      {},
                      TodoPresetItemSnapshotIn[]
                  >(tripStore.fetchTodoPreset),
                  createReservationFromTextWithApiStatus: _useWithApiStatus<
                      string,
                      ReservationSnapshot[]
                  >(tripStore?.createReservationFromText),
              }
            : {
                  fetchTodoPresetWithApiStatus: async () => {},
                  createReservationFromTextWithApiStatus: async () => {},
              }),
    }
}
// export function withApiStatus<T>(action: (args?: T) => Promise<string>) {
//   return async (args?: T) => {
//     const {apiStatus} = useApiStatus()
//     const dispatch = useApiStatusDispatch()

//     dispatch({type: 'setApiStatus', props: {apiStatus: ApiStatus.PENDING}})
//     action(args).then((kind: string) => {
//       if (apiStatus == ApiStatus.PENDING)
//         switch (kind) {
//           case 'ok':
//             dispatch({
//               type: 'setApiStatus',
//               props: {apiStatus: ApiStatus.SUCCESS},
//             })
//             break
//           case 'timeout':
//           case 'cannot-connect':
//             dispatch({
//               type: 'setApiStatus',
//               props: {apiStatus: ApiStatus.NO_CONNECTION},
//             })
//             break
//           default:
//             dispatch({
//               type: 'setApiStatus',
//               props: {apiStatus: ApiStatus.ERROR},
//             })
//             break
//         }
//     })
//   }
// }
