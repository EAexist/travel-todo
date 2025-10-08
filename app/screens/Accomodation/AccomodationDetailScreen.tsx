import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import SectionHeader from '@/components/SectionHeader'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { ThirdpartyAvatar } from '@/components/ThirdpartyAvatar'
import { TransText } from '@/components/TransText'
import { useStores, useTripStore } from '@/models'
import { AccomodationInfoProvider } from '@/models/Reservation/Accomodation'
import { AppStackScreenProps, useNavigate } from '@/navigators'
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron'
import { Divider, Text } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback, useEffect } from 'react'
import { FlatList, ListRenderItem, TextStyle, ViewStyle } from 'react-native'

interface AccomodationDetailScreenProps
  extends AppStackScreenProps<'Accomodation'> {}

export const AccomodationDetailScreen: FC<AccomodationDetailScreenProps> =
  observer(({ route }) => {
    const tripStore = useTripStore()
    // useEffect(() => {
    //   tripStore.fetchAccomodation().then(() => {
    //     console.log(tripStore)
    //   })
    // }, [])
    const { accomodationId } = route.params

    const item = tripStore.accomodation.get(accomodationId)

    const handleConfirmPress = useCallback(() => {
      // Handle next button press
      console.log('Next button pressed')
    }, [])

    type TextListItemData = {
      title: string
      content: ReactNode
    }

    const roomDetailData: TextListItemData[] = [
      {
        title: '방 · 인원',
        content: `${item?.roomTitle} · ${item?.numberofClient}명`,
      },
      { title: '예약한 이름', content: item?.clientName },
      {
        title: '체크인',
        content: (
          <TransText style={$contentTextStyle}>
            {item?.checkinDateParsed}{' '}
            <Text style={$contentTextStyle} primary>
              {item?.checkinTimeParsed}
            </Text>
          </TransText>
        ),
      },
      {
        title: '체크아웃',
        content: (
          <TransText style={$contentTextStyle}>
            {item?.checkoutDateParsed}{' '}
            <Text style={$contentTextStyle} primary>
              {item?.checkoutTimeParsed}
            </Text>
          </TransText>
        ),
      },
    ]

    const renderDetailListItem: ListRenderItem<TextListItemData> = ({
      item,
    }) => {
      // const handlePress = () => {
      //   console.log(item.title)
      // }
      return (
        <TextInfoListItem title={item.title}>{item.content}</TextInfoListItem>
      )
    }

    const renderLinkItem: ListRenderItem<{
      provider: AccomodationInfoProvider
      url: string
    }> = ({ item }) => {
      return <ThirdpartyAvatar {...item} />
    }

    const { navigateWithTrip } = useNavigate()
    const handleInputPress = useCallback(() => {
      console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
      navigateWithTrip('AccomodationNote', { accomodationId: item?.id })
    }, [item, navigateWithTrip])

    return item ? (
      <Screen>
        <ContentTitle
          title={`${item.title} 에서\n${item.nightsParsed}을 예약했어요`}
        />
        <TextInfoListItem
          title={'메모'}
          onPress={handleInputPress}
          rightContent={<ListItemChevron></ListItemChevron>}>
          {item.note || <TransText primary>메모를 남겨보세요</TransText>}
        </TextInfoListItem>
        <FlatList
          data={roomDetailData}
          renderItem={renderDetailListItem}
          keyExtractor={item => item.title}
          style={{ flexGrow: 0 }}
        />
        <Divider />
        <SectionHeader>숙박 정보 더 보기</SectionHeader>
        <FlatList
          data={item.links}
          renderItem={renderLinkItem}
          keyExtractor={item => item.provider}
          contentContainerStyle={$thirdpartyListContainerStyle}
        />
        {/* <Fab.Container>
          <Fab.NextButton onPress={handleConfirmPress} />
        </Fab.Container> */}
      </Screen>
    ) : (
      <>Not Found</>
    )
  })

const $contentTextStyle: TextStyle = {
  textAlign: 'right',
}
const $thirdpartyListContainerStyle: ViewStyle = {
  paddingHorizontal: 24,
  paddingVertical: 16,
  flexDirection: 'row',
}
