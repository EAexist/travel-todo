import { autorun } from 'mobx'
import { getSnapshot } from 'mobx-state-tree'
import { RootStore } from '../stores/RootStore'

export const logRootStore = (rootStore: RootStore) =>
    autorun(() => {
        console.log(
            '[RootStore changed:]',
            rootStore?.userStore
                ? JSON.stringify({
                      ...getSnapshot(rootStore),
                      userStore: null,
                  })
                : '',
        )
    })
// autorun(() => {
//     console.log(
//         '[UserStore changed:]',
//         rootStore?.userStore
//             ? JSON.stringify({
//                   ...getSnapshot(rootStore.userStore),
//                   activeTrip: null,
//               })
//             : '',
//     )
// })
// autorun(() => {
//     console.log(
//         '[TripStore changed:]',
//         rootStore?.userStore?.activeTrip
//             ? JSON.stringify(
//                   rootStore.userStore.activeTrip && {
//                       ...getSnapshot(rootStore.userStore.activeTrip),
//                       todolist: null,
//                       todoMap: null,
//                       preset: null,
//                   },
//               )
//             : '',
//     )
// })
// autorun(() => {
//     console.log(
//         '[Todolist changed:]',
//         rootStore?.userStore
//             ? JSON.stringify(
//                   rootStore.userStore.activeTrip?.todoMap && {
//                       ...getSnapshot(
//                           rootStore.userStore.activeTrip?.todoMap,
//                       ),
//                   },
//               )
//             : '',
//     )
// })
// autorun(() => {
//     console.log(
//         '[Preset changed:]',
//         rootStore?.userStore
//             ? JSON.stringify(
//                   rootStore.userStore.activeTrip?.preset && {
//                       ...getSnapshot(
//                           rootStore.userStore.activeTrip?.preset,
//                       ),
//                   },
//               )
//             : '',
//     )
// })
// autorun(() => {
//     console.log(
//         '[ReservationStore changed:]',
//         rootStore?.userStore?.activeTrip
//             ? JSON.stringify(
//                   rootStore.userStore.activeTrip.reservationStore,
//               )
//             : '',
//     )
// })
//   autorun(() => {
//     console.log(
//       '[RoundTripStore changed:]',
//       JSON.stringify(rootStore.roundTripStore),
//     )
//   })
//   reaction(
//     () => rootStore.userStore?.id,
//     id => {
//       console.log(`[reaction] userStore.id=${id}`)
//       if (id) api.authenticate(id.toString())
//     },
//   )
