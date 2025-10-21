import * as Fab from '@/components/Fab'
import { ControlledInput } from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import { useReservationStore } from '@/models'
import { withReservation } from '@/utils/withReservation'
import { useCallback, useState } from 'react'
import { ViewStyle } from 'react-native'

export const ReservationLinkEditScreen = withReservation<'ReservationLinkEdit'>(
    ({ reservation }) => {
        const [isFocused, setIsFocused] = useState(false)
        const [value, setValue] = useState(reservation.primaryHrefLink || '')
        const onConfirm = useCallback(async () => {
            reservation.setProp('primaryHrefLink', value)
            reservation.patch({
                primaryHrefLink: reservation.primaryHrefLink,
            })
        }, [value])

        let linkLabel = '링크'
        switch (reservation.category) {
            case 'VISIT_JAPAN':
                linkLabel = 'Visit Japan QR코드 페이지 링크'
            default:
                break
        }
        return (
            <Screen>
                <ContentTitle
                    variant="listItem"
                    title={reservation.title}
                    subtitle={reservation.categoryTitle}
                    icon={reservation.icon}
                />
                <ListSubheader title={linkLabel} />
                <ControlledInput
                    value={value}
                    onChangeText={setValue}
                    autoFocus={!reservation.primaryHrefLink}
                />
                <Fab.Container>
                    <Fab.GoBackButton
                        title={'확인'}
                        disabled={value === (reservation.primaryHrefLink || '')}
                        promiseBeforeNavigate={onConfirm}
                    />
                </Fab.Container>
            </Screen>
        )
    },
)

const $listItemContainerStyle: ViewStyle = {
    height: 60,
}
