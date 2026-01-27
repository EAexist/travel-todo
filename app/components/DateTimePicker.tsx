import BottomSheetModal from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'
import { FC, useEffect, useRef } from 'react'
import * as DatePickerRN from 'react-native-date-picker'

export interface DateTimePickerProps extends Omit<DatePickerRN.DatePickerProps, 'date' | 'open'> {
    title: string,
    onDismiss: (() => void),
    date?: Date
    open: boolean
}

export const DateTimePicker: FC<DateTimePickerProps> = ({ title, onDismiss, open, date, onDateChange }) => {

    const ref = useRef<BottomSheetModal>(null)

    useEffect(() => {
        if (open) {
            ref.current?.present()
        }
        else {
            ref.current?.close()
        }
    }, [open])
    return (

        <BottomSheetModal
            ref={ref}
            onDismiss={onDismiss}>
            <ContentTitle title={title} />
            <DatePickerRN
                date={date}
                onDateChange={onDateChange}
            />
        </BottomSheetModal>)
}
