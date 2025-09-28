import { ControlledInput } from '@/components/Input'
import { InputProps } from '@rneui/themed'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { View } from 'react-native'

interface _NoteProps extends InputProps {
  onChangeText: (value: string) => void
}

export const Note_ = ({ ref, ...props }: _NoteProps) => {
  return (
    <View
      style={{
        flexShrink: 1,
      }}>
      <ControlledInput
        multiline
        numberOfLines={24}
        containerStyle={{ flexShrink: 1 }}
        inputContainerStyle={{
          flexShrink: 1,
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        ref={ref}
        {...props}
      />
    </View>
  )
}

interface NoteProps extends InputProps {
  initialValue?: string
  isFocused?: boolean
  setIsFocused?: Dispatch<SetStateAction<boolean>>
  setValue?: Dispatch<SetStateAction<string>>
  onChangeText: (value: string) => void
}

export const Note = ({
  onChangeNote,
  initialValue,
  isFocused,
  setIsFocused,
  ...props
}: NoteProps) => {
  const [value, setValue] = useState(initialValue)
  const [_isFocused, _setIsFocused] = useState(false)

  useEffect(() => {
    if (setIsFocused && !isFocused && onChangeNote && value) {
      onChangeNote(value)
    }
  }, [isFocused, value])

  useEffect(() => {
    if (!setIsFocused && !_isFocused && onChangeNote && value) {
      onChangeNote(value)
    }
  }, [_isFocused, value])

  return (
    <View
      style={{
        flexShrink: 1,
      }}>
      <ControlledInput
        setValue={setValue}
        value={value}
        autoFocus={!initialValue}
        onBlur={() => {
          if (setIsFocused) {
            setIsFocused(false)
          } else {
            _setIsFocused(false)
          }
        }}
        onFocus={() => {
          if (setIsFocused) {
            setIsFocused(true)
          } else {
            _setIsFocused(true)
          }
        }}
        multiline
        numberOfLines={24}
        containerStyle={{ flexShrink: 1 }}
        inputContainerStyle={{
          flexShrink: 1,
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        {...props}
      />
    </View>
  )
}
