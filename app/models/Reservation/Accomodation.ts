import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { getNightsParsed } from '@/utils/date'
import { v4 as uuidv4 } from 'uuid'

/**
 * This represents a Accomodation
 */
export const AccomodationModel = types
  .model('Accomodation')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    title: types.maybeNull(types.string),
    roomTitle: types.maybeNull(types.string),
    location: types.maybeNull(types.string),
    numberOfGuest: 1,
    guestName: types.maybeNull(types.string),
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
    note: '',
    type: '',
    isFlaggedToDelete: false,
    isFlaggedToAdd: false,
  })
  .actions(withSetPropAction)
  .actions(item => ({
    toggleDeleteFlag() {
      item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
    },
    toggleAddFlag() {
      item.setProp('isFlaggedToAdd', !item.isFlaggedToAdd)
    },
    // removeFavorite(Accomodation: Accomodation) {
    //   store.favorites.remove(accomodationItem)
    // },
  }))
  .views(item => ({
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
        numberOfGuest: item.numberOfGuest,
        clientName: item.guestName,
        checkinDate: item.checkinDate?.toLocaleDateString(),
        checkoutDate: item.checkoutDate?.toLocaleDateString(),
        checkinTimeString: `${item.checkinStartTime?.getTime()}~${item.checkinEndTime?.getTime()}`,
        checkoutTimeString: item.checkoutTime?.getTime(),
      }
    },
    get checkinDateParsed() {
      return item.checkinDate ? formatter.format(item.checkinDate) : null
      //  ?.toLocaleDateString()
    },
    get checkoutDateParsed() {
      return item.checkoutDate ? formatter.format(item.checkoutDate) : null
      // return item.checkoutDate?.toLocaleDateString()
    },
    get checkinTimeParsed() {
      return item.checkinStartTime != null || item.checkinEndTime != null
        ? `${item.checkinStartTime ? timeFormatter.format(item.checkinStartTime) : ''}~${item.checkinEndTime ? timeFormatter.format(item.checkinEndTime) : ''}`
        : null
    },
    get checkoutTimeParsed() {
      return item.checkoutTime ? timeFormatter.format(item.checkoutTime) : null
    },
    get nightsParsed() {
      return item.checkinDate && item.checkoutDate
        ? getNightsParsed(item.checkinDate, item.checkoutDate)
        : null
    },
  }))

const formatter = new Intl.DateTimeFormat('kr', {
  month: 'long',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('kr', {
  timeStyle: 'short',
  // hour: '2-digit',
  // minute: '2-digit',
})
export type AccomodationInfoProvider = string

export interface Accomodation extends Instance<typeof AccomodationModel> {}
export interface AccomodationSnapshotOut
  extends SnapshotOut<typeof AccomodationModel> {}
export interface AccomodationSnapshotIn
  extends SnapshotIn<typeof AccomodationModel> {}
