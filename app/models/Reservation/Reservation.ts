import { TextInfoListItemProps } from '@/components/TextInfoListItem'
import {
    AccomodationCategory,
    AccomodationModel,
} from '@/models/Reservation/Accomodation'
import { parseDateShort, parseTime } from '@/utils/date'
import {
    applySnapshot,
    flow,
    getSnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { createEnumType } from '../helpers/createEnumtype'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Icon } from '../Icon'
import { AirportModel } from '../Todo'
import { FlightBookingModel } from './FlightBookingModel'
import { FlightModel } from './FlightModel'
import { FlightTicketModel } from './FlightTicketModel'
import { GeneralReservationModel } from './GeneralReservationModel'
import { VisitJapanModel } from './VisitJapanModel'
import { wait } from '../helpers/wait'
import { APIAction, enqueueAction } from '@/tasks/BackgroundTask'
import {
    CreateReservationProps,
    mapToReservationPatchDTO,
    PatchReservationProps,
} from '@/services/api'

export type ReservationCategory =
    | 'GENERAL'
    | 'ACCOMODATION'
    | 'FLIGHT_BOOKING'
    | 'FLIGHT_TICKET'
    | 'VISIT_JAPAN'

export const RESERVATION_CATEGORY_TO_TITLE: { [key: string]: string } = {
    ACCOMODATION: '숙박',
    FLIGHT_BOOKING: '항공권 예약',
    FLIGHT_TICKET: '모바일 탑승권',
    VISIT_JAPAN: 'VISIT JAPAN',
    GENERAL: '기타 예약',
}

