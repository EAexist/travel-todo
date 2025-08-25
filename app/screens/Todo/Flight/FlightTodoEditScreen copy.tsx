// import {Avatar} from '@/components/Avatar'
// import {GestureHandlerRootViewWrapper} from '@/components/BottomSheetModal'
// import * as Fab from '@/components/Fab'
// import {Title} from '@/components/Layout/Content'
// import {Screen} from '@/components/Screen'
// import {TextInfoListItem} from '@/components/TextInfoListItem'
// import {TransText} from '@/components/TransText'
// import {useStores} from '@/models'
// import {Todo} from '@/models/Todo'
// import {AppStackParamList, goBack, useNavigate} from '@/navigators'
// import {useHeader} from '@/utils/useHeader'
// import {ListItem} from '@rneui/themed'
// import {observer} from 'mobx-react-lite'
// import {
//   Dispatch,
//   FC,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useState,
// } from 'react'
// import {View, ViewStyle} from 'react-native'

// export const TodoConfirmListItem: FC<{
//   todo: Todo
//   isCompleted: boolean
//   onChange: () => void
// }> = ({isCompleted, onChange}) => {
//   //   const handleCompletePress = useCallback(() => {
//   //     setIsCompleted(prev => !prev)
//   //   }, [setIsCompleted])

//   return (
//     <TextInfoListItem
//       title={'상태'}
//       rightContent={
//         <ListItem.CheckBox
//           onPress={onChange}
//           checked={isCompleted}
//           checkedIcon="dot-circle-o"
//           uncheckedIcon="circle-o"
//           size={24}
//         />
//       }>
//       <TransText primary={isCompleted}>
//         {isCompleted ? '완료' : '미완료'}
//       </TransText>
//     </TextInfoListItem>
//   )
// }

// const useTodoConfirmListItem = (
//   todo: Todo,
//   confirmScreen: keyof AppStackParamList,
//   isBeforeInitialization = false,
// ) => {
//   const [isCompleted, setIsCompleted] = useState(todo.isCompleted)

//   const {
//     tripStore: {patchTodo, completeAndPatchTodo},
//   } = useStores()
//   const {navigateWithTrip} = useNavigate()

//   const handleConfirm = useCallback(async () => {
//     console.log(
//       `[confirmCompleteNavigate] todo.isCompleted=${todo.isCompleted} isCompleted=${isCompleted}`,
//     )
//     if (!todo.isCompleted && isCompleted) {
//       navigateWithTrip(confirmScreen, {todoId: todo.id})
//     } else if (todo.isCompleted && !isCompleted) {
//       todo.setIncomplete()
//       patchTodo(todo).then(() => {
//         goBack()
//       })
//     } else {
//       goBack()
//     }
//   }, [completeAndPatchTodo, todo, todo.isCompleted, isCompleted])

//   return {
//     isCompleted,
//     setIsCompleted,
//     handleConfirm,
//   }
// }

// export const FlightTodoEditScreen: FC<{
//   todo: Todo
//   isBeforeInitialization?: boolean
// }> = observer(({todo, isBeforeInitialization = false}) => {
//   //   const [isConfirmed, setIsConfirmed] = useState(false)
//   //   const [isCompleted, setIsCompleted] = useState(false)
//   const {navigateWithTrip} = useNavigate()
//   const {tripStore} = useStores()

//   //   const [isCompleted, setIsCompleted] = useState(false)

//   useEffect(() => {
//     console.log('Hello [FlightTodoEditScreen')
//   }, [])

//   const {
//     tripStore: {patchTodo, completeAndPatchTodo},
//   } = useStores()

//   const {isCompleted, setIsCompleted} = useTodoConfirmListItem(
//     todo,
//     'ConfirmFlight',
//     isBeforeInitialization,
//   )

