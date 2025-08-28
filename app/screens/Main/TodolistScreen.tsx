import {Trans} from '@lingui/react/macro'
import {Divider, Icon, ListItem, Text} from '@rneui/themed'
import {FC, RefObject, useCallback, useEffect, useRef} from 'react'
import {
  DefaultSectionT,
  FlatList,
  ListRenderItem,
  ScrollView,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
//
import {
  BottomSheetModal,
  useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {AccomodationTodo, CompleteTodo} from '@/components/Todo'
import {useStores, useTripStore} from '@/models'
import {Todo} from '@/models/Todo'
import {useNavigate} from '@/navigators'
import {MainTabScreenProps} from '@/navigators/MainTabNavigator'
import {useHeader} from '@/utils/useHeader'
import {Observer, observer} from 'mobx-react-lite'

// const SettingsDialog: FC = ({ visible6: boolean }) => {
//   return (
//     <Dialog isVisible={visible6}>
//       <Dialog.Title title="Choose Account" />
//       {userlist.map((l, i) => (
//         <ListItem
//           key={i}
//           containerStyle={{
//             marginHorizontal: -10,
//             borderRadius: 8,
//           }}
//           onPress={toggleDialog6}
//         >
//           <Avatar rounded source={{ uri: l.avatar_url }} />
//           <ListItem.Content>
//             <ListItem.Title style={{ fontWeight: '700' }}>
//               {l.name}
//             </ListItem.Title>
//             <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
//           </ListItem.Content>
//         </ListItem>
//       ))}
//     </Dialog>
//   )
// }

export const TodolistScreen: FC<MainTabScreenProps<'Todolist'>> = observer(
  ({route}) => {
    const rootStore = useStores()
    const {tripStore} = rootStore

    // const { tripId } = route.params

    // useEffect(() => {
    //     rootStore.fetchTrip(tripId)
    // }, [tripId])

    const renderItem: SectionListRenderItem<Todo, DefaultSectionT> = ({
      item,
    }) => (
      <Observer
        render={() => {
          switch (item.type) {
            case 'accomodation':
              return <AccomodationTodo todo={item} />
            case 'passport':
              return <CompleteTodo todo={item} />
            default:
              return <CompleteTodo todo={item} />
          }
        }}
      />
    )

    const renderSectionHeader = useCallback(
      ({section: {title}}: {section: DefaultSectionT}) => (
        <ListSubheader title={title} />
      ),
      [],
    )

    /* SettingList */

    const settingsDropDownBottomSheetRef = useRef<BottomSheetModal>(null)

    const handleSettingsButtonPress = useCallback(() => {
      settingsDropDownBottomSheetRef.current?.present()
    }, [settingsDropDownBottomSheetRef])

    useHeader({
      backButtonShown: false,
      leftComponent: (
        <TouchableOpacity style={{flexDirection: 'row'}}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            h2
            h2Style={{lineHeight: 40}}>
            {tripStore.title}
          </Text>
          <View style={styles.headerRightButton}>
            <Icon name="arrow-drop-down" color="#333d4b" size={24} />
          </View>
        </TouchableOpacity>
      ),
      rightComponent: (
        <TouchableOpacity
          onPress={handleSettingsButtonPress}
          style={styles.headerRightButton}>
          <Icon name="settings" color="#333d4b" size={24} />
        </TouchableOpacity>
      ),
      leftContainerStyle: styles.headerLeftContainer,
      rightContainerStyle: styles.headerRightContainer,
    })
    return (
      //   <GestureHandlerRootViewWrapper>
      <Screen>
        <ScrollView>
          <View>
            <SectionList
              sections={tripStore.incompleteTrip}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
          </View>
          {tripStore.completedTrip.length > 0 && (
            <View>
              <Divider />
              <SectionTitle title={'완료했어요'} />
              <SectionList
                sections={tripStore.completedTrip}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
              />
            </View>
          )}
        </ScrollView>
        <SettingsDropDownBottomSheet ref={settingsDropDownBottomSheetRef} />
      </Screen>
      //   </GestureHandlerRootViewWrapper>
    )
  },
)

const SettingsDropDownBottomSheet = ({
  ref,
}: {
  ref: RefObject<BottomSheetModal | null>
}) => {
  const {useActiveKey, handleBottomSheetModalChange, activate} =
    useNavigationBottomSheet(ref)
  const {navigateWithTrip} = useNavigate()
  useActiveKey(activeKey => navigateWithTrip(activeKey))
  type SettingsListItemData = {title: string; path: string; primary?: boolean}

  const settingsMenu: SettingsListItemData[] = [
    {title: '할 일 추가', path: 'TodolistAdd', primary: true},
    {title: '목록 순서 변경', path: 'TodolistReorder'},
    {title: '목록에서 할 일 삭제', path: 'TodolistDelete'},
  ]

  const renderSettingsListItem: ListRenderItem<SettingsListItemData> =
    useCallback(
      ({item}) => {
        const handlePress = () => activate(item.path)

        return (
          <ListItem onPress={handlePress}>
            <ListItem.Content>
              <ListItem.Title primary={item.primary}>
                {item.title}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron onPress={handlePress} />
          </ListItem>
        )
      },
      [activate],
    )

  return (
    <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
      <FlatList
        data={settingsMenu}
        renderItem={renderSettingsListItem}
        keyExtractor={item => item.title}
      />
    </BottomSheetModal>
  )
}

export const SectionTitle = ({title}: {title: string}) => (
  <View style={styles.sectionHeaderContainer}>
    <Text h3 style={styles.sectionHeaderText}>
      <Trans>{title}</Trans>
    </Text>
  </View>
)

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 24,
  },
  headerRightButton: {
    alignItems: 'center',
    borderRadius: 100, // 6.25rem converted to 100 for full circle
    justifyContent: 'center',
    padding: 8, // 0.5rem converted to px,
  },
  headerRightContainer: {
    flexBasis: 'auto',
    flexGrow: 0,
    paddingRight: 8,
  },
  sectionHeaderContainer: {
    paddingTop: 20,
  },
  sectionHeaderText: {
    paddingHorizontal: 20, // 1.25rem converted to px
    paddingVertical: 6, // 0.375rem converted to px
  },
})
