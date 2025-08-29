import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useTripStore} from '@/models'
import {Destination} from '@/models/Destination'
import {useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useLingui} from '@lingui/react/macro'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {FlatList, ListRenderItem, TouchableOpacity, View} from 'react-native'

export const TripListScreen: FC = observer(() => {
  const tripStore = useTripStore()
  const {t} = useLingui()

  const renderDestinationListItem: ListRenderItem<Destination> = useCallback(
    ({item}) => <DestinationListItem key={item.id} destination={item} />,
    [],
  )

  const {navigateWithTrip} = useNavigate()

  const handleSearchPress = useCallback(() => {
    navigateWithTrip('DestinationSearch')
  }, [])
  //   const handleNextPress = useCallback(async () => {
  //     tripStore.patch()
  //   }, [])

  const {titleText, subtitlteText} = tripStore.isDestinationSet
    ? {
        titleText: `다른 도시도 여행할 예정인가요?`,
        subtitlteText: `여행 중 여행할 도시를 모두 추가해주세요.`,
      }
    : {
        titleText: `어디로 떠나시나요?`,
        subtitlteText: `여행 중 여행할 도시를 모두 추가해주세요.`,
      }

  //   const handleBackPressBeforeNavigate = useCallback(async () => {}, [])

  useHeader({
    backButtonShown: false,
    // backNavigateProps: {name: 'Login', ignoreTrip: true},
    // onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
  })

  return (
    <Screen>
      <ContentTitle title={titleText} subtitle={subtitlteText} />
      <View style={{paddingVertical: 16, flex: 1}}>
        <TouchableOpacity onPress={handleSearchPress}>
          <Input.SearchBase placeholder={t`도시 또는 국가 검색`} />
        </TouchableOpacity>
      </View>
      {tripStore.isDestinationSet && (
        <View>
          <ListSubheader
            title={`선택한 여행지 (${tripStore.destination.length})`}
          />
          <FlatList
            data={tripStore.destination}
            renderItem={renderDestinationListItem}
            keyExtractor={item => item.id}
          />
        </View>
      )}
      <Fab.Container>
        <Fab.NextButton
          title={tripStore.isDestinationSet ? '다음' : '건너뛰기'}
          navigateProps={{
            name: 'ScheduleSetting',
          }}
        />
      </Fab.Container>
    </Screen>
  )
})