//   const handleConfirm = useCallback(async () => {
//     if (!todo.isCompleted && isCompleted) {
//       navigateWithTrip('ConfirmFlight', {todoId: todo.id})
//     } else if (todo.isCompleted && !isCompleted) {
//       todo.setIncomplete()
//       patchTodo(todo).then(() => {
//         goBack()
//       })
//     } else {
//       goBack()
//     }
//   }, [patchTodo, todo, todo.isCompleted, isCompleted])

//   const handleNotePress = useCallback(() => {
//     console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
//     navigateWithTrip('TodoNote', {
//       todoId: todo.id,
//     })
//   }, [navigateWithTrip, todo.id])

//   const handleDeparturePress = useCallback(() => {
//     navigateWithTrip('DepartureAirportSetting')
//   }, [])

//   const handleArrivalPress = useCallback(() => {
//     navigateWithTrip('ArrivalAirportSetting')
//   }, [])

//   const handleBackPressBeforeNavigate = useCallback(async () => {
//     if (isBeforeInitialization) await tripStore.deleteTodo(todo)
//   }, [isBeforeInitialization])

//   useHeader({
//     onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
//     // centerComponent: (
//     //   <View style={$headerTitleStyle}>
//     //     <TransText>✈️ 항공권 예약</TransText>
//     //   </View>
//     // ),
//     // centerContainerStyle: {flexGrow: 1, flexBasis: 1, justifyContent: 'center'},
//   })

//   const handleChange = useCallback(() => {
//     setIsCompleted(prev => !prev)
//     console.log(isCompleted)
//   }, [setIsCompleted, isCompleted])

//   return (
//     <GestureHandlerRootViewWrapper>
//       <Screen>
//         <Title>
//           <ListItem>
//             <Avatar icon={{name: '✈️'}} size="xlarge" fontSize={28} />
//             <ListItem.Content>
//               <ListItem.Title>{todo.title}</ListItem.Title>
//             </ListItem.Content>
//           </ListItem>
//         </Title>
//         <TextInfoListItem
//           title={'출발'}
//           rightContent={<ListItem.Chevron />}
//           onPress={handleDeparturePress}>
//           <TransText style={{fontWeight: 600}}>
//             {todo.departure
//               ? `${todo.departure?.name} ${todo.departure?.IATACode ? `(${todo.departure?.IATACode})` : ''}`
//               : '출발지 입력하기'}
//           </TransText>
//         </TextInfoListItem>
//         <TextInfoListItem
//           title={'도착'}
//           rightContent={<ListItem.Chevron />}
//           onPress={handleArrivalPress}>
//           <TransText style={{fontWeight: 600}}>
//             {todo.arrival
//               ? `${todo.arrival?.name} ${todo.arrival?.IATACode ? `(${todo.arrival?.IATACode})` : ''}`
//               : '도착지 입력하기'}
//           </TransText>
//         </TextInfoListItem>
//         {/* <Divider /> */}
//         <TodoConfirmListItem
//           todo={todo}
//           isCompleted={isCompleted}
//           onChange={handleChange}
//         />
//         <TextInfoListItem
//           onPress={handleNotePress}
//           title={'메모'}
//           rightContent={<ListItem.Chevron />}>
//           <TransText primary>{todo.note || '메모를 남겨보세요'}</TransText>
//         </TextInfoListItem>
//         <Fab.Container>
//           <Fab.Button onPress={handleConfirm} title={'확인'} />
//         </Fab.Container>
//       </Screen>
//     </GestureHandlerRootViewWrapper>
//   )
// })

// export const FlightTicketTodoEditScreen: FC<{
//   todo: Todo
//   isBeforeInitialization?: boolean
// }> = observer(({todo, isBeforeInitialization = false}) => {
//   //   const [isConfirmed, setIsConfirmed] = useState(false)
//   //   const [isCompleted, setIsCompleted] = useState(false)
//   const {navigateWithTrip} = useNavigate()
//   const {tripStore} = useStores()

//   //   const [isCompleted, setIsCompleted] = useState(false)

