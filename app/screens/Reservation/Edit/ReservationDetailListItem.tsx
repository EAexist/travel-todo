import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import {
  Reservation,
  ReservationDataItemType,
} from '@/models/Reservation/Reservation'
import { openLinkInBrowser } from '@/utils/openLinkInBrowser'
import { ListItem, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback } from 'react'

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

  switch (item.id) {
    case 'primaryHrefLink':
      customElement = (
        <TextInfoListItem
          onPress={handleLinkPress}
          title={'링크'}
          rightContent={
            <ListItem.Chevron
              name={reservation.primaryHrefLink ? 'link' : 'chevron-right'}
            />
          }>
          <TransText primary={!reservation.primaryHrefLink} numberOfLines={1}>
            {reservation.primaryHrefLink || reservation.addLinkInstruction}
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
                {reservation.accomodation?.checkinDateTimeParsed || '-'}
              </TransText>
            </TextInfoListItem>
            <TextInfoListItem title={'체크아웃'}>
              <TransText numberOfLines={1}>
                {reservation.accomodation?.checkoutDateTimeParsed || '-'}
              </TransText>
            </TextInfoListItem>
            {reservation.accomodation?.nightsParsed && (
              <TextInfoListItem>
                <TransText numberOfLines={1}>
                  {`${reservation.accomodation?.nightsParsed}`}
                </TransText>
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
    default:
      break
  }
  return (
    customElement || (
      <TextInfoListItem title={item.title}>
        {item.numberOfLines ? (
          <Text numberOfLines={item.numberOfLines} style={{ lineHeight: 20 }}>
            {item.value}
          </Text>
        ) : (
          item.value
        )}
      </TextInfoListItem>
    )
  )
})
