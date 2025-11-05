import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen/Screen'
import { AuthenticatedStackScreenProps, goBack } from '@/navigators'
import { FC, useCallback } from 'react'

export const ReservationNotFoundFromText: FC<
    AuthenticatedStackScreenProps<'ReservationNotFoundFromText'>
> = () => {
    const handlePressConfirm = useCallback(() => {
        goBack()
    }, [])

    return (
        <Screen>
            <ContentTitle
                title={'예약 내역을 찾을 수 없어요'}
                subtitle={'붙여넣은 텍스트를 확인하고 다시 시도해주세요.'}
            />
            <Icon name="🤔" type="tossface" size={36} />
            <Fab.Container>
                <Fab.Button title={'확인'} onPress={handlePressConfirm} />
            </Fab.Container>
        </Screen>
    )
}
