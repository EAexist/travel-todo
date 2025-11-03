import { AuthenticatedStackScreenProps, navigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { FC } from 'react'
import { TripListScreenBase } from './TripListScreenBase'

export const TripListScreen: FC<
    AuthenticatedStackScreenProps<'TripList'>
> = ({}) => {
    useHeader(
        {
            backgroundColor: 'secondary',
            rightActionTitle: '삭제',
            onRightPress: () => navigate('TripDelete'),
        },
        [],
    )

    return <TripListScreenBase />
}
