import {Avatar} from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import {Icon} from '@/components/Icon'
import {Screen} from '@/components/Screen'
import SectionCard from '@/components/SectionCard'
import {useStores, useTripStore} from '@/models'
import {TripStore, TripSummary} from '@/models/stores/TripStore'
import {AppStackScreenProps, useNavigate} from '@/navigators'
import {
  $headerCenterTitleContainerStyle,
  HeaderCenterTitle,
  useHeader,
} from '@/utils/useHeader'
import {useLingui} from '@lingui/react/macro'
import {ListItem} from '@rneui/themed'
import {Chip} from '@rneui/themed'
import {useTheme} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {FlatList, ListRenderItem, TouchableOpacity} from 'react-native'

export const TripListScreen: FC<AppStackScreenProps<'TripList'>> = observer(
  ({navigation}) => {
    const {userStore, fetchTrip} = useStores()
    const tripStore = useTripStore()
    const {navigateWithTrip} = useNavigate()
    const {t} = useLingui()

    const handlePressTripListItem = useCallback(async (tripId: string) => {
      await fetchTrip(tripId).then(() => {
        navigateWithTrip('Main', {screen: 'Todolist'})
      })
    }, [])

    const renderTripListItem: ListRenderItem<TripSummary> = useCallback(
      ({item}) =>
        item.isInitialized ? (
          <TouchableOpacity onPress={() => handlePressTripListItem(item.id)}>
            <SectionCard>
              <ListItem
              // style={$gridItemStyle}
              // containerStyle={$gridListItemContainerStyle}
              // onPress={item.onPress}
              >
                <Avatar />
                <ListItem.Content>
                  <ListItem.Title>{item.title}</ListItem.Title>
                  <ListItem.Subtitle>
                    {[item.scheduleText, item.destination.join(' ')].join('ㆍ')}
                  </ListItem.Subtitle>
                </ListItem.Content>
                {item.id === tripStore.id && <Icon name="star" />}
              </ListItem>
              <ListItem.Chevron />
            </SectionCard>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handlePressTripListItem(item.id)}>
            <SectionCard>
              <ListItem
              // style={$gridItemStyle}
              // containerStyle={$gridListItemContainerStyle}
              // onPress={item.onPress}
              >
                <Avatar />
                <ListItem.Content>
                  <ListItem.Title>
                    여행 설정 완료하기
                    <Icon name="chevron" />
                  </ListItem.Title>
                  <ListItem.Subtitle>{item.title}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
              <ListItem.Chevron />
            </SectionCard>
          </TouchableOpacity>
        ),
      [],
    )

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
  },
)
