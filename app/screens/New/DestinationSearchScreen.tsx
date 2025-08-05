import {googlePlacesAutocompleteConfig} from '@/components/GooglePlacesAutocompleteConfig'
import {GooglePlacesSearchBarInput} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {goBack} from '@/navigators'
import {countryNameKrToISO} from '@/utils/nation'
import {useLingui} from '@lingui/react/macro'
import {FC, useCallback, useRef, useState} from 'react'
import {
  AutocompleteRequestType,
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
  Query,
} from 'react-native-google-places-autocomplete'
import {DestinationListItemBase} from './DestinationSettingScreen'

/* https://github.com/FaridSafi/react-native-google-places-autocomplete */

const lang = 'ko'

const PlacesAutoCompleteQuery: Query<AutocompleteRequestType> = {
  key: process.env.GOOGLE_PLACES_API_KEY,
  language: lang, // language of the results
  type: '(cities)',
}

const GooglePlacesSearchBar = () => {
  const ref = useRef<GooglePlacesAutocompleteRef>(null)

  // const [debounce, setDebounce] = useState(1000)

  const {t} = useLingui()

  const {tripStore} = useStores()
  //   const {navigateWithTrip} = useNavigate()

  const handlePress = useCallback((data: GooglePlaceData) => {
    console.log(JSON.stringify(data))
    tripStore
      .createDestination({
        description: data.description,
        title: data.structured_formatting.main_text,
        region: data.structured_formatting.secondary_text,
        nation:
          countryNameKrToISO[
            data.structured_formatting.secondary_text.split(' ')[0]
          ] || '',
      })
      .then(() => {
        goBack()
      })
  }, [])

  const renderRow = useCallback((data: GooglePlaceData, index: number) => {
    return (
      <DestinationListItemBase
        key={data.id}
        item={{
          title: data.structured_formatting.main_text,
          region: data.structured_formatting.secondary_text,
          nation:
            countryNameKrToISO[
              data.structured_formatting.secondary_text.split(' ')[0]
            ] || '',
        }}
      />
    )
  }, [])

  return (
    <GooglePlacesAutocomplete
      {...googlePlacesAutocompleteConfig}
      ref={ref}
      onPress={handlePress}
      textInputProps={{
        InputComp: GooglePlacesSearchBarInput,
        leftIcon: {
          name: 'search',
        },
        autoFocus: true,
      }}
      placeholder={t`도시 또는 나라 이름 검색`}
      query={PlacesAutoCompleteQuery}
      renderRow={renderRow}
    />
  )
}
export const DestinationSearchScreen: FC = () => {
  const {tripStore} = useStores()

  const titleText = tripStore.isDestinationSet ? (
    <TransText h2>
      <TransText h2 primary>
        {tripStore.destinationTitles.map(title => title).join('')}
      </TransText>
      {'와\n함께 방문할 도시를 검색해주세요'}
    </TransText>
  ) : (
    '방문할 도시를 검색해주세요'
  )

  return (
    <Screen>
      <ContentTitle title={titleText} />
      <GooglePlacesSearchBar />
    </Screen>
  )
}