export const RESERVATION_CATEGORY_TO_ICONOBJECT: { [key: string]: Icon } = {
    ACCOMODATION: {
        name: '🛌',
        type: 'tossface',
    },
    FLIGHT_BOOKING: {
        name: '✈️',
        type: 'tossface',
    },
    FLIGHT_TICKET: {
        name: '🛫',
        type: 'tossface',
    },
    VISIT_JAPAN: {
        name: 'visit-japan',
        type: 'image',
    },
    GENERAL: {
        name: '🎫',
        type: 'tossface',
    },
}
export const ReservationModel = types
    .model('Reservation')
    .props({
        id: types.optional(types.identifier, () => uuidv4()),
        category: types.optional(
            createEnumType<ReservationCategory>('ReservationCategory'),
            'GENERAL',
        ),
        primaryHrefLink: types.maybeNull(types.string),
        code: types.maybeNull(types.string),
        note: types.maybeNull(types.string),
        flightBooking: types.maybeNull(FlightBookingModel),
        flightTicket: types.maybeNull(FlightTicketModel),
        accomodation: types.maybeNull(AccomodationModel),
        visitJapan: types.maybeNull(VisitJapanModel),
        generalReservation: types.maybeNull(GeneralReservationModel),
        isCompleted: types.optional(types.boolean, false),
        // localAppStorageFileUri: types.maybeNull(types.string),
        // serverFileUri: types.maybeNull(types.string),
    })
    .actions(withSetPropAction)
    .views(item => ({
        get categoryTitle() {
            return item.category
                ? RESERVATION_CATEGORY_TO_TITLE[item.category]
                : null
        },
    }))
    .views(item => ({
        get isAccomodationWithoutSchedule() {
            return (
                item.category == 'ACCOMODATION' &&
                !item.accomodation?.isScheduleSet
            )
        },
        get addLinkInstruction() {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return 'QR코드 링크를 입력하세요'
                case 'FLIGHT_TICKET':
                    return '모바일 탑승권 링크 입력'
                default:
                    return '예약 확인 링크를 입력하세요'
            }
        },
        get timeDataTitle() {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return '입국 날짜'
                case 'ACCOMODATION':
                    return ''
                case 'FLIGHT_BOOKING':
                case 'FLIGHT_TICKET':
                    return '출발 시간'
                default:
                    return '날짜 및 시간'
            }
        },
        get icon() {
            return item.category
                ? RESERVATION_CATEGORY_TO_ICONOBJECT[item.category]
                : { name: '🎫', type: 'tossface' }
        },
        get title() {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return 'Visit Japan'
                case 'ACCOMODATION':
                    return item.accomodation?.title ?? ''
                case 'FLIGHT_BOOKING':
                    return '항공권 예약'
                case 'FLIGHT_TICKET':
                    return '모바일 탑승권'
                case 'GENERAL':
                    return item.generalReservation?.title ?? ''
                default:
                    return ''
            }
        },
        get subtitle() {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return '일본 입국 심사'
                case 'FLIGHT_BOOKING':
                    return item.flightBooking?.title
                        ? `${item.flightBooking?.title}${item.flightBooking?.flightNumberTitle ? ` (${item.flightBooking?.flightNumberTitle})` : ''}`
                        : ''
                case 'FLIGHT_TICKET':
                    return item.flightBooking?.title
                        ? `${item.flightTicket?.title}${item.flightTicket?.flightNumberTitle ? ` (${item.flightTicket?.flightNumberTitle})` : ''}`
                        : ''
                default:
                    return item.categoryTitle ?? ''
            }
        },
        get dateTimeIsoString() {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return item.visitJapan?.dateTimeIsoString ?? null
                case 'ACCOMODATION':
                    return item.accomodation?.checkinDateIsoString ?? null
                case 'FLIGHT_BOOKING':
                    return (
                        item.flightBooking?.departureDateTimeIsoString ?? null
                    )
                case 'FLIGHT_TICKET':
                    return item.flightTicket?.departureDateTimeIsoString ?? null
                case 'GENERAL':
                    return item.generalReservation?.dateTimeIsoString ?? null
                default:
                    return
            }
        },
    }))
    .views(item => ({
        get timeParsed() {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return item.dateTimeIsoString
                        ? `${parseDateShort(item.dateTimeIsoString)} ${parseTime(item.dateTimeIsoString)}`
                        : ''
                case 'ACCOMODATION':
                    return item.dateTimeIsoString
                        ? `${parseDateShort(item.dateTimeIsoString)} ${parseTime(item.dateTimeIsoString)}`
                        : ''
                case 'FLIGHT_BOOKING':
                    return item.dateTimeIsoString
                        ? `${parseDateShort(item.dateTimeIsoString)} ${parseTime(item.dateTimeIsoString)}`
                        : ''
                case 'FLIGHT_TICKET':
                    return item.dateTimeIsoString
                        ? `${parseDateShort(item.dateTimeIsoString)} ${parseTime(item.dateTimeIsoString)}`
                        : ''
                case 'GENERAL':
                    return item.dateTimeIsoString
                        ? `${parseDateShort(item.dateTimeIsoString)} ${parseTime(item.dateTimeIsoString)}`
                        : ''
                default:
                    return
            }
        },
    }))
    .actions(item => ({
        /**
         * Patch(update) a reservation.
         */
        patch(reservationDTO: Partial<ReservationSnapshot>) {
            enqueueAction(APIAction.PATCH_RESERVATION, {
                reservationDTO: mapToReservationPatchDTO({
                    ...reservationDTO,
                    id: item.id,
                }),
            })
        },
    }))
    .actions(item => ({
        setVisitJapanProp<
            K extends keyof SnapshotIn<typeof VisitJapanModel>,
            V extends SnapshotIn<typeof VisitJapanModel>[K],
        >(field: K, newValue: V) {
            item.visitJapan?.setProp(field, newValue)
        },
        setAccomodationProp<
            K extends keyof SnapshotIn<typeof AccomodationModel>,
            V extends SnapshotIn<typeof AccomodationModel>[K],
        >(field: K, newValue: V) {
            item.accomodation?.setProp(field, newValue)
        },
        setFlightBookingProp<
            K extends keyof SnapshotIn<typeof FlightBookingModel>,
            V extends SnapshotIn<typeof FlightBookingModel>[K],
        >(field: K, newValue: V) {
            item.flightBooking?.setProp(field, newValue)
        },
        setFlightTicketProp<
            K extends keyof SnapshotIn<typeof FlightTicketModel>,
            V extends SnapshotIn<typeof FlightTicketModel>[K],
        >(field: K, newValue: V) {
            item.flightTicket?.setProp(field, newValue)
        },
        setGeneralReservationProp<
            K extends keyof SnapshotIn<typeof GeneralReservationModel>,
            V extends SnapshotIn<typeof GeneralReservationModel>[K],
        >(field: K, newValue: V) {
            item.generalReservation?.setProp(field, newValue)
        },
    }))
    .actions(item => ({
        setFlightProp<
            K extends keyof SnapshotIn<typeof FlightModel>,
            V extends SnapshotIn<typeof FlightModel>[K],
        >(field: K, newValue: V) {
            console.log(getSnapshot(item))
            if (item.category === 'FLIGHT_BOOKING') {
                item.setFlightBookingProp(field, newValue)
            } else if (item.category === 'FLIGHT_TICKET') {
                item.setFlightTicketProp(field, newValue)
            }
        },
        toggleIsCompleted() {
            console.log('TOGGLEISCOMPLETED')
            item.setProp('isCompleted', !item.isCompleted)
            item.patch({ isCompleted: item.isCompleted })
        },
    }))
    .actions(item => ({
        toggleIsCompletedDelayed: flow(function* () {
            yield wait()
            item.toggleIsCompleted()
        }),
        updateFromSnapshot(snapshot: SnapshotIn<typeof item>) {
            applySnapshot(item, snapshot)
        },
        setDateTime(dateTimeIsoString: string) {
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return item.setVisitJapanProp(
                        'dateTimeIsoString',
                        dateTimeIsoString,
                    )
                    break
                case 'ACCOMODATION':
                    return item.setAccomodationProp(
                        'checkinDateIsoString',
                        dateTimeIsoString,
                    )
                    break
                case 'FLIGHT_BOOKING':
                    return item.setFlightBookingProp(
                        'departureDateTimeIsoString',
                        dateTimeIsoString,
                    )
                    break
                case 'FLIGHT_TICKET':
                    return item.setFlightTicketProp(
                        'departureDateTimeIsoString',
                        dateTimeIsoString,
                    )
                    break
                case 'GENERAL':
                    return item.setGeneralReservationProp(
                        'dateTimeIsoString',
                        dateTimeIsoString,
                    )
                    break
                default:
                    break
            }
        },
        setTitle(title: string) {
            if (item.category === 'ACCOMODATION') {
                item.accomodation?.setProp('title', title)
            } else if (item.category === 'GENERAL') {
                item.generalReservation?.setProp('title', title)
            }
        },
        setCategory(category: ReservationCategory) {
            const title = item.title
            const dateTimeIsoString = item.dateTimeIsoString
            if (item.category === category) {
                return
            }
            item.setProp('category', category)
            switch (category) {
                case 'ACCOMODATION':
                    item.accomodation = AccomodationModel.create({
                        title: '새 숙박 예약',
                        checkinDateIsoString: dateTimeIsoString,
                    })
                    break
                case 'VISIT_JAPAN':
                    item.visitJapan = VisitJapanModel.create({
                        dateTimeIsoString,
                    })
                    break
                case 'FLIGHT_BOOKING':
                    item.flightBooking = FlightBookingModel.create({
                        ...(item.flightTicket
                            ? getSnapshot(item.flightTicket)
                            : {}),
                        departureDateTimeIsoString: dateTimeIsoString,
                    })
                    break
                case 'FLIGHT_TICKET':
                    item.flightTicket = FlightTicketModel.create({
                        ...(item.flightBooking
                            ? getSnapshot(item.flightBooking)
                            : {}),
                        departureDateTimeIsoString: dateTimeIsoString,
                    })
                    break
                case 'GENERAL':
                    item.generalReservation = GeneralReservationModel.create({
                        title,
                        dateTimeIsoString,
                    })
                    break
                default:
                    break
            }

            if (category !== 'ACCOMODATION') item.setProp('accomodation', null)
            if (category !== 'FLIGHT_BOOKING')
                item.setProp('flightBooking', null)
            if (category !== 'FLIGHT_TICKET') item.setProp('flightTicket', null)
            if (category !== 'GENERAL') item.setProp('generalReservation', null)
        },
    }))
    .views(item => ({
        get flightData(): ReservationDataItemType[] {
            const flight =
                item.category === 'FLIGHT_BOOKING'
                    ? item.flightBooking
                    : item.flightTicket
            return [
                {
                    id: 'flightNumber',
                    title: '편명',
                    value: flight?.flightNumber,
                    setValue: (text: string) => {
                        item.setFlightProp('flightNumber', text)
                    },
                },
                {
                    id: 'departureAirport',
                    title: '출발 공항',
                    value: flight?.departureAirport
                        ? // ? `${flight?.departureAirport.airportName}(${flight?.departureAirport.iataCode})`
                          `${flight?.departureAirport.airportName}`
                        : null,
                    setValue: (text: string) => {
                        item.setFlightProp(
                            'departureAirport',
                            AirportModel.create({
                                airportName: text,
                                iataCode: '',
                                iso2DigitNationCode: '',
                                cityName: '',
                            }),
                        )
                    },
                },
                {
                    id: 'arrivalAirport',
                    title: '도착 공항',
                    value: flight?.arrivalAirport
                        ? // ? `${flight?.arrivalAirport.airportName}(${flight?.arrivalAirport.iataCode})`
                          `${flight?.arrivalAirport.airportName}`
                        : null,
                    setValue: (text: string) => {
                        item.setFlightProp(
                            'arrivalAirport',
                            AirportModel.create({
                                airportName: text,
                                iataCode: '',
                                iso2DigitNationCode: '',
                                cityName: '',
                            }),
                        )
                    },
                },
            ]
        },
        get commonData(): ReservationDataItemType[] {
            return [
                {
                    id: 'code',
                    title: '예약 번호',
                    value: item.code,
                    setValue: (text: string) => {
                        item.setProp('code', text)
                    },
                },
            ]
        },
        get infoListItemProps(): ReservationDataItemType[] {
            let data: ReservationDataItemType[] = []
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return []
                case 'ACCOMODATION':
                    data = [
                        {
                            id: 'category',
                            title: '타입',
                            value: `${item.accomodation?.category}`,
                        },
                        {
                            id: 'roomTitle',
                            title: '방 · 인원',
                            value: `${item.accomodation?.roomTitle ? item.accomodation?.roomTitle : ''}${item.accomodation?.roomTitle && item.accomodation.numberOfClient ? '·' : ''}${item.accomodation?.numberOfClient ? `${item.accomodation?.numberOfClient}명` : ''}`,
                            numberOfLines: 2,
                        },
                        {
                            id: 'clientName',
                            title: '예약자 이름',
                            value: item.accomodation?.clientName,
                        },
                        {
                            id: 'location',
                            title: '위치',
                            value: item.accomodation?.location,
                            numberOfLines: 2,
                        },
                    ]
                    break
                case 'FLIGHT_BOOKING':
                    data = [
                        ...this.flightData,
                        {
                            id: 'numberOfPassenger',
                            title: '인원',
                            value: item.flightBooking?.numberOfPassenger
                                ? item.flightBooking?.numberOfPassenger?.toString()
                                : null,
                        },
                        {
                            id: 'passengerName',
                            title: '탑승객 이름',
                            value: item.flightBooking?.passengerName
                                ? item.flightBooking?.passengerName
                                : null,
                            numberOfLines: 2,
                        },
                    ]
                    break
                case 'FLIGHT_TICKET':
                    data = [
                        ...this.flightData,
                        {
                            id: 'passengerName',
                            title: '탑승객 이름',
                            value: item.flightTicket?.passengerName,
                        },
                    ]
                    break
                case 'GENERAL':
                    data = [
                        {
                            id: 'numberOfClient',
                            title: '인원',
                            value:
                                item.generalReservation?.numberOfClient?.toString() ||
                                null,
                        },
                        {
                            id: 'clientName',
                            title: '예약자 이름',
                            value: item.generalReservation?.clientName,
                        },
                    ]
                    break
                default:
                    data = []
            }
            return [...this.commonData, ...data].filter(d => d.value !== null)
        },
        get infoEditListItemProps(): ReservationDataItemType[] {
            let data: ReservationDataItemType[] = []
            switch (item.category) {
                case 'VISIT_JAPAN':
                    return []
                case 'ACCOMODATION':
                    data = [
                        {
                            id: 'roomTitle',
                            title: '방',
                            value: item.accomodation?.roomTitle,
                            setValue: (text: string) => {
                                item.setAccomodationProp('roomTitle', text)
                            },
                        },
                        {
                            id: 'checkinStartTimeIsoString',
                            title: '체크인 시작 시간',
                            value: item.accomodation?.checkinStartTimeIsoString,
                            setValue: (text: string) => {
                                item.setAccomodationProp(
                                    'checkinStartTimeIsoString',
                                    text,
                                )
                            },
                        },
                        {
                            id: 'checkinEndTimeIsoString',
                            title: '체크인 마감 시간',
                            value: item.accomodation?.checkinEndTimeIsoString,
                            setValue: (text: string) => {
                                item.setAccomodationProp(
                                    'checkinEndTimeIsoString',
                                    text,
                                )
                            },
                        },
                        {
                            id: 'checkoutTimeIsoString',
                            title: '체크아웃 마감 시간',
                            value: item.accomodation?.checkoutTimeIsoString,
                            setValue: (text: string) => {
                                item.setAccomodationProp(
                                    'checkoutTimeIsoString',
                                    text,
                                )
                            },
                        },
                        {
                            id: 'location',
                            title: '위치',
                            value: item.accomodation?.location,
                            setValue: (text: string) => {
                                item.setAccomodationProp('location', text)
                            },
                            numberOfLines: 2,
                        },
                        {
                            id: 'numberOfClient',
                            title: '인원',
                            value:
                                item.accomodation?.numberOfClient?.toString() ||
                                '',
                            setNumericValue: value => {
                                item.setAccomodationProp(
                                    'numberOfClient',
                                    value,
                                )
                            },
                        },
                        {
                            id: 'clientName',
                            title: '예약자 이름',
                            value: item.accomodation?.clientName,
                            setValue: (text: string) => {
                                item.setAccomodationProp('clientName', text)
                            },
                        },
                        {
                            id: 'category',
                            title: '숙소 타입',
                            value: item.accomodation?.categoryText,
                            setValue: (text: string) => {
                                item.setAccomodationProp(
                                    'category',
                                    text as AccomodationCategory,
                                )
                            },
                        },
                    ]
                    break
                case 'FLIGHT_BOOKING':
                    data = [
                        ...this.flightData,
                        {
                            id: 'numberOfPassenger',
                            title: '인원',
                            value: item.flightBooking?.numberOfPassenger
                                ? item.flightBooking?.numberOfPassenger?.toString()
                                : null,
                            setNumericValue: value => {
                                item.setFlightBookingProp(
                                    'numberOfPassenger',
                                    value,
                                )
                            },
                        },
                        {
                            id: 'passengerName',
                            title: '탑승객 이름',
                            subtitle: '(대표 1명)',
                            value: item.flightBooking?.passengerName,
                            setValue: (text: string) => {
                                item.setFlightBookingProp('passengerName', text)
                            },
                        },
                    ]
                    break
                case 'FLIGHT_TICKET':
                    data = [
                        ...this.flightData,
                        {
                            id: 'passengerName',
                            title: '탑승객 이름',
                            value: item.flightTicket?.passengerName,
                            setValue: (text: string) => {
                                item.setFlightTicketProp('passengerName', text)
                            },
                        },
                    ]
                    break
                case 'GENERAL':
                    data = [
                        {
                            id: 'numberOfClient',
                            title: '인원',
                            value: item.generalReservation?.numberOfClient?.toString(),
                            setNumericValue: value => {
                                item.setGeneralReservationProp(
                                    'numberOfClient',
                                    value,
                                )
                            },
                        },
                        {
                            id: 'clientName',
                            title: '예약자 이름',
                            value: item.generalReservation?.clientName,
                            setValue: (text: string) => {
                                item.setGeneralReservationProp(
                                    'clientName',
                                    text,
                                )
                            },
                        },
                    ]
                    break
                default:
                    data = []
            }
            return [...this.commonData, ...data]
        },
    }))

export type ReservationDataItemKey =
    | keyof SnapshotIn<typeof ReservationModel>
    | keyof SnapshotIn<typeof AccomodationModel>
    | keyof SnapshotIn<typeof FlightBookingModel>
    | keyof SnapshotIn<typeof FlightTicketModel>
    | keyof SnapshotIn<typeof GeneralReservationModel>
    | 'time'

export type ReservationDataItemType = TextInfoListItemProps & {
    id: ReservationDataItemKey
    value?: string | null
    setValue?: (text: string) => void
    setNumericValue?: (value: number | null) => void
    numberOfLines?: number
}

export interface Reservation extends Instance<typeof ReservationModel> {}
export interface ReservationSnapshot
    extends SnapshotOut<typeof ReservationModel> {}
