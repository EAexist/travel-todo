import { Avatar, AvatarProps } from '@/components/Avatar'
import BottomSheetModal, {
  GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import { Icon } from '@/components/Icon'
import {
  ControlledInputProps,
  ControlledListItemInput,
} from '@/components/Input'
import ContentTitle, { Title } from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import {
  TextInfoListItem,
  TextInfoListItemProps,
  TitleSizeType,
} from '@/components/TextInfoListItem'
import { TextInfoListItemInput } from '@/components/TextInfoListItemInput'
import { TransText } from '@/components/TransText'
import { useStores } from '@/models'
import {
  Reservation,
  RESERVATION_CATEGORY_TO_ICON,
  RESERVATION_CATEGORY_TO_TITLE,
  ReservationCategory,
  ReservationDataItemType,
  ReservationModel,
  ReservationSnapshot,
} from '@/models/Reservation/Reservation'
import { AirportModel } from '@/models/Todo'
import { goBack, ReservationStackProps, useNavigate } from '@/navigators'
import { filterAlphaNumericUppercase, filterNumeric } from '@/utils/inputFilter'
import { useHeader } from '@/utils/useHeader'
import { StackActions, useNavigation } from '@react-navigation/native'
import {
  ListItemInput,
  ListItemInputProps,
} from '@rneui/base/dist/ListItem/ListItem.Input'
import { Divider, InputProps, ListItem, Text } from '@rneui/themed'
import { time } from 'console'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  DimensionValue,
  FlatList,
  ListRenderItem,
  ScrollView,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'
import DatePicker from 'react-native-date-picker'

const ConstrainedTextInfoListItemInput: FC<
  ListItemInputProps & {
    // onChangeText: (text: string) => void
    inputFilterFunction: (text: string) => string | false
  }
> = ({ onChangeText, inputFilterFunction, ...props }) => {
  const ref = useRef<
    TextInput & {
      shake: () => void
    }
  >(null)

  const handleChangeText = useCallback(
    (text: string) => {
      if (onChangeText) {
        const filteredText = inputFilterFunction(text)
        if (filteredText === false) {
          ref.current?.shake()
        } else {
          onChangeText(filteredText)
        }
      }
    },
    [onChangeText, ref.current],
  )

  return (
    <TextInfoListItemInput
      ref={ref}
      onChangeText={handleChangeText}
      {...props}
    />
  )
}

export const EditReservationScreenBase: FC<{
  reservation: Reservation
  isBeforeInitialization: boolean
}> = observer(({ reservation, isBeforeInitialization }) => {
  const navigation = useNavigation()

  const [tempReservation, setTempReservation] = useState<ReservationSnapshot>(
    getSnapshot(reservation),
  )

  //   useLayoutEffect(() => {

  //   })

  const [date, setDate] = useState(new Date())
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { navigateWithTrip } = useNavigate()
  const { reservationStore } = useStores()

  const handleNotePress = useCallback(() => {
    navigateWithTrip('EditReservationNote', {
      reservationId: reservation.id,
    })
  }, [reservation.id])

  const handleLinkPress = useCallback(() => {
    navigateWithTrip('EditReservationLink', {
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

  const dateTimePickerBottomSheetModalRef = useRef<BottomSheetModal>(null)
  const handleTimePress = useCallback(() => {
    dateTimePickerBottomSheetModalRef.current?.present()
  }, [dateTimePickerBottomSheetModalRef.current])

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

  const data = reservation.infoEditListItemProps.sort((a, b) => {
    const isNullA = a.value === null ? 1 : 0
    const isNullB = b.value === null ? 1 : 0
    return isNullA - isNullB
  })
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

  type RenderReservationDataProps = ReservationDataItemType & {
    setValue?: (text: string) => void
  }

  const renderReservationDetail: ListRenderItem<RenderReservationDataProps> =
    useCallback(({ item }) => {
      let inputComponent: ReactNode
      let onPress: (() => void) | undefined = undefined
      let titleSize: TitleSizeType = 'md'

      switch (item.id) {
        case 'checkinDateIsoString':
        case 'checkoutDateIsoString':
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
          onPress = () => {}
          break
        case 'flightNumber':
          inputComponent = (
            <ConstrainedTextInfoListItemInput
              value={item.value || ''}
              onChangeText={item.setValue}
              inputFilterFunction={filterAlphaNumericUppercase}
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
      //   }
      return (
        <TextInfoListItem
          title={item.title}
          onPress={onPress}
          titleSize={titleSize}>
          {inputComponent}
        </TextInfoListItem>
      )
    }, [])

  return (
    <GestureHandlerRootViewWrapper>
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
                inputContainerStyle={{
                  borderBottomWidth: isTitleFocused ? 2 : 0,
                }}
                primary={isTitleFocused}
              />
            ) : (
              <Text>{reservation.title}</Text>
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
              {reservation.primaryHrefLink || '예약 확인 링크를 입력하세요'}
            </TransText>
          </TextInfoListItem>
          {reservation.category === 'ACCOMODATION' ? (
            <>
              <TextInfoListItem
                onPress={handleTimePress}
                title={'체크인'}
                rightContent={<ListItem.Chevron />}>
                <TransText numberOfLines={1}>
                  {reservation.time || '-'}
                </TransText>
              </TextInfoListItem>
              <TextInfoListItem
                onPress={handleTimePress}
                title={'체크아웃'}
                rightContent={<ListItem.Chevron />}>
                <TransText numberOfLines={1}>
                  {reservation.time || '-'}
                </TransText>
              </TextInfoListItem>
            </>
          ) : (
            <TextInfoListItem
              onPress={handleTimePress}
              title={reservation.timeDataTitle}
              rightContent={<ListItem.Chevron />}>
              <TransText numberOfLines={2}>{reservation.time || '-'}</TransText>
            </TextInfoListItem>
          )}
          <TextInfoListItem
            onPress={handleNotePress}
            title={'메모'}
            rightContent={<ListItem.Chevron />}>
            <TransText numberOfLines={2}>{reservation.note || '-'}</TransText>
          </TextInfoListItem>
          {data && (
            <>
              <Divider />
              <ListSubheader title={'상세 내역'} />
              <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={renderReservationDetail}
                keyExtractor={item => item.title}
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
        <BottomSheetModal ref={dateTimePickerBottomSheetModalRef}>
          <ContentTitle title={'예약 날짜 및 시간'} />
          <DatePicker date={date} onDateChange={setDate} />
        </BottomSheetModal>
      </Screen>
    </GestureHandlerRootViewWrapper>
  )
})

const $s: ViewStyle = {
  gap: 32,
}
