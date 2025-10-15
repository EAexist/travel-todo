import { Divider, useTheme } from '@rneui/themed'
import { FC, useCallback, useRef } from 'react'
import {
    DefaultSectionT,
    ScrollView,
    SectionList,
    SectionListRenderItem,
    TouchableOpacity,
    View,
} from 'react-native'
//
import { BottomSheetModal } from '@/components/BottomSheetModal'
import { $headerRightButtonStyle, HeaderIcon } from '@/components/Header'
import ListSubheader from '@/components/ListSubheader'
import {
    NavigateMenuBottomSheet,
    NavigateMenuData,
} from '@/components/NavigateMenuBottomSheet'
import { Screen } from '@/components/Screen'
import SectionHeader from '@/components/SectionHeader'
import { AccomodationTodo, CompleteTodo } from '@/components/Todo'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { MainTabScreenProps } from '@/navigators/MainTabNavigator'
import { useMainScreenHeader } from '@/utils/useHeader'
import { Observer, observer } from 'mobx-react-lite'
import { Pin } from 'lucide-react-native'

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
    ({}) => {
        const tripStore = useTripStore()

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
            ({ section: { title } }: { section: DefaultSectionT }) => (
                <ListSubheader title={title} />
            ),
            [],
        )

        /* Menu */
        const settingsMenuBottomSheetRef = useRef<BottomSheetModal>(null)

        const handlePinButtonPress = useCallback(() => {
            tripStore.toggleTripMode()
        }, [settingsMenuBottomSheetRef])

        const handleSettingsButtonPress = useCallback(() => {
            settingsMenuBottomSheetRef.current?.present()
        }, [settingsMenuBottomSheetRef])

        const {
            theme: { colors },
        } = useTheme()

        useMainScreenHeader(
            {
                //   title: tripStore.title,
                title: '할 일',
                rightComponent: (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            //   onPress={handlePinButtonPress}
                            disabled
                            style={$headerRightButtonStyle}>
                            {tripStore.isTripMode ? (
                                <Pin />
                            ) : (
                                <Pin fill={colors.text.primary} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSettingsButtonPress}
                            style={$headerRightButtonStyle}>
                            <HeaderIcon name="gear" type="octicon" />
                        </TouchableOpacity>
                    </View>
                ),
            },
            [tripStore.isTripMode],
        )

        const settingsOption: NavigateMenuData[] = [
            {
                title: '할 일 추가',
                path: 'TodolistAdd',
                icon: { name: 'add', type: 'material' },
                primary: true,
            },
            {
                title: '목록 순서 변경',
                path: 'TodolistReorder',
                icon: { name: 'swap-vert', type: 'material' },
            },
            {
                title: '목록에서 할 일 삭제',
                path: 'TodolistDelete',
                icon: { name: 'delete', type: 'material' },
            },
        ]

        return (
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
                            <SectionHeader>완료한 할 일</SectionHeader>
                            <SectionList
                                sections={tripStore.completedTrip}
                                keyExtractor={item => item.id}
                                renderItem={renderItem}
                                renderSectionHeader={renderSectionHeader}
                            />
                        </View>
                    )}
                </ScrollView>
                <NavigateMenuBottomSheet
                    data={settingsOption}
                    ref={settingsMenuBottomSheetRef}
                />
            </Screen>
        )
    },
)

// const SettingsMenuBottomSheet = ({
//   ref,
// }: {
//   ref: RefObject<BottomSheetModal | null>
// }) => {
//   const {useActiveKey, handleBottomSheetModalChange, activate} =
//     useNavigationBottomSheet(ref)
//   const {navigateWithTrip} = useNavigate()
//   useActiveKey(activeKey => navigateWithTrip(activeKey))
//   type NavigateMenuData = {title: string; path: string; primary?: boolean}

//   const settingsMenu: NavigateMenuData[] = [
//     {title: '할 일 추가', path: 'TodolistAdd', primary: true},
//     {title: '목록 순서 변경', path: 'TodolistReorder'},
//     {title: '목록에서 할 일 삭제', path: 'TodolistDelete'},
//   ]

//   const renderSettingsListItem: ListRenderItem<NavigateMenuData> =
//     useCallback(
//       ({item}) => {
//         const handlePress = () => activate(item.path)

//         return (
//           <ListItem onPress={handlePress}>
//             <ListItem.Content>
//               <ListItem.Title primary={item.primary}>
//                 {item.title}
//               </ListItem.Title>
//             </ListItem.Content>
//             <ListItem.Chevron onPress={handlePress} />
//           </ListItem>
//         )
//       },
//       [activate],
//     )

//   return (
//     <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
//       <FlatList
//         data={settingsMenu}
//         renderItem={renderSettingsListItem}
//         keyExtractor={item => item.title}
//       />
//     </BottomSheetModal>
//   )
// }

// // export const SectionTitle = ({title}: {title: string}) => (
// //   <View style={styles.sectionHeaderContainer}>
// //     <Text h3 style={styles.sectionHeaderText}>
// //       <Trans>{title}</Trans>
// //     </Text>
// //   </View>
// // )

// // const styles = StyleSheet.create({
// //   sectionHeaderContainer: {
// //     paddingTop: 20,
// //   },
// //   sectionHeaderText: {
// //     paddingHorizontal: 20, // 1.25rem converted to px
// //     paddingVertical: 6, // 0.375rem converted to px
// //   },
// // })
