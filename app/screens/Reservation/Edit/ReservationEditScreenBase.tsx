import {
    CategoryListItemProp,
    CategoryMenuBottomSheet,
} from '@/components/BottomSheet/CategoryMenuBottomSheet'
import BottomSheetModal from '@/components/BottomSheetModal'
import { AccomodationDateEditCalendar } from '@/components/Calendar/AccomodationDateEditCalendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import { DatePicker } from '@/components/DatePicker'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import { ControlledListItemInput } from '@/components/Input'
import { Label } from '@/components/Label'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import { TextInfoListItem, TitleSizeType } from '@/components/TextInfoListItem'
import { TextInfoListItemInput } from '@/components/TextInfoListItemInput'
import { TransText } from '@/components/TransText'
import { useReservationStore } from '@/models'
import {
    Accomodation,
    ACCOMODATION_CATEGORY_TO_ICONOBJECT,
    ACCOMODATION_CATEGORY_TO_TITLE,
    AccomodationCategory,
} from '@/models/Reservation/Accomodation'
import {
    Reservation,
    RESERVATION_CATEGORY_TO_ICONOBJECT,
    RESERVATION_CATEGORY_TO_TITLE,
    ReservationCategory,
    ReservationDataItemType,
    ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { goBack, useNavigate } from '@/navigators'
import { AccomodationAvatar } from '@/screens/Accomodation/AccomodationAvatar'
import { filterAlphaNumericUppercase, filterNumeric } from '@/utils/inputFilter'
import { useHeader } from '@/utils/useHeader'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ListItemInputProps } from '@rneui/base/dist/ListItem/ListItem.Input'
import { useTheme } from '@rneui/themed'
import { Divider, Input, ListItem, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    ScrollView,
    TextInput,
    View,
    ViewStyle,
} from 'react-native'

const ConstrainedTextInfoListItemInput: FC<
    ListItemInputProps & {
        // onChangeText: (text: string) => void
        inputFilterFunction: (text: string) => string | false
        invalidInputMessage?: string
    }
> = ({ onChangeText, inputFilterFunction, invalidInputMessage, ...props }) => {
    const ref = useRef<
        TextInput & {
            shake: () => void
        }
    >(null)

    const [showWarning, setShowWarning] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const handleChangeText = useCallback(
        (text: string) => {
            if (onChangeText) {
                const filteredText = inputFilterFunction(text)
                if (filteredText === false) {
                    setShowWarning(true)
                    ref.current?.shake()
                } else {
                    setShowWarning(false)
                    onChangeText(filteredText)
                }
            }
        },
        [onChangeText, ref.current],
    )

    useEffect(() => {
        if (!isFocused) {
            setShowWarning(false)
        }
    }, [isFocused])

    const {
        theme: { colors },
    } = useTheme()

    return (
        <Input
            ref={ref}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            label={showWarning && invalidInputMessage}
            containerStyle={{ marginBottom: 12 }}
            labelStyle={{
                textAlign: 'right',
                position: 'absolute',
                right: 24,
                top: '100%',
                color: colors.warning,
            }}
            size="small"
            {...props}
        />
    )
}

