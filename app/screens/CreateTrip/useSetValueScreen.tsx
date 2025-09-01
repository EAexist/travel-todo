import {useCallback, useState} from 'react'

export const useSetValueScreen = ({
  initialValue,
  onConfirm,
}: {
  initialValue?: string
  onConfirm: (value: string) => Promise<any>
}) => {
  const [value, setValue] = useState<string>(initialValue || '')
  const promiseBeforeNavigate = useCallback(async () => {
    await onConfirm(value)
  }, [value, onConfirm])

  return {
    value,
    setValue,
    promiseBeforeNavigate,
  }
}