//   useEffect(() => {
//     console.log('Hello [FlightTicketTodoEditScreen]')
//   }, [])

//   const {
//     tripStore: {patchTodo},
//   } = useStores()

//   const {isCompleted, setIsCompleted} = useTodoConfirmListItem(
//     todo,
//     'ConfirmFlight',
//     isBeforeInitialization,
//   )

//   const handleUpload = useCallback(async () => {
//     console.log('handleUpload')
//   }, [])

//   const handleNotePress = useCallback(() => {
//     console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
//     navigateWithTrip('TodoNote', {
//       todoId: todo.id,
//     })
//   }, [navigateWithTrip, todo.id])

//   //   const handleBackPressBeforeNavigate = useCallback(async () => {
//   //     if (isBeforeInitialization) await tripStore.deleteTodo(todo)
//   //   }, [isBeforeInitialization])

//   //   useHeader({
//   //     onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
//   //   })

//   const handleConfirm = useCallback(async () => {
//     if (!todo.isCompleted && isCompleted) {
//       navigateWithTrip('ConfirmFlightTicket', {todoId: todo.id})
//     } else if (todo.isCompleted && !isCompleted) {
//       todo.setIncomplete()
//       patchTodo(todo).then(() => {
//         goBack()
//       })
//     } else {
//       goBack()
//     }
//   }, [patchTodo, todo, todo.isCompleted, isCompleted])

//   const handleChange = useCallback(() => {
//     setIsCompleted(prev => !prev)
//     console.log(isCompleted)
//   }, [setIsCompleted, isCompleted])

//   return (
//     <GestureHandlerRootViewWrapper>
//       <Screen>
//         <Title>
//           <ListItem>
//             <Avatar icon={{name: '✈️'}} size="xlarge" />
//             <ListItem.Content>
//               <ListItem.Title
//                 style={{
//                   fontFamily: 'Pretendard',
//                   fontWeight: 600,
//                   fontSize: 21,
//                   lineHeight: 1.6 * 22,
//                 }}>
//                 {todo.title}
//               </ListItem.Title>
//             </ListItem.Content>
//           </ListItem>
//         </Title>
//         {todo.departure && (
//           <View>
//             <TextInfoListItem title={'출발'}>
//               <TransText style={{fontWeight: 600}}>
//                 {`${todo.departure?.name} ${
//                   todo.departure?.IATACode
//                     ? `(${todo.departure?.IATACode})`
//                     : ''
//                 }`}
//               </TransText>
//             </TextInfoListItem>
//             <TextInfoListItem title={'도착'}>
//               <TransText style={{fontWeight: 600}}>
//                 {`${todo.arrival?.name} ${todo.arrival?.IATACode ? `(${todo.arrival?.IATACode})` : ''}`}
//               </TransText>
//             </TextInfoListItem>
//           </View>
//         )}
//         {/* <Divider /> */}
//         <TodoConfirmListItem
//           todo={todo}
//           isCompleted={isCompleted}
//           onChange={handleChange}
//         />
//         <TextInfoListItem
//           onPress={handleNotePress}
//           title={'메모'}
//           rightContent={<ListItem.Chevron />}>
//           <TransText primary>{todo.note || '메모를 남겨보세요'}</TransText>
//         </TextInfoListItem>
//         <Fab.Container>
//           <Fab.Button
//             onPress={handleUpload}
//             color={'secondary'}
//             title={'예약 정보 입력'}
//           />
//           <Fab.Button onPress={handleConfirm} title={'확인'} />
//         </Fab.Container>
//       </Screen>
//     </GestureHandlerRootViewWrapper>
//   )
// })

// const $d: ViewStyle = {
//   flex: 1,
//   justifyContent: 'space-between',
//   paddingHorizontal: 24,
// }

// const $s: ViewStyle = {
//   gap: 32,
// }

// const $iconAvataContainerStyle: ViewStyle = {
//   // width: 72,
//   // height: 72,
//   // height: 64
// }
