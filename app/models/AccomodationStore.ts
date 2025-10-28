import { toCalendarString } from '@/utils/date'
import { eachDayOfInterval } from 'date-fns'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { MarkedDates } from 'react-native-calendars/src/types'
import { api } from '../services/api'
import {
    AccomodationModel,
    AccomodationSnapshotIn,
} from './Reservation/Accomodation'
import { withSetPropAction } from './helpers/withSetPropAction'

export const AccomodationStoreModel = types
    .model('AccomodationStore')
    .props({
        accomodation: types.map(AccomodationModel),
    })
    .actions(withSetPropAction)
    .actions(store => ({
        // async fetchAccomodation() {
        //   const response = await api.getAccomodation()
        //   if (response.kind === 'ok') {
        //     // store.setProp('id', response.id)
        //     // console.log(
        //     //   response.items.map((item) => [item.checkinDate, item.checkoutDate]),
        //     // )
        //     const accomodation = Object.fromEntries(
        //       response.items.map(
        //         ({
        //           // checkinDate,
        //           // checkoutDate,
        //           // checkinStartTime,
        //           // checkinEndTime,
        //           // checkoutTime,
        //           ...item
        //         }) => [
        //           item.id,
        //           {
        //             // checkinDate: new Date(checkinDate),
        //             // checkoutDate: new Date(checkoutDate),
        //             // checkinStartTime: checkinStartTime
        //             //   ? new Date(checkinStartTime)
        //             //   : undefined,
        //             // checkinEndTime: checkinEndTime
        //             //   ? new Date(checkinEndTime)
        //             //   : undefined,
        //             // checkoutTime: checkoutTime ? new Date(checkoutTime) : undefined,
        //             ...item,
        //           },
        //         ],
        //       ),
        //     )
        //     store.setProp('accomodation', accomodation)
        //     // console.log(
        //     //   Object.values(accomodation).map((item) => [
        //     //     item.checkinDate,
        //     //     item.checkoutDate,
        //     //   ]),
        //     // )
        //   } else {
        //     console.error(
        //       `Error fetching Accomodation: ${JSON.stringify(response)}`,
        //     )
        //   }
        // },
        // add(item: Accomodation) {
        //   store.accomodation.push(item)
        // },
        // remove(item: Accomodation) {
        //   store.accomodation.remove(item)
        // },
    }))
    .views(store => ({
        get orderedAccomodationReservations() {
            console.log(store.accomodation.values())
            return [...store.accomodation.values()].sort(
                (a, b) => a.checkinDate.getDate() - b.checkinDate.getDate(),
            )
        },
        get indexedUniqueTitles() {
            return [
                ...new Set(
                    this.orderedAccomodationReservations.map(
                        item => item.title,
                    ),
                ),
            ]
        },
        get calendarMarkedDateEntries() {
            return this.orderedAccomodationReservations
                .map(item => {
                    const start = item.checkinDate
                    const end = item.checkoutDate
                    console.log(start, end)
                    const intervalDays = eachDayOfInterval({
                        start,
                        end,
                    }).slice(0, -1)
                    return intervalDays.map((date, index) => [
                        toCalendarString(date),
                        {
                            startingDay: index === 0,
                            endingDay: index === intervalDays.length - 1,
                            selected: true,
                            colorIndex: this.indexedUniqueTitles.indexOf(
                                item.title,
                            ),
                        },
                    ])
                })
                .flat() as [
                string,
                {
                    startingDay: boolean
                    endingDay: boolean
                    selected: boolean
                    colorIndex: number
                },
            ][]
        },
        // get accomodationListData() {
        //   return this.orderedAccomodationReservations.map((item) => [[item.checkinDate, {startingDay: true }], [item.checkoutDate, {endingDay: true}]]).flat()
        // }
        // get sectionedAccomodation() {
        //   return (
        //     [
        //       { category: 'reservation', title: '예약' },
        //       { category: 'FOREIGN', title: '해외여행' },
        //     ] as { category: 'reservation' | 'FOREIGN' | 'SUPPLY'; title: string }[]
        //   ).map(({ category, title }) => ({
        //     category,
        //     title,
        //     data: store.accomodation.filter(
        //       (item) => item.category === category,
        //     ),
        //   }))
        // },
        // get sectionedAccomodationforDraggableFlatList() {
        //   return this.sectionedAccomodation.map(({ category, title, data }) => ({
        //     category,
        //     title,
        //     data: [data],
        //   }))
        // },
        // get incompleteAccomodation() {
        //   return this.sectionedAccomodation.map(({ title, data }) => {
        //     return { title, data: data.filter((item) => !item.completeDate) }
        //   })
        // },
        // get completedAccomodation() {
        //   return this.sectionedAccomodation.map(({ title, data }) => {
        //     return { title, data: data.filter((item) => !!item.completeDate) }
        //   })
        // },
        // get deleteFlagAccomodation() {
        //   return this.sectionedAccomodation.map(({ title, data }) => {
        //     const completeData = data.sort((a, b) =>
        //       a.isFlaggedToDelete === b.isFlaggedToDelete
        //         ? 0
        //         : b.isFlaggedToDelete
        //           ? -1
        //           : 1,
        //     )
        //     return { title, data: completeData }
        //   })
        // },
        // get accomodationWithPreset() {
        //   return this.sectionedAccomodation.map(({ category, title, data }) => {
        //     return {
        //       title,
        //       data: data
        //         .map((item) => ({ isPreset: false, item: item }))
        //         .concat(
        //           store.presets
        //             .filter((item) => item.category === category)
        //             .map((item) => ({
        //               isPreset: true,
        //               item: item,
        //             })),
        //         ),
        //     }
        //   })
        // },
        // get AccomodationForList() {
        //   return store.favoritesOnly ? store.favorites : store.Accomodation
        // },
        // hasFavorite(item: Accomodation) {
        //   return store.favorites.includes(accomodationItem)
        // },
    }))
    .actions(store => ({
        // setPreset() {
        //   store.setProp('_presets', [])
        // },
        // toggleFavorite(item: Accomodation) {
        //   if (store.hasFavorite(accomodationItem)) {
        //     store.removeFavorite(accomodationItem)
        //   } else {
        //     store.addFavorite(accomodationItem)
        //   }
        // },
    }))

export interface AccomodationStore
    extends Instance<typeof AccomodationStoreModel> {}
export interface AccomodationStoreSnapshot
    extends SnapshotOut<typeof AccomodationStoreModel> {}
