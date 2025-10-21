import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
    getNightsParsed,
    parseDate,
    parseDateShort,
    parseTime,
} from '@/utils/date'
import { v4 as uuidv4 } from 'uuid'
import { createEnumType } from '../helpers/createEnumtype'
import { IconObject } from '@rneui/base'

export type AccomodationCategory =
    | 'GENERAL'
    | 'HOTEL'
    | 'DORMITORY'
    | 'GUESTHOUSE'
    | 'AIRBNB'

export const ACCOMODATION_CATEGORY_TO_TITLE: { [key: string]: string } = {
    GENERAL: '일반',
    HOTEL: '호텔',
    DORMITORY: '도미토리',
    GUESTHOUSE: '게스트하우스',
    AIRBNB: '에어비엔비',
}

export const ACCOMODATION_CATEGORY_TO_ICONOBJECT: {
    [key: string]: IconObject
} = {
    GENERAL: {
        type: 'material-community',
        name: 'bed-king-outline',
    },
    HOTEL: { type: 'font-awesome-5', name: 'hotel' },
    DORMITORY: {
        type: 'material-community',
        name: 'bunk-bed-outline',
    },
    GUESTHOUSE: {
        type: 'material-community',
        name: 'party-popper',
    },
    AIRBNB: { type: 'font-awesome-5', name: 'airbnb' },
}

/**
 * This represents a Accomodation
 */
export const AccomodationModel = types
    .model('Accomodation')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        category: types.optional(
            createEnumType<AccomodationCategory>('AccomodationCategory'),
            'GENERAL',
        ),
        title: types.maybeNull(types.string),
        roomTitle: types.maybeNull(types.string),
        location: types.maybeNull(types.string),
        numberOfClient: types.maybeNull(types.number),
        clientName: types.maybeNull(types.string),
        checkinDateIsoString: types.maybeNull(types.string),
        checkoutDateIsoString: types.maybeNull(types.string),
        checkinStartTimeIsoString: types.maybeNull(types.string),
        checkinEndTimeIsoString: types.maybeNull(types.string),
        checkoutTimeIsoString: types.maybeNull(types.string),
        links: types.array(
            types.model({
                provider: '',
                url: '',
            }),
        ),
        // isFlaggedToDelete: false,
        // isFlaggedToAdd: false,
    })
    .actions(withSetPropAction)
    .actions(item => ({
        // toggleDeleteFlag() {
        //     item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
        // },
        // toggleAddFlag() {
        //     item.setProp('isFlaggedToAdd', !item.isFlaggedToAdd)
        // },
        // removeFavorite(Accomodation: Accomodation) {
        //   store.favorites.remove(accomodationItem)
        // },
    }))
    .views(item => ({
        get isScheduleSet() {
            return item.checkinDateIsoString && item.checkoutDateIsoString
        },
        get categoryText() {
            return ACCOMODATION_CATEGORY_TO_TITLE[item.category]
        },
        get icon() {
            return ACCOMODATION_CATEGORY_TO_ICONOBJECT[item.category]
        },
        get checkinDate() {
            return item.checkinDateIsoString
                ? new Date(item.checkinDateIsoString)
                : null
        },
        get checkoutDate() {
            return item.checkoutDateIsoString
                ? new Date(item.checkoutDateIsoString)
                : null
        },
        get checkinStartTime() {
            return item.checkinStartTimeIsoString
                ? new Date(item.checkinStartTimeIsoString)
                : null
        },
        get checkinEndTime() {
            return item.checkinEndTimeIsoString
                ? new Date(item.checkinEndTimeIsoString)
                : null
        },
        get checkoutTime() {
            return item.checkoutTimeIsoString
                ? new Date(item.checkoutTimeIsoString)
                : null
        },
    }))
    .views(item => ({
        get detailTextList() {
            return {
                roomTitle: item.roomTitle,
                numberOfClient: item.numberOfClient,
                clientName: item.clientName,
                checkinDate: item.checkinDate?.toLocaleDateString(),
                checkoutDate: item.checkoutDate?.toLocaleDateString(),
                checkinTimeString: `${item.checkinStartTime?.getTime()}~${item.checkinEndTime?.getTime()}`,
                checkoutTimeString: item.checkoutTime?.getTime(),
            }
        },
        get dateParsed() {
            return item.checkinDate && item.checkoutDate
                ? `${parseDateShort(item.checkinDate)} - ${parseDateShort(item.checkoutDate)}`
                : null
        },
        get checkinDateParsed() {
            return parseDate(item.checkinDate)
        },
        get checkoutDateParsed() {
            return parseDate(item.checkoutDate)
        },
        get checkinDateTimeParsed() {
            return item.checkinDate != null
                ? `${parseDate(item.checkinDate)}${item.checkinStartTime ? ` ${parseTime(item.checkinStartTime)}` : ''}`
                : null
        },
        get checkoutDateTimeParsed() {
            return item.checkoutDate != null
                ? `${parseDate(item.checkoutDate)}${item.checkoutTime ? ` ${parseTime(item.checkoutTime)}` : ''}`
                : null
        },
        get checkinTimeParsed() {
            return item.checkinStartTime != null || item.checkinEndTime != null
                ? `${parseTime(item.checkinStartTime) || ''}~${parseTime(item.checkinEndTime) || ''}`
                : null
        },
        get checkoutTimeParsed() {
            return parseTime(item.checkoutTime)
        },
        get nightsParsed() {
            return item.checkinDate && item.checkoutDate
                ? getNightsParsed(item.checkinDate, item.checkoutDate)
                : null
        },
    }))

export type AccomodationInfoProvider = string

export interface Accomodation extends Instance<typeof AccomodationModel> {}
export interface AccomodationSnapshotOut
    extends SnapshotOut<typeof AccomodationModel> {}
export interface AccomodationSnapshotIn
    extends SnapshotIn<typeof AccomodationModel> {}
