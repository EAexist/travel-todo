import { useStores } from '@/models'
import { APiResponseKind } from '@/services/api/apiProblem'
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

export function _useWithApiStatus<T extends {}>(
  action: (args: T) => Promise<APiResponseKind>,
) {
  const dispatch = useApiStatusDispatch()

  return async (props?: { args?: T; onSuccess?: () => void }) => {
    const { args, onSuccess } = props || {}
    dispatch({
      type: 'setApiStatus',
      props: { apiStatus: ApiStatus.PENDING },
    })
    dispatch({ type: 'setOnSuccess', props: { onSuccess: onSuccess || null } })
    return await action(args as T).then((kind: APiResponseKind) => {
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
    })
  }
}

export const useActionsWithApiStatus = () => {
  const stores = useStores()

  return {
    createTripWithApiStatus: _useWithApiStatus<{}>(stores.createTrip),
    guestLoginWithApiStatus: _useWithApiStatus<{}>(stores.userStore.guestLogin),
    fetchPresetWithApiStatus: stores.tripStore
      ? _useWithApiStatus<{}>(stores.tripStore?.fetchPreset)
      : () => {
          console.log('[fetchPresetWithApiStatus] TripStore is not defined.')
        },
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
