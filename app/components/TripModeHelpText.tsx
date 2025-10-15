import { Text } from '@rneui/themed'
import { FC } from 'react'

export const TripModeHelpText: FC = () => (
    <Text style={{ fontSize: 15, paddingHorizontal: 24, paddingTop: 12 }}>
        {`여행 중 간편하게 사용할 수 있도록\n1.앱을 켜면 ${(<Text>할 일</Text>)} 대신 ${(<Text>예약</Text>)} 페이지를 바로 열어요.\n2.에약 항목을 누르면 ${(<Text>저장한 링크로 바로 연결</Text>)}해요`}
    </Text>
)