export const ReservationEditScreenBase: FC<{
    reservation: Reservation
    isBeforeInitialization: boolean
}> = observer(({ reservation, isBeforeInitialization }) => {
    const navigation = useNavigation()

    const [tempReservation, setTempReservation] = useState<ReservationSnapshot>(
        getSnapshot(reservation),
    )

    const { navigateWithTrip } = useNavigate()
    const reservationStore = useReservationStore()
    const {
        theme: { colors },
    } = useTheme()

    /* Refs */
    const categoryBottomSheetModalRef = useRef<BottomSheetModal>(null)
    const dateTimePickerBottomSheetModalRef = useRef<BottomSheetModal>(null)
    const accomodationScheduleBottomSheetModalRef =
        useRef<BottomSheetModal>(null)
    const accomodationCategoryBottomSheetModalRef =
        useRef<BottomSheetModal>(null)

    /* States */
    const [isTitleFocused, setIsTitleFocused] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    /* Handlers */
    const handleNotePress = useCallback(() => {
        navigateWithTrip('ReservationNoteEdit', {
            reservationId: reservation.id,
        })
    }, [])

    const handleLinkPress = useCallback(() => {
        navigateWithTrip('ReservationLinkEdit', {
            reservationId: reservation.id,
        })
    }, [])

    const handleConfirmPress = useCallback(() => {
        setIsConfirmed(true)
        reservation.patch(reservation)
        if (isBeforeInitialization) {
            navigation.dispatch(StackActions.pop(1))
        }
        goBack()
    }, [])

    const handleCategoryPress = useCallback(() => {
        categoryBottomSheetModalRef.current?.present()
    }, [categoryBottomSheetModalRef.current])

    const handleBackPressBeforeNavigate = useCallback(async () => {
        if (!isConfirmed && isBeforeInitialization)
            reservationStore.delete(reservation.id)
        else {
            reservation.updateFromSnapshot(tempReservation)
        }
    }, [reservationStore, reservation])

    useHeader({ onBackPressBeforeNavigate: handleBackPressBeforeNavigate })

    const data = reservation.infoEditListItemProps

    type RenderReservationDataProps = ReservationDataItemType

    const renderReservationDetail: ListRenderItem<RenderReservationDataProps> =
        useCallback(({ item }) => {
            let inputComponent: ReactNode
            let rightContent: ReactNode

            switch (item.id) {
                case 'checkinStartTimeIsoString':
                case 'checkinEndTimeIsoString':
                case 'checkoutTimeIsoString':
                    inputComponent = (
                        <ListItemBase
                            onPress={() =>
                                handleTimePress({
                                    initialDate:
                                        reservation.accomodation?.checkinDate ||
                                        new Date(),
                                    setDate: (date: Date) => {
                                        reservation.setDateTime(
                                            date.toISOString(),
                                        )
                                    },
                                })
                            }
                            title={
                                item.value ? item.value : '시간을 선택하세요'
                            }
                            titleColor="secondary"
                            rightContent={
                                <ListItem.Chevron name="keyboard-arrow-down" />
                            }
                        />
                    )
                    rightContent = !item.value ? <ListItem.Chevron /> : null

                    break
                case 'flightNumber':
                    inputComponent = (
                        <ConstrainedTextInfoListItemInput
                            value={item.value || ''}
                            onChangeText={item.setValue}
                            inputFilterFunction={filterAlphaNumericUppercase}
                            invalidInputMessage="영문/숫자만 입력할 수 있어요"
                        />
                    )
                    break
                case 'numberOfClient':
                case 'numberOfClient':
                case 'numberOfPassenger':
                    inputComponent = (
                        <ConstrainedTextInfoListItemInput
                            value={item.value || ''}
                            onChangeText={(text: string) => {
                                if (item.setNumericValue)
                                    item.setNumericValue(
                                        text ? Number(text) : null,
                                    )
                                console.log(text, item.value)
                            }}
                            inputFilterFunction={filterNumeric}
                            invalidInputMessage="숫자만 입력할 수 있어요"
                        />
                    )
                    break
                case 'category':
                    inputComponent = (
                        <ListItemBase
                            avatarProps={{
                                icon: {
                                    ...reservation.accomodation?.icon,
                                    color: colors.text.primary,
                                },
                            }}
                            title={reservation.accomodation?.categoryText}
                            titleColor="secondary"
                            rightContent={
                                <ListItem.Chevron name="keyboard-arrow-down" />
                            }
                            onPress={() => {
                                accomodationCategoryBottomSheetModalRef.current?.present()
                            }}
                        />
                    )
                    break
                default:
                    inputComponent = (
                        <Input
                            value={item.value || ''}
                            onChangeText={item.setValue}
                            size="small"
                        />
                    )
                    break
            }
            return (
                <View>
                    <ListSubheader title={item.title || ''} dense />
                    {inputComponent}
                </View>
                // <TextInfoListItem
                //     title={item.title}
                //     subtitle={item.subtitle}
                //     onPress={onPress}
                //     titleSize={titleSize}
                //     rightContent={rightContent}>
                //     {inputComponent}
                // </TextInfoListItem>
            )
        }, [])

    const [datePickerValue, setDatePickerValue] = useState<Date | undefined>()

    /*
     * BottomSheetModals
     */

    /* DateTimePicker BottomSheetModal */
    const [onDismiss, setOnDismiss] = useState<(date: Date) => void>(date => {})

    const handleTimePress = useCallback(
        ({
            initialDate,
            setDate,
        }: {
            initialDate: Date
            setDate: (date: Date) => void
        }) => {
            setDatePickerValue(initialDate)
            setOnDismiss(() => setDate)
            dateTimePickerBottomSheetModalRef.current?.present()
        },
        [dateTimePickerBottomSheetModalRef.current],
    )

    /* CatgoryMenu BottomSheetModal */
    const categoryMenuData: CategoryListItemProp[] = Object.entries(
        RESERVATION_CATEGORY_TO_TITLE,
    ).map(([_category, title]) => {
        const category = _category as ReservationCategory
        let subtitle: string | undefined
        switch (category) {
            case 'FLIGHT_BOOKING':
                subtitle = '탑승권 받기 전'
                break
            case 'FLIGHT_TICKET':
                subtitle = '탑승권 받은 후'
                break
            case 'VISIT_JAPAN':
                subtitle = '일본 입국수속'
                break
            default:
                subtitle = undefined
                break
        }
        return {
            category: category,
            title,
            subtitle,
            avatarProps: {
                icon: RESERVATION_CATEGORY_TO_ICONOBJECT[category],
            },
            isActive: category === reservation.category,
        }
    })

    /* AccomodationCatgoryMenu BottomSheetModal */
    const accomodationCategoryMenuData: CategoryListItemProp[] = Object.entries(
        ACCOMODATION_CATEGORY_TO_TITLE,
    ).map(([_category, title]) => {
        const category = _category as AccomodationCategory
        return {
            category: category,
            title,
            avatarProps: {
                icon: ACCOMODATION_CATEGORY_TO_ICONOBJECT[category],
            },
            isActive: category === reservation.accomodation?.category,
        }
    })

    return (
        <Screen>
            <ContentTitle
                variant="listItem"
                title={
                    reservation.category === 'ACCOMODATION' ||
                    reservation.category === 'GENERAL' ? (
                        <ControlledListItemInput
                            onChangeText={(text: string) => {
                                reservation.setTitle(text)
                            }}
                            value={reservation.title}
                            placeholder={'예약 이름 입력'}
                            autoFocus={isBeforeInitialization}
                            onBlur={() => setIsTitleFocused(false)}
                            onFocus={() => setIsTitleFocused(true)}
                            // inputContainerStyle={{
                            //   borderBottomWidth: isTitleFocused ? 2 : 0,
                            // }}
                            primary={isTitleFocused}
                            rightIcon={
                                !isTitleFocused && (
                                    <Icon
                                        color={'secondary'}
                                        name="edit"
                                        type="material"
                                    />
                                )
                            }
                        />
                    ) : (
                        <Text h2>{reservation.title}</Text>
                    )
                }
                icon={reservation.icon}
            />
            <ScrollView>
                <TextInfoListItem
                    title={'카테고리'}
                    rightContent={<ListItem.Chevron />}
                    onPress={handleCategoryPress}>
                    <TransText>
                        {reservation.categoryTitle || '카테고리 선택'}
                    </TransText>
                </TextInfoListItem>
                <TextInfoListItem
                    onPress={handleLinkPress}
                    title={'링크'}
                    rightContent={<ListItem.Chevron />}>
                    <TransText
                        primary={!reservation.primaryHrefLink}
                        numberOfLines={1}>
                        {reservation.primaryHrefLink ||
                            reservation.addLinkInstruction}
                    </TransText>
                </TextInfoListItem>
                {reservation.category !== 'ACCOMODATION' && (
                    <TextInfoListItem
                        onPress={() =>
                            handleTimePress({
                                initialDate:
                                    reservation.accomodation?.checkinDate ||
                                    new Date(),
                                setDate: (date: Date) => {
                                    reservation.setDateTime(date.toISOString())
                                },
                            })
                        }
                        title={reservation.timeDataTitle}
                        rightContent={<ListItem.Chevron />}>
                        <TransText numberOfLines={2}>
                            {reservation.timeParsed || '-'}
                        </TransText>
                    </TextInfoListItem>
                )}
                <TextInfoListItem
                    onPress={handleNotePress}
                    title={'메모'}
                    rightContent={<ListItem.Chevron />}>
                    <TransText numberOfLines={2}>
                        {reservation.note || '-'}
                    </TransText>
                </TextInfoListItem>
                {reservation.category === 'ACCOMODATION' && (
                    <>
                        <ListSubheader title={'체크인 · 체크아웃 날짜'} />
                        <ListItem
                            onPress={() => {
                                accomodationScheduleBottomSheetModalRef.current?.present()
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                }}>
                                <TransText numberOfLines={1}>
                                    {reservation.accomodation?.dateParsed ||
                                        '-'}
                                </TransText>
                            </View>
                            <ListItem.Chevron name="keyboard-arrow-down" />
                        </ListItem>
                    </>
                )}
                {data && data.length > 0 && (
                    <>
                        <Divider />
                        <FlatList
                            scrollEnabled={false}
                            data={data}
                            renderItem={renderReservationDetail}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingTop: 24 }}
                        />
                    </>
                )}
            </ScrollView>
            <Fab.Container>
                <Fab.Button
                    disabled={
                        reservation.title.length === 0 ||
                        reservation.isAccomodationWithoutSchedule
                    }
                    onPress={handleConfirmPress}
                    title={
                        reservation.title.length === 0
                            ? '예약 이름을 입력해주세요'
                            : reservation.isAccomodationWithoutSchedule
                              ? '체크인 · 체크아웃 날짜를 선택하세요'
                              : '확인'
                    }
                />
            </Fab.Container>
            <CategoryMenuBottomSheet
                ref={categoryBottomSheetModalRef}
                data={categoryMenuData}
                setCategory={(category: string) => {
                    reservation.setCategory(category as ReservationCategory)
                }}
            />
            <CategoryMenuBottomSheet
                ref={accomodationCategoryBottomSheetModalRef}
                data={accomodationCategoryMenuData}
                setCategory={(category: string) => {
                    reservation.accomodation?.setProp(
                        'category',
                        category as AccomodationCategory,
                    )
                }}
            />
            <BottomSheetModal
                ref={dateTimePickerBottomSheetModalRef}
                onDismiss={() => {
                    if (datePickerValue) onDismiss(datePickerValue)
                    setDatePickerValue(undefined)
                    setOnDismiss(() => {})
                }}>
                <ContentTitle title={'예약 날짜 및 시간'} />
                <DatePicker
                    date={datePickerValue}
                    onDateChange={setDatePickerValue}
                />
            </BottomSheetModal>
            {reservation.accomodation && (
                <BottomSheetModal
                    ref={accomodationScheduleBottomSheetModalRef}
                    onDismiss={() => {
                        if (!reservation.accomodation?.checkoutDateIsoString) {
                            reservation.accomodation?.setProp(
                                'checkinDateIsoString',
                                null,
                            )
                        }
                    }}>
                    <ContentTitle title={'체크인 · 체크아웃 날짜 선택'} />
                    {/* <ListItem>
              <ListItem.Title>
                {reservation.accomodation?.dateParsed || '-'}
              </ListItem.Title>
            </ListItem> */}
                    <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
                        <ScheduleText
                            startDate={
                                reservation.accomodation.checkinDate ??
                                undefined
                            }
                            endDate={
                                reservation.accomodation.checkoutDate ??
                                undefined
                            }
                        />
                    </View>
                    <CalendarContainer style={{ paddingHorizontal: 12 }}>
                        <AccomodationDateEditCalendar
                            accomodation={reservation.accomodation}
                        />
                    </CalendarContainer>
                    <Fab.Container fixed={false} dense>
                        <Fab.Button
                            disabled={!reservation.accomodation.isScheduleSet}
                            onPress={() => {
                                accomodationScheduleBottomSheetModalRef.current?.close()
                            }}
                            title={
                                !reservation.accomodation.checkinDateIsoString
                                    ? '체크인 날짜를 선택하세요'
                                    : !reservation.accomodation
                                            .checkoutDateIsoString
                                      ? '체크아웃 날짜를 선택하세요'
                                      : '확인'
                            }
                        />
                    </Fab.Container>
                </BottomSheetModal>
            )}
        </Screen>
    )
})

const $s: ViewStyle = {
    gap: 32,
}
