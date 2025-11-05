import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Note_ } from '@/components/Note'
import { Screen } from '@/components/Screen/Screen'
import { AuthenticatedStackScreenProps, useNavigate } from '@/navigators'
import { useLoadingScreen } from '@/screens/Loading'
import { useActionsWithApiStatus } from '@/utils/useApiStatus'
import { useHeader } from '@/utils/useHeader'
import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { useReservationCreateTexts } from './ReservationCreateScreen'

export const ReservationCreateFromTextScreen: FC<
    AuthenticatedStackScreenProps<'ReservationCreateFromText'>
> = ({ route: { params } }) => {
    const { createReservationFromTextWithApiStatus } = useActionsWithApiStatus()

    const { navigateWithTrip } = useNavigate()
    const [value, setValue] = useState('')
    const [isTextChanged, setIsTextChanged] = useState(false)
    const [isFocused, setIsFocused] = useState(true)

    const inputRef = useRef<TextInput>(null)

    const isTextTooShort = value.length < 10

    const handlePressReservationCreateButton = useCallback(async () => {
        setIsTextChanged(false)
        if (!isTextTooShort) {
            await createReservationFromTextWithApiStatus({
                args: value,
                onSuccess: () => navigateWithTrip('ReservationConfirmFromText'),
            })
            //   if (kind === 'ok') {
            //     if (reservationIdList && reservationIdList?.length > 0) {
            //       navigateWithTrip('ReservationConfirmFromText', { reservationIdList })
            //     } else {
            //       navigateWithTrip('ReservationNotFoundFromText')
            //     }
            //   }
        }
    }, [value])

    const handleReset = useCallback(() => {
        setValue('')
        inputRef.current?.focus()
    }, [inputRef.current])

    useLoadingScreen({ pendingIndicatorTitle: ['예약 내역을 읽는 중이에요'] })

    useLayoutEffect(() => {
        inputRef.current?.focus()
    }, [inputRef.current])

    useHeader(
        isFocused && value.length > 0
            ? {
                  rightActionTitle: '초기화',
                  onRightPress: handleReset,
              }
            : {
                  rightActionTitle: '',
                  onRightPress: () => {},
              },
        [isFocused, value.length],
    )

    const { instruction, placeholder } = useReservationCreateTexts(
        params.category,
    )
    return (
        <Screen>
            <ContentTitle
                // title={'새 예약'}
                subtitle={instruction}
            />
            <Note_
                autoFocus
                onBlur={() => {
                    setIsFocused(false)
                }}
                onFocus={() => {
                    setIsFocused(true)
                }}
                value={value}
                onChangeText={(text: string) => {
                    setIsTextChanged(true)
                    setValue(text)
                }}
                placeholder={placeholder}
                ref={inputRef}
            />
            <Fab.Container>
                <Fab.Button
                    onPress={handlePressReservationCreateButton}
                    disabled={isTextTooShort}
                    title={
                        isTextTooShort
                            ? '10자 이상 입력해주세요'
                            : '예약 추가하기'
                    }
                />
            </Fab.Container>
        </Screen>
    )
}
