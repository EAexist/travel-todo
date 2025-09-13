import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react'

// export enum ApiStatus {
//   IDLE = 'idle',
//   PENDING = 'pending',
//   SUCCESS = 'success',
//   ERROR = 'error',
//   NO_CONNECTION = 'no_connection',
// }

type ApiStatusContextType = {
  apiStatus: ApiStatus
  setApiStatus: Dispatch<SetStateAction<ApiStatus>>
  onSuccess: (() => void) | null
  setOnSuccess?: Dispatch<SetStateAction<(() => void) | null>>
}

export const ApiStatusContext = createContext<ApiStatusContextType>({
  apiStatus: ApiStatus.IDLE,
  setApiStatus: () => {},
  onSuccess: null,
  setOnSuccess: () => {},
})

export const useApiStatusProvider = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>(ApiStatus.IDLE)
  const [onSuccess, setOnSuccess] = useState<(() => void) | null>(null)

  return {
    apiStatus,
    setApiStatus,
    setOnSuccess,
    ApiStatusProvider: ({children}: PropsWithChildren) => (
      <ApiStatusContext.Provider
        value={{
          apiStatus,
          setApiStatus,
          onSuccess,
          setOnSuccess,
        }}>
        {children}
      </ApiStatusContext.Provider>
    ),
  }
}
