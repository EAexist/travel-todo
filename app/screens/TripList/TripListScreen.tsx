import { AuthenticatedStackScreenProps, navigate } from '@/navigators'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { FC } from 'react'
import { TripListScreenBase } from './TripListScreenBase'

export const TripListScreen: FC<
    AuthenticatedStackScreenProps<'TripList'>
> = ({}) => {
    useHeader({
        backgroundColor: 'secondary',
        rightActionTitle: '삭제',
        onRightPress: () => navigate('TripDelete'),
        centerComponent: <HeaderCenterTitle title={'여행 목록'} />,
    })

    return <TripListScreenBase />
}
