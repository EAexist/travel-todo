// import ContentTitle from '@/components/Layout/Content'
// import ListSubheader from '@/components/ListItem/ListSubheader'
// import { Screen } from '@/components/Screen'
// import { TodolistSectionT, TodolistWithTab } from '@/components/TodoList'
// import { isSupplyCategory, Todo } from '@/models/Todo'
// import { typography } from '@/rneui/theme'
// import { IconNode } from '@rneui/base'
// import { TabView, Text } from '@rneui/themed'
// import { Divider, Tab } from '@rneui/themed'
// import { observer } from 'mobx-react-lite'
// import {
//     ComponentType,
//     PropsWithChildren,
//     ReactNode,
//     useCallback,
//     useState,
// } from 'react'
// import { View } from 'react-native'
// import {
//     DefaultSectionT,
//     ScrollView,
//     SectionList,
//     SectionListProps,
// } from 'react-native'

// export interface TodolistEditScreenBaseProps<SectionT = DefaultSectionT>
//     extends Pick<
//         SectionListProps<any, SectionT>,
//         | 'renderItem'
//         | 'renderSectionHeader'
//         | 'sections'
//         | 'keyExtractor'
//         | 'renderSectionFooter'
//     > {
//     title: string
//     instruction?: string
//     Todo?: ComponentType<{ item: Todo }>
//     renderTabIcon?: (isTodo: boolean) => ReactNode
// }

// const TodolistEditScreenBase = observer(function <TodolistSectionT>({
//     // headerRightComponent,
//     title,
//     instruction,
//     renderItem,
//     renderSectionHeader,
//     renderSectionFooter,
//     Todo,
//     sections,
//     children,
//     keyExtractor,
//     renderTabIcon,
// }: PropsWithChildren<TodolistEditScreenBaseProps<TodolistSectionT>>) {
//     const [activeTabIndex, setActiveTabIndex] = useState(0)
//     // Handler for tab changes
//     const handleTabChange = useCallback(
//         (newIndex: number) => {
//             setActiveTabIndex(newIndex)
//         },
//         [setActiveTabIndex],
//     )
//     const renderSectionHeaderInner = useCallback(
//         ({ section: { title } }: { section: DefaultSectionT }) => (
//             <ListSubheader size="xlarge" title={title} />
//         ),
//         [],
//     )

//     const renderSectionFooterInner = useCallback(
//         ({ section: { isLast } }: { section: DefaultSectionT }) =>
//             !isLast ? <Divider /> : null,
//         [],
//     )

//     const keyExtractorInner = useCallback((item: any) => item.id, [])

//     const todoSections = sections.filter(({ category }) =>
//         isSupplyCategory(category),
//     )

//     const supplySections = sections.filter(
//         ({ category }) => !isSupplyCategory(category),
//     )

//     // const numOfWorkToAdd

//     return (
//         <Screen>
//             <ContentTitle title={title} subtitle={instruction} />
//             <TodolistWithTab sections={sections} />
//             <Tab value={activeTabIndex} onChange={handleTabChange}>
//                 <Tab.Item
//                     title={'할 일'}
//                     icon={renderTabIcon && (renderTabIcon(true) as IconNode)}
//                     iconRight
//                 />
//                 <Tab.Item
//                     title={'짐'}
//                     icon={renderTabIcon && (renderTabIcon(false) as IconNode)}
//                     iconRight
//                 />
//             </Tab>
//             <View style={{ flex: 1, paddingTop: 16 }}>
//                 <TabView
//                     value={activeTabIndex}
//                     onChange={handleTabChange}
//                     containerStyle={{ overflow: 'hidden' }}>
//                     <TabView.Item style={{ flex: 1 }}>
//                         <SectionList
//                             sections={todoSections}
//                             keyExtractor={keyExtractor || keyExtractorInner}
//                             renderItem={renderItem}
//                             renderSectionHeader={
//                                 renderSectionHeader || renderSectionHeaderInner
//                             }
//                             renderSectionFooter={
//                                 renderSectionFooter || renderSectionFooterInner
//                             }
//                         />
//                     </TabView.Item>
//                     <TabView.Item style={{ flex: 1 }}>
//                         <SectionList
//                             sections={supplySections}
//                             keyExtractor={keyExtractor || keyExtractorInner}
//                             renderItem={renderItem}
//                             renderSectionHeader={
//                                 renderSectionHeader || renderSectionHeaderInner
//                             }
//                             renderSectionFooter={
//                                 renderSectionFooter || renderSectionFooterInner
//                             }
//                         />
//                     </TabView.Item>
//                 </TabView>
//             </View>
//             {/* <ScrollView>
//                 <SectionList
//                     scrollEnabled={false}
//                     sections={todoSections}
//                     keyExtractor={keyExtractor || keyExtractorInner}
//                     renderItem={renderItem}
//                     renderSectionHeader={
//                         renderSectionHeader || renderSectionHeaderInner
//                     }
//                     renderSectionFooter={
//                         renderSectionFooter || renderSectionFooterInner
//                     }
//                 />
//                 <SectionList
//                     scrollEnabled={false}
//                     sections={supplySections}
//                     keyExtractor={keyExtractor || keyExtractorInner}
//                     renderItem={renderItem}
//                     renderSectionHeader={
//                         renderSectionHeader || renderSectionHeaderInner
//                     }
//                     renderSectionFooter={
//                         renderSectionFooter || renderSectionFooterInner
//                     }
//                 />
//             </ScrollView> */}
//             {children}
//         </Screen>
//     )
// })

// export default TodolistEditScreenBase

// // const styles = StyleSheet.create({
// //   TodolistEditScreenBase: {
// //     backgroundColor: '#ffffff',
// //     flex: 1,
// //     paddingBottom: 12, // Corresponds to 0.75rem bottom padding
// //   },
// //   DoneText: {
// //     color: '#333d4b',
// //     fontFamily: 'Roboto',
// //     fontSize: 15,
// //     letterSpacing: 0.46,
// //     lineHeight: 26,
// //     textAlign: 'left',
// //   },
// //   Line1: {
// //     height: 1, // Corresponds to 0.0625rem border
// //     width: '100%', // Corresponds to 375px width
// //     backgroundColor: '#f2f4f6',
// //     marginTop: 0,
// //   },
// //   TabCountText: {
// //     color: '#006ffd',
// //     fontFamily: 'PretendardVariable',
// //     fontSize: 17,
// //     lineHeight: 24,
// //     marginLeft: 4,
// //     textAlign: 'left', // Corresponds to 0.25rem gap for count
// //   },
// //   TabTextActive: {
// //     color: '#333d4b',
// //     fontFamily: 'PretendardVariable',
// //     fontSize: 17,
// //     lineHeight: 24,
// //     textAlign: 'left',
// //   },
// //   TabTextInactive: {
// //     color: '#6b7684',
// //     fontFamily: 'PretendardVariable',
// //     fontSize: 17,
// //     lineHeight: 24,
// //     textAlign: 'left',
// //   },
// //   TabsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'flex-start',
// //     alignItems: 'flex-start',
// //     paddingHorizontal: 20, // Corresponds to 1.25rem padding
// //     gap: 16, // Corresponds to 1rem gap
// //   },
// // })
