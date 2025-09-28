import * as Fab from '@/components/Fab'
import { ControlledInput } from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { withReservation } from '@/utils/withReservation'
import { useCallback, useState } from 'react'
import { ViewStyle } from 'react-native'

export const EditReservationLinkScreen = withReservation<'EditReservationLink'>(
  ({ reservation }) => {
    const { reservationStore } = useStores()

    const [isFocused, setIsFocused] = useState(false)
    const [value, setValue] = useState(reservation.primaryHrefLink || '')
    const onConfirm = useCallback(async () => {
      reservation.setProp('primaryHrefLink', value)
      reservationStore.patch({
        id: reservation.id,
        primaryHrefLink: reservation.note,
      })
    }, [value])

    return (
      <Screen>
        <ContentTitle
          variant="listItem"
          title={reservation.title}
          subtitle={reservation.categoryTitle}
          icon={reservation.icon}
        />
        <ListSubheader title={'링크'} />
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
