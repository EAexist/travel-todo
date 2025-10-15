import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Note_ } from '@/components/Note'
import { Screen } from '@/components/Screen'
import { useReservationStore } from '@/models'
import { withReservation } from '@/utils/withReservation'
import { useCallback, useState } from 'react'
import { ViewStyle } from 'react-native'

export const ReservationNoteEditScreen = withReservation<'ReservationNoteEdit'>(
    ({ reservation }) => {
        const reservationStore = useReservationStore()

        const [isFocused, setIsFocused] = useState(false)
        const [value, setValue] = useState(reservation.note || '')
        const onConfirm = useCallback(async () => {
            reservation.setProp('note', value)
            reservationStore.patch({
                id: reservation.id,
                note: reservation.note,
            })
        }, [value])

        const [isTextChanged, setIsTextChanged] = useState(false)

        return (
            <Screen>
                <ContentTitle
                    variant="listItem"
                    title={reservation.title}
                    subtitle={reservation.categoryTitle}
                    icon={reservation.icon}
                />
                <ListSubheader title={'메모'} />
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
                    // placeholder="예약 내역 텍스트 붙여넣기"
                />
                <Fab.Container>
                    <Fab.GoBackButton
                        promiseBeforeNavigate={onConfirm}
                        disabled={!isTextChanged}
                    />
                </Fab.Container>
            </Screen>
        )
    },
)

const $listItemContainerStyle: ViewStyle = {
    height: 60,
}
