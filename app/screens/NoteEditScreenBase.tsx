import ContentTitle, { ContentTitleProps } from '@/components/Layout/Content'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Note_ } from '@/components/Note'
import { Screen } from '@/components/Screen'
import { goBack } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { FC, useCallback, useState } from 'react'

export const NoteEditScreenBase: FC<{
    onConfirm: (value: string) => void
    contentTitleProps?: ContentTitleProps
    initialValue?: string
}> = ({ onConfirm, contentTitleProps, initialValue }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [value, setValue] = useState(initialValue || '')
    const handleConfirmPress = useCallback(() => {
        onConfirm(value)
        goBack()
    }, [value])

    const [isTextChanged, setIsTextChanged] = useState(false)

    useHeader(
        {
            rightActionTitle: '완료',
            onRightPress: handleConfirmPress,
        },
        [handleConfirmPress],
    )

    return (
        <Screen>
            {contentTitleProps && (
                <ContentTitle variant="listItem" {...contentTitleProps} />
            )}
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
                containerStyle={{ paddingBottom: 16 }}
                // placeholder="예약 내역 텍스트 붙여넣기"
            />
        </Screen>
    )
}
