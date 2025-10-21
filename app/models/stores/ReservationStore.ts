import { withSetPropAction } from '@/models/helpers/withSetPropAction'
import {
    Reservation,
    RESERVATION_CATEGORY_TO_TITLE,
    ReservationCategory,
    ReservationModel,
    ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { colorTheme, getPaletteColor } from '@/rneui/theme'
import {
    api,
    CreateReservationProps,
    DeleteReservationProps,
    mapToReservation,
} from '@/services/api'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import { parseDate, toCalendarString } from '@/utils/date'
import { differenceInDays, eachDayOfInterval, startOfDay } from 'date-fns'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { MarkedDates } from 'react-native-calendars/src/types'
import { Accomodation } from '../Reservation/Accomodation'
import {
    DefaultSectionT,
    ListRenderItem,
    SectionListData,
    SectionListRenderItem,
} from 'react-native'

const ConfirmRequiringReservationModel = types
    .model('ConfirmRequiringReservation')
    .props({
        isFlaggedToAdd: types.optional(types.boolean, true),
        reservation: types.reference(ReservationModel),
    })
    .actions(withSetPropAction)
    .actions(store => ({
        async toggleIsFlaggedToAdd() {
            store.setProp('isFlaggedToAdd', !store.isFlaggedToAdd)
        },
    }))

export interface ConfirmRequiringReservation
    extends Instance<typeof ConfirmRequiringReservationModel> {}

export const ReservationStoreModel = types
    .model('ReservationStore')
    .props({
        // id: types.string,d
        // tripStore: types.reference(TripStoreModel),
        reservations: types.map(ReservationModel),
        confirmRequiringReservation: types.optional(
            types.array(ConfirmRequiringReservationModel),
            [],
        ),
    })
    .actions(withSetPropAction)
    .actions(store => ({
        /**
         * Fetch a trip with given id.
         */
        // async fetch() {
        //   if (store.tripStore) {
        //     const response = await api.getReservation(store.tripStore.id)
        //     if (response.kind === 'ok') {
        //       const data = response.data
        //       store.setProp('reservation', data.reservation)
        //     } else {
        //       console.error(
        //         `Error fetching Reservation: ${JSON.stringify(response)}`,
        //       )
        //     }
        //   }
        // },
        addReservation(reservation: Reservation) {
            return store.reservations.put(reservation)
        },
        clearConfirmRequiringList() {
            console.log('CLEAR')
            store.confirmRequiringReservation.clear()
        },
        addConfirmRequiringList(reservation: Reservation) {
            store.confirmRequiringReservation.push(
                ConfirmRequiringReservationModel.create({
                    reservation: reservation.id,
                }),
            )
        },
    }))
    .actions(store => ({
        /**
         * Delete a reservation.
         */
        delete(id: string) {
            store.reservations.delete(id)
            enqueueAction(APIAction.DELETE_RESERVATION, {
                id,
            } as DeleteReservationProps)
        },
        // async addFlightTicket(localOSFileUri: string) {
        //   console.log('[addFlightTicket]')
        //   if (!!store.tripStore) {
        //     console.log('[addFlightTicket] Calling api')
        //     api
        //       .uploadFlightTicket(store.tripStore.id, localOSFileUri)
        //       .then(response => {
        //         if (response.status >= 200 && response.status < 300) {
        //           try {
        //             const createdReservation: Reservation = JSON.parse(
        //               response.body,
        //             )
        //             // Copy image to local app storage and patch its uri to the reservation DB.
        //             copyImageToLocalStorage(localOSFileUri).then(
        //               localAppStorageFileUri => {
        //                 if (!!localAppStorageFileUri && !!store.tripStore)
        //                   api
        //                     .setLocalAppStorageFileUri(
        //                       store.tripStore.id,
        //                       createdReservation.id,
        //                       localAppStorageFileUri,
        //                     )
        //                     .then(response => {
        //                       if (response.kind == 'ok') {
        //                         store.reservations.set(
        //                           response.data.id,
        //                           response.data,
        //                         )
        //                       }
        //                     })
        //               },
        //             )
        //           } catch (parseError) {
        //             console.error('Error parsing JSON:', parseError)
        //             throw parseError
        //           }
        //         }
        //       })
        //   }
        // },
    }))
    .views(store => ({
        get reservationSorted() {
            return [...store.reservations.values()].sort(
                (
                    { isCompleted: isCompletedA },
                    { isCompleted: isCompletedB },
                ) => {
                    if (isCompletedA === false && isCompletedB === true) {
                        return -1
                    }
                    if (isCompletedA === true && isCompletedB === false) {
                        return 1
                    }
                    return 0
                },
            )
        },
    }))
    .views(store => ({
        get accomodation(): Reservation[] {
            return [...store.reservations.values()].filter(
                r => r.category === 'ACCOMODATION',
            )
        },
        get reservationsToDelete(): Reservation[] {
            return store.confirmRequiringReservation
                .filter(r => !r.isFlaggedToAdd)
                .map(r => r.reservation)
        },
        get sectionListDataSortedByDate(): SectionListData<
            Reservation,
            DefaultSectionT
        >[] {
            let data = Object.entries(
                store.reservationSorted.reduce(
                    (
                        acc: {
                            [date: string]: Reservation[]
                        },
                        reservation: Reservation,
                    ) => {
                        if (reservation.dateTimeIsoString) {
                            const date = startOfDay(
                                new Date(reservation.dateTimeIsoString),
                            ).toISOString()
                            if (!acc[date]) {
                                acc[date] = []
                            }

                            acc[date].push(reservation)
                        }

                        return acc
                    },
                    {},
                ),
            )
                .map(([time, data]) => {
                    return {
                        time: new Date(time),
                        data,
                    }
                })
                .sort(({ time: timeA }, { time: timeB }) => {
                    return timeA.getTime() - timeB.getTime()
                })
                .map(({ time, data }) => {
                    console.log(time)
                    return {
                        title: parseDate(time),
                        data,
                    }
                })

            const unScheduledReservations = store.reservationSorted.filter(
                r => !r.dateTimeIsoString,
            )

            if (unScheduledReservations.length > 0) {
                data = data.concat([
                    {
                        title: '날짜 지정 안함',
                        data: unScheduledReservations,
                    },
                ])
            }
            return data
        },
        get sectionListDataSortedByCategory(): SectionListData<
            Reservation,
            DefaultSectionT
        >[] {
            return Object.entries(
                store.reservationSorted.reduce(
                    (
                        acc: {
                            [category: string]: Reservation[]
                        },
                        reservation: Reservation,
                    ) => {
                        const category = reservation.category
                        if (!acc[category]) {
                            acc[category] = []
                        }

                        acc[category].push(reservation)

                        return acc
                    },
                    {},
                ),
            )
                .sort(([categoryA], [categoryB]) => {
                    return 1
                })
                .map(([category, data]) => {
                    return {
                        title: RESERVATION_CATEGORY_TO_TITLE[category],
                        data,
                    }
                })
        },
    }))
    .views(store => ({
        get orderedAccomodationReservations() {
            return [...store.accomodation.values()]
                .filter(r => r.accomodation !== null)
                .sort((a, b) =>
                    a.accomodation?.checkinDate
                        ? b.accomodation?.checkinDate
                            ? a.accomodation.checkinDate?.getDate() -
                              b.accomodation.checkinDate.getDate()
                            : -1
                        : 1,
                )
        },
        get orderedAccomodations(): Accomodation[] {
            return [...store.accomodation.values()]
                .filter(r => r.accomodation !== null)
                .sort((a, b) =>
                    a.accomodation?.checkinDate
                        ? b.accomodation?.checkinDate
                            ? a.accomodation.checkinDate?.getDate() -
                              b.accomodation.checkinDate.getDate()
                            : -1
                        : 1,
                )
                .map(r => r.accomodation as Accomodation)
        },
        get hasScheduledAccomodation() {
            return store.accomodation.some(
                a => !!a.accomodation?.checkinDateIsoString,
            )
        },
    }))
    .views(store => ({
        get reservedNights() {
            return store.accomodation
                .map(r => {
                    const d =
                        r.accomodation?.checkinDate &&
                        r.accomodation?.checkoutDate
                            ? differenceInDays(
                                  startOfDay(r.accomodation.checkoutDate),
                                  startOfDay(r.accomodation.checkinDate),
                              )
                            : 0
                    console.log('ACC', d)
                    return d
                })
                .reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                }, 0)
        },
        get firstCheckinDate() {
            return store.hasScheduledAccomodation
                ? new Date(
                      Math.min(
                          ...store.accomodation
                              .map(r => r.accomodation?.checkinDate?.getTime())
                              .filter(r => r != undefined),
                      ),
                  )
                : null
        },
        get lastCheckoutDate() {
            return store.hasScheduledAccomodation
                ? new Date(
                      Math.max(
                          ...store.accomodation
                              .map(r => r.accomodation?.checkoutDate?.getTime())
                              .filter(r => r != undefined),
                      ),
                  )
                : null
        },
        get accomodationMarkedDatesDotMarking(): MarkedDates {
            const markedDates: MarkedDates = {}
            store.orderedAccomodations.forEach((a, accIndex) => {
                const start = a.checkinDate
                const end = a.checkoutDate
                const intervalDays =
                    start && end
                        ? eachDayOfInterval({ start, end }).slice(0, -1)
                        : []
                intervalDays.forEach(date => {
                    const dateString = toCalendarString(date)
                    if (!Object.keys(markedDates).includes(dateString)) {
                        markedDates[dateString] = {
                            marked: true,
                            dotColor:
                                colorTheme.lightColors?.palette[
                                    accIndex %
                                        colorTheme.lightColors?.palette?.length
                                ],
                        }
                    }
                })
            })
            return markedDates
        },
        get accomodationMarkedDatesMultiDotMarking(): MarkedDates {
            const markedDates: MarkedDates = {}
            store.orderedAccomodations.forEach((a, accIndex) => {
                const start = a.checkinDate
                const end = a.checkoutDate
                const intervalDays =
                    start && end
                        ? eachDayOfInterval({ start, end }).slice(0, -1)
                        : []
                intervalDays.forEach(date => {
                    const dateString = toCalendarString(date)
                    if (!Object.keys(markedDates).includes(dateString)) {
                        markedDates[dateString] = {
                            marked: true,
                            dotColor: getPaletteColor(accIndex),
                        }
                    }
                })
            })
            return markedDates
        },
        get accomodationMarkedDatesMultiPeriodMarking() {
            const markedDates: {
                [key: string]: {
                    periods: {
                        startingDay: boolean
                        endingDay: boolean
                        color: string
                    }[]
                }
            } = {}
            store.orderedAccomodations.forEach((a, accIndex) => {
                const start = a.checkinDate
                const end = a.checkoutDate
                const intervalDays =
                    start && end
                        ? eachDayOfInterval({ start, end }).slice(0, -1)
                        : []
                intervalDays.forEach((date, index) => {
                    const dateString = toCalendarString(date)
                    if (!Object.keys(markedDates).includes(dateString)) {
                        markedDates[dateString] = { periods: [] }
                    }
                    markedDates[dateString].periods.push({
                        startingDay: index === 0,
                        endingDay: index === intervalDays.length - 1,
                        color: getPaletteColor(accIndex),
                        //   selected: true,
                    })
                })
            })
            return markedDates
        },
        // get accomodationMarkedDatesWithColorIndex() {
        //     const markedDates: {
        //         [key: string]: {
        //             periods: {
        //                 startingDay: boolean
        //                 endingDay: boolean
        //                 colorIndex: number
        //             }[]
        //         }
        //     } = {}
        //     store.a.forEach((r, accIndex) => {
        //         const start = r.accomodation?.checkinDate
        //         const end = r.accomodation?.checkoutDate
        //         const intervalDays =
        //             start && end
        //                 ? eachDayOfInterval({ start, end }).slice(0, -1)
        //                 : []
        //         intervalDays.forEach((date, index) => {
        //             const dateString = toCalendarString(date)
        //             if (!Object.keys(markedDates).includes(dateString)) {
        //                 markedDates[toCalendarString(date)] = { periods: [] }
        //             }
        //             markedDates[toCalendarString(date)].periods.push({
        //                 startingDay: index === 0,
        //                 endingDay: index === intervalDays.length - 1,
        //                 //   selected: true,
        //                 colorIndex: accIndex,
        //             })
        //         })
        //     })
        //     return markedDates
        // },
    }))
//   .actions(store => ())
export interface ReservationStore
    extends Instance<typeof ReservationStoreModel> {}
export interface ReservationStoreSnapshot
    extends SnapshotOut<typeof ReservationStoreModel> {}
