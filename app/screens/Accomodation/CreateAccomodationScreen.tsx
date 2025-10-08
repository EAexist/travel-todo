import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import { FC, useCallback } from 'react'
import { View } from 'react-native'

export const CreateAccomodationScreen: FC = () => {
  const handlePressUpload = useCallback(async () => {}, [])

  return (
    <Screen>
      <ContentTitle
        title={'숙박 예약 내역 화면을\n캡쳐해서 업로드해주세요'}
        subtitle={'예약 정보를 자동으로 정리해드릴게요'}
      />
      <View></View>
      <Fab.Container>
        <Fab.Button title={'화면 캡쳐 올리기'} onPress={handlePressUpload} />
      </Fab.Container>
    </Screen>
  )
}
