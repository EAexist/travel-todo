// import { useStores } from '@/models'
// import { goBack } from '@/navigators'
// import { LoadingScreenBase } from '@/screens/Loading'
// import { useApiStatusDispatch } from '@/utils/useApiStatus'
// import { useHeader } from '@/utils/useHeader'
// import { observer } from 'mobx-react-lite'
// import { FC, useCallback } from 'react'

// export const CreateReservationLoadingScreen: FC = observer(() => {
//   const { reservationStore } = useStores()

//   useHeader({ backButtonShown: false })

//   const handleSuccess = useCallback(() => {
//     if (reservationStore.confirmRequiringReservation.length > 0) {
//       goBack()
//     }
//   }, [])

//   const dispatch = useApiStatusDispatch()
//   const handleError = useCallback(() => {
//     dispatch({ type: 'set_IDLE' })
//     goBack()
//   }, [])

//   return (
//     <LoadingScreenBase
//       variant="article"
//       pendingIndicatorTitle={['예약 내역을 읽는 중이에요']}
//       onSuccess={handleSuccess}
//     />

//     //   successContent={
//     //     reservationStore.confirmRequiringReservation.length > 0 ? (
//     //       <>
//     //         {variant === 'article' && title && (
//     //           <ContentTitle title={title} subtitle={subtitle} />
//     //         )}
//     //         <View style={$statusViewStyle}>
//     //           {activityIndicator}
//     //           {variant === 'simple' && title && (
//     //             <TransText style={$statusMessageStyle}>
//     //               {title}
//     //               {subtitle}
//     //             </TransText>
//     //           )}
//     //         </View>
//     //         <Fab.Container>
//     //           <Fab.Button title={fabTitle} onPress={onPressFab} />
//     //         </Fab.Container>
//     //       </>
//     //     ) : (
//     //       <>
//     //         <ContentTitle
//     //           title={'예약 내역을 찾을 수 없어요'}
//     //           subtitle={'붙여넣은 텍스트를 확인하고 다시 시도해주세요.'}
//     //         />
//     //         <View></View>
//     //         <Fab.Container>
//     //           <Fab.Button title={'확인'} onPress={handleError} />
//     //         </Fab.Container>
//     //       </>
//     //     )
//     //   }
//   )
// })
