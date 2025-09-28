import { AccomodationInfoProvider } from '@/models/Reservation/Accomodation'
import { Avatar, AvatarProps, ListItem } from '@rneui/themed'
import { useCallback } from 'react'
import {
  Alert,
  ImageSourcePropType,
  Linking,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { Trans } from '@lingui/react/macro'
import * as airbnbLogo from 'assets/images/third-party/airbnb-logo.png'
import * as googleMapLogo from 'assets/images/third-party/googleMap-logo.png'

const sources: { [key: AccomodationInfoProvider]: ImageSourcePropType } = {
  airbnb: airbnbLogo,
  googleMap: googleMapLogo,
}

const titles: { [key: AccomodationInfoProvider]: string } = {
  airbnb: '에어비엔비',
  googleMap: '구글 지도',
}

export type LinkData = {
  provider: AccomodationInfoProvider
  url: string
}

export interface ThirdpartyAvatarProps extends AvatarProps, LinkData {}

export const ThirdpartyAvatar = ({
  provider,
  url,
  ...props
}: ThirdpartyAvatarProps) => {
  // https://reactnative.dev/docs/linking?language=typescript#open-links-and-deep-links-universal-links
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url)
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }, [url])

  return (
    <TouchableOpacity onPress={handlePress} style={$thirdpartyAvatarStyle}>
      <Avatar
        source={sources[provider]}
        rounded={true}
        size={'large'}
        imageProps={{ style: { width: 40, height: 40 } }}
        {...props}
      />
      <ListItem.Subtitle style={$labelStyle}>
        <Trans>{titles[provider]}</Trans>
      </ListItem.Subtitle>
    </TouchableOpacity>
  )
}
// ListItemSubtitle
const $labelStyle: TextStyle = { paddingTop: 8 }
const $thirdpartyAvatarStyle: ViewStyle = {
  width: 80,
  alignItems: 'center',
}
