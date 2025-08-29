import * as Fab from '@/components/Fab'
import {ControlledInput} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {InputProps} from '@rneui/base'
import {FC, useCallback, useState} from 'react'
import {View} from 'react-native'

export const TitleSettingScreenBase: FC<{
  title: string
  instruction?: string
  inputProps?: Partial<InputProps>
  onConfirm: (value: string) => Promise<any>
  nextButtonProps: Fab.NextButtonProps
  initialValue?: string
}> = ({title, inputProps, onConfirm, nextButtonProps, initialValue}) => {
  const [value, setValue] = useState<string>(initialValue || '')
  const promiseBeforeNavigate = useCallback(async () => {
    await onConfirm(value)
  }, [value, onConfirm])

  return <ControlledInput value={value} setValue={setValue} {...inputProps} />
}
