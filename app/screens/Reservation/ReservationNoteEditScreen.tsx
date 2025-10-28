import { withReservation } from '@/utils/withReservation'
import { useCallback } from 'react'
import { NoteEditScreenBase } from '../NoteEditScreenBase'

export const ReservationNoteEditScreen = withReservation<'ReservationNoteEdit'>(
    ({ reservation }) => {
        const onConfirm = useCallback((value: string) => {
            reservation.setProp('note', value)
            reservation.patch({
                note: reservation.note,
            })
        }, [])

        return (
            <NoteEditScreenBase
                initialValue={reservation.note || undefined}
                onConfirm={onConfirm}
                contentTitleProps={{
                    title: reservation.title,
                    subtitle: reservation.categoryTitle,
                    icon: reservation.icon,
                }}
            />
        )
    },
)
