import { Avatar, AvatarProps } from '@/components/Avatar'
import { Icon } from '@/components/Icon'
import { Label } from '@/components/Label'
import { ListItemBase } from '@/components/ListItem'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import {
    Reservation,
    ReservationDataItemType,
} from '@/models/Reservation/Reservation'
import { openLinkInBrowser } from '@/utils/openLinkInBrowser'
import { useTheme } from '@rneui/themed'
import { ListItem, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback } from 'react'
import { View } from 'react-native'

export const ReservationDetailListItem: FC<{
    reservation: Reservation
    item: Pick<
        ReservationDataItemType,
        'id' | 'title' | 'value' | 'numberOfLines'
    >
}> = observer(({ reservation, item }) => {
    let customElement: ReactNode = null

    const handleLinkPress = useCallback(() => {
        if (item.id === 'primaryHrefLink' && reservation.primaryHrefLink)
            openLinkInBrowser(reservation.primaryHrefLink)
    }, [item.id, reservation.primaryHrefLink])

    const {
        theme: { colors },
    } = useTheme()

    switch (item.id) {
        case 'primaryHrefLink':
            customElement = (
                <TextInfoListItem
                    onPress={handleLinkPress}
                    title={'링크'}
                    rightContent={
                        <ListItem.Chevron
                            name={
                                reservation.primaryHrefLink
                                    ? 'link'
                                    : 'chevron-right'
                            }
                        />
                    }>
                    <TransText
                        primary={!reservation.primaryHrefLink}
                        numberOfLines={1}>
                        {reservation.primaryHrefLink ||
                            reservation.addLinkInstruction}
                    </TransText>
                </TextInfoListItem>
            )
            break

        case 'time':
            customElement =
                reservation.category === 'ACCOMODATION' ? (
                    <>
                        <TextInfoListItem title={'체크인'}>
                            <TransText numberOfLines={1}>
                                {reservation.accomodation
                                    ?.checkinDateTimeParsed || '-'}
                            </TransText>
                        </TextInfoListItem>
                        <TextInfoListItem title={'체크아웃'}>
                            <TransText numberOfLines={1}>
                                {reservation.accomodation
                                    ?.checkoutDateTimeParsed || '-'}
                            </TransText>
                        </TextInfoListItem>
                        {reservation.accomodation?.nightsParsed && (
                            <TextInfoListItem>
                                <Label
                                    title={`${reservation.accomodation?.nightsParsed}`}
                                    avatarProps={{
                                        icon: {
                                            color: colors.text.primary,
                                            name: 'moon',
                                            type: 'octicon',
                                        },
                                    }}
                                />
                            </TextInfoListItem>
                        )}
                    </>
                ) : (
                    <TextInfoListItem title={reservation.timeDataTitle}>
                        <TransText numberOfLines={1}>
                            {reservation.timeParsed || '-'}
                        </TransText>
                    </TextInfoListItem>
                )
            break
        //         case 'category':
        //             inputElement = <></>
        //             break
        //         // case 'checkinDateTime':
        //         //     inputElement = <></>
        //         //     break
        //         // case 'checkoutDateTime':
        //         //     inputElement = <></>
        //         //     break
        //         case 'time':
        //             inputElement =
        //             {reservation.category === 'ACCOMODATION' ? (
        //               <>
        //                 <TextInfoListItem title={'체크인'}>
        //                   <TransText numberOfLines={1}>
        //                     {reservation.accomodation?.checkinDateTimeParsed || '-'}
        //                   </TransText>
        //                 </TextInfoListItem>
        //                 <TextInfoListItem title={'체크아웃'}>
        //                   <TransText numberOfLines={1}>
        //                     {reservation.accomodation?.checkoutDateTimeParsed || '-'}
        //                   </TransText>
        //                 </TextInfoListItem>
        //                 {reservation.accomodation?.nightsParsed && (
        //                   <TextInfoListItem>
        //                     <TransText numberOfLines={1}>
        //                       {`${reservation.accomodation?.nightsParsed}`}
        //                     </TransText>
        //                   </TextInfoListItem>
        //                 )}
        //               </>
        //             ) : (
        //               <TextInfoListItem title={reservation.timeDataTitle}>
        //                 <TransText numberOfLines={1}>
        //                   {reservation.timeParsed || '-'}
        //                 </TransText>
        //               </TextInfoListItem>
        //             )}
        //             break
        //         case 'note':
        //             inputElement =
        //             <TextInfoListItem title={'메모'}>
        //               <TransText numberOfLines={2}>{reservation.note || '-'}</TransText>
        //             </TextInfoListItem>
        //       default:
        //         inputElement = item.numberOfLines ? (
        //           <Text numberOfLines={item.numberOfLines} style={{ lineHeight: 20 }}>
        //             {item.value}
        //           </Text>
        //         ) : (
        //           item.value
        //         )
        //         break
        case 'category':
            if (reservation.category === 'ACCOMODATION') {
                customElement = (
                    <TextInfoListItem
                        onPress={handleLinkPress}
                        title={'숙소 타입'}>
                        <Label
                            title={reservation.accomodation?.categoryText}
                            avatarProps={{
                                icon: {
                                    color: colors.text.primary,
                                    ...(reservation.accomodation?.category ===
                                    'HOTEL'
                                        ? {
                                              type: 'font-awesome-5',
                                              name: 'hotel',
                                          }
                                        : reservation.accomodation?.category ===
                                            'AIRBNB'
                                          ? {
                                                type: 'font-awesome-5',
                                                name: 'airbnb',
                                            }
                                          : reservation.accomodation
                                                  ?.category === 'DORMITORY'
                                            ? {
                                                  type: 'material-community',
                                                  name: 'bunk-bed-outline',
                                              }
                                            : {
                                                  type: 'material-community',
                                                  name: 'bed-king-outline',
                                              }),
                                },
                            }}
                        />
                    </TextInfoListItem>
                )
            }
            break
        default:
            break
    }
    return (
        customElement || (
            <TextInfoListItem title={item.title}>
                {item.numberOfLines ? (
                    <Text
                        numberOfLines={item.numberOfLines}
                        style={{ lineHeight: 20 }}>
                        {item.value}
                    </Text>
                ) : (
                    item.value
                )}
            </TextInfoListItem>
        )
    )
})
