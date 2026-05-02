import BottomSheetModal from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { LocalizationProvider } from 'node_modules/@mui/x-date-pickers/esm/LocalizationProvider/LocalizationProvider'
import { FC, useEffect, useRef } from 'react'
import { View } from 'react-native'
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
            <View style={{ paddingHorizontal: 24 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                        value={date}
                        onChange={(value) => value && onDateChange && onDateChange(value)} />
                </LocalizationProvider>
            </View>
        </BottomSheetModal>)
}
