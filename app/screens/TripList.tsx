import * as Fab from '@/components/Fab'
import {Screen} from '@/components/Screen'
import {useStores, useTripStore} from '@/models'
import {TripStore, TripStoreSnapshot} from '@/models/stores/TripStore'
import {useNavigate} from '@/navigators'
import {
  $headerCenterTitleContainerStyle,
  HeaderCenterTitle,
  useHeader,
} from '@/utils/useHeader'
import {useLingui} from '@lingui/react/macro'
import {useTheme} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {FlatList, ListRenderItem} from 'react-native'

export const TripListScreen: FC = observer(() => {
  const {userStore} = useStores()
  const {t} = useLingui()

  const renderTripListItem: ListRenderItem<TripStore> = useCallback(
    ({item}) => <></>,
    [],
  )

  const {navigateWithTrip} = useNavigate()

  const handleSearchPress = useCallback(() => {
    navigateWithTrip('DestinationSearch')
  }, [])

  const {
    theme: {colors},
  } = useTheme()

  useHeader({
    containerStyle: {backgroundColor: colors.secondaryBg},
    centerComponent: <HeaderCenterTitle title="내 여행 목록" />,
    centerContainerStyle: $headerCenterTitleContainerStyle,
    // backNavigateProps: {name: 'Login', ignoreTrip: true},
    // onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
  })

  return (
    <Screen backgroundColor={colors.secondaryBg}>
      <FlatList
        data={userStore.trip}
        renderItem={renderTripListItem}
        keyExtractor={item => item.id}
      />
      <Fab.Container>
        <Fab.NextButton
          title={'새 여행 만들기'}
          navigateProps={{
            name: 'ScheduleSetting',
          }}
        />
      </Fab.Container>
    </Screen>
  )
})
