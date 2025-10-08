import { Avatar, AvatarProps } from '@/components/Avatar'
import BottomSheetModal, {
  GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import { AccomodationDateEditCalendar } from '@/components/Calendar/AccomodationDateEditCalendar'
import { CalendarContainer } from '@/components/Calendar/CalendarContainer'
import { ScheduleText } from '@/components/Calendar/useScheduleSettingCalendar'
import { DatePicker } from '@/components/DatePicker'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import { ControlledListItemInput } from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import { TextInfoListItem, TitleSizeType } from '@/components/TextInfoListItem'
import { TextInfoListItemInput } from '@/components/TextInfoListItemInput'
import { TransText } from '@/components/TransText'
import { useStores } from '@/models'
import {
  Reservation,
  RESERVATION_CATEGORY_TO_ICON,
  RESERVATION_CATEGORY_TO_TITLE,
  ReservationCategory,
  ReservationDataItemType,
  ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { goBack, useNavigate } from '@/navigators'
import { filterAlphaNumericUppercase, filterNumeric } from '@/utils/inputFilter'
import { useHeader } from '@/utils/useHeader'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ListItemInputProps } from '@rneui/base/dist/ListItem/ListItem.Input'
import { Divider, ListItem, Text } from '@rneui/themed'
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

  return (
    <TextInfoListItemInput
      ref={ref}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      label={showWarning && invalidInputMessage}
      containerStyle={{ marginBottom: 12 }}
      labelStyle={{
        textAlign: 'right',
        position: 'absolute',
        right: 0,
        top: '100%',
      }}
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

  const [isConfirmed, setIsConfirmed] = useState(false)
  const { navigateWithTrip } = useNavigate()
  const { reservationStore } = useStores()

  const handleNotePress = useCallback(() => {
    navigateWithTrip('ReservationNoteEdit', {
      reservationId: reservation.id,
    })
  }, [reservation.id])

  const handleLinkPress = useCallback(() => {
    navigateWithTrip('ReservationLinkEdit', {
      reservationId: reservation.id,
    })
  }, [reservation.id])

  const handleConfirmPress = useCallback(() => {
    setIsConfirmed(true)
    reservationStore.patch(reservation as ReservationSnapshot)
    if (isBeforeInitialization) {
      navigation.dispatch(StackActions.pop(1))
    }
    goBack()
  }, [reservation, reservation, setIsConfirmed])

  /* DateTimePicker Menu */

  const [onDismiss, setOnDismiss] = useState<(date: Date) => void>(date => {})

  const dateTimePickerBottomSheetModalRef = useRef<BottomSheetModal>(null)
  const accomodationScheduleBottomSheetModalRef = useRef<BottomSheetModal>(null)
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

  /* category Menu */
  const categoryBottomSheetModalRef = useRef<BottomSheetModal>(null)

  type CategoryListItemData = {
    category: ReservationCategory
    title: string
    avatarProps: AvatarProps
    isActive?: boolean
  }
  const renderCategoryListItem: ListRenderItem<CategoryListItemData> =
    useCallback(
      ({ item }) => {
        const handlePress = () => {
          console.log(
            `[bottomSheetModalRef.current] ${categoryBottomSheetModalRef.current}`,
          )
          reservation.setCategory(item.category)
          categoryBottomSheetModalRef.current?.close()
        }
        return (
          <ListItem onPress={handlePress} style={$s}>
            <Avatar
              //   size="medium"
              {...item.avatarProps}
            />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
              {item.category === 'FLIGHT_BOOKING' && (
                <ListItem.Subtitle>{'탑승권 받기 전'}</ListItem.Subtitle>
              )}
              {item.category === 'FLIGHT_TICKET' && (
                <ListItem.Subtitle>{'탑승권 받은 후'}</ListItem.Subtitle>
              )}
              {item.category === 'VISIT_JAPAN' && (
                <ListItem.Subtitle>{'일본 입국수속'}</ListItem.Subtitle>
              )}
            </ListItem.Content>
            {item.isActive && (
              <ListItem.Chevron primary onPress={handlePress} name="check" />
            )}
          </ListItem>
        )
      },
      [categoryBottomSheetModalRef, reservation],
    )

  const handleCategoryPress = useCallback(() => {
    categoryBottomSheetModalRef.current?.present()
  }, [categoryBottomSheetModalRef])

  const handleBackPressBeforeNavigate = useCallback(async () => {
    if (!isConfirmed && isBeforeInitialization)
      reservationStore.delete(reservation.id)
    else {
      reservation.updateFromSnapshot(tempReservation)
    }
  }, [reservationStore, reservation])

  useHeader({ onBackPressBeforeNavigate: handleBackPressBeforeNavigate })

  const [isTitleFocused, setIsTitleFocused] = useState(false)
  const [isLinkFocused, setIsLinkFocused] = useState(false)

  const data = reservation.infoEditListItemProps
  // .map(item => {
  //   let setValue: ((text: string) => void) | undefined = undefined
  //   switch (item.id) {
  //     case 'flightNumber':
  //       setValue = (text: string) => {
  //         reservation.setFlightProp('flightNumber', text)
  //       }
  //       break
  //     case 'flightBooking':
  //       break
  //     case 'departureAirport':
  //       break
  //     case 'arrivalAirport':
  //       break
  //     default:
  //       break
  //   }
  //   return {
  //     setValue,
  //     ...item,
  //   }
  // })

  type RenderReservationDataProps = ReservationDataItemType

  const renderReservationDetail: ListRenderItem<RenderReservationDataProps> =
    useCallback(({ item }) => {
      let inputComponent: ReactNode
      let onPress: (() => void) | undefined = undefined
      let titleSize: TitleSizeType = 'md'

      switch (item.id) {
        case 'checkinStartTimeIsoString':
        case 'checkinEndTimeIsoString':
        case 'checkoutTimeIsoString':
          titleSize = 'lg'
          inputComponent = item.value ? (
            <Text>{item.value}</Text>
          ) : (
            <View>
              <ListItem.Chevron />
            </View>
          )
          onPress = () =>
            handleTimePress({
              initialDate: reservation.accomodation?.checkinDate || new Date(),
              setDate: (date: Date) => {
                reservation.setDateTime(date.toISOString())
              },
            })

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
        case 'numberOfPassenger':
          inputComponent = (
            <ConstrainedTextInfoListItemInput
              value={item.value || ''}
              onChangeText={(text: string) => {
                if (item.setNumericValue) item.setNumericValue(Number(text))
                console.log(text, item.value)
              }}
              inputFilterFunction={filterNumeric}
              invalidInputMessage="숫자만 입력할 수 있어요"
            />
          )
          break
        default:
          inputComponent = (
            <TextInfoListItemInput
              value={item.value || ''}
              onChangeText={item.setValue}
            />
          )
          break
      }
      return (
        <TextInfoListItem
          title={item.title}
          subtitle={item.subtitle}
          onPress={onPress}
          titleSize={titleSize}>
          {inputComponent}
        </TextInfoListItem>
      )
    }, [])

  const [datePickerValue, setDatePickerValue] = useState<Date | undefined>()

  return (
    <GestureHandlerRootViewWrapper>
      <Screen>
        <ContentTitle
          variant="listItem"
          title={
            reservation.category === 'ACCOMODATION' ||
            reservation.category === 'GENERAL' ? (
              <View style={{ flex: 1 }}>
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
                      <Icon color={'secondary'} name="edit" type="material" />
                    )
                  }
                />
              </View>
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
            <TransText primary={!reservation.primaryHrefLink} numberOfLines={1}>
              {reservation.primaryHrefLink || reservation.addLinkInstruction}
            </TransText>
          </TextInfoListItem>
          {reservation.category !== 'ACCOMODATION' && (
            <TextInfoListItem
              onPress={() =>
                handleTimePress({
                  initialDate:
                    reservation.accomodation?.checkinDate || new Date(),
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
            <TransText numberOfLines={2}>{reservation.note || '-'}</TransText>
          </TextInfoListItem>
          {reservation.category === 'ACCOMODATION' && (
            <>
              <Divider />
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
                    {reservation.accomodation?.dateParsed || '-'}
                  </TransText>
                </View>
                <ListItem.Chevron />
              </ListItem>
            </>
          )}
          {data && data.length > 0 && (
            <>
              <Divider />
              <ListSubheader title={'상세 내역'} />
              <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={renderReservationDetail}
                keyExtractor={item => item.id}
              />
            </>
          )}
        </ScrollView>
        <Fab.Container>
          <Fab.Button
            disabled={reservation.title.length === 0}
            onPress={handleConfirmPress}
            title={'확인'}
          />
        </Fab.Container>
        <BottomSheetModal ref={categoryBottomSheetModalRef}>
          <ContentTitle title={'카테고리 선택'} />
          <FlatList
            data={Object.entries(RESERVATION_CATEGORY_TO_TITLE).map(
              ([_category, title]) => {
                const category = _category as ReservationCategory
                return {
                  category: category,
                  title,
                  avatarProps: {
                    icon: RESERVATION_CATEGORY_TO_ICON[category],
                  },
                  isActive: category === reservation.category,
                }
              },
            )}
            renderItem={renderCategoryListItem}
            keyExtractor={item => item.category}
          />
        </BottomSheetModal>
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
          <BottomSheetModal ref={accomodationScheduleBottomSheetModalRef}>
            <ContentTitle title={'체크인 · 체크아웃 날짜 선택'} />
            {/* <ListItem>
              <ListItem.Title>
                {reservation.accomodation?.dateParsed || '-'}
              </ListItem.Title>
            </ListItem> */}
            <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
              <ScheduleText
                startDate={reservation.accomodation.checkinDate ?? undefined}
                endDate={reservation.accomodation.checkoutDate ?? undefined}
              />
            </View>
            <CalendarContainer style={{ paddingHorizontal: 12 }}>
              <AccomodationDateEditCalendar
                accomodation={reservation.accomodation}
              />
            </CalendarContainer>
            <Fab.Container fixed={false} dense>
              <Fab.Button
                // disabled={reservation.title.length === 0}
                onPress={() => {
                  accomodationScheduleBottomSheetModalRef.current?.close()
                }}
                title={'확인'}
              />
            </Fab.Container>
          </BottomSheetModal>
        )}
      </Screen>
    </GestureHandlerRootViewWrapper>
  )
})

const $s: ViewStyle = {
  gap: 32,
}
