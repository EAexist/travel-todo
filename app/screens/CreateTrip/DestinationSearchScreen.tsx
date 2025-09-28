import { googlePlacesAutocompleteConfig } from '@/components/GooglePlacesAutocompleteConfig'
import { GooglePlacesSearchBarInput } from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import { LoadingScreen } from '@/screens/Loading'
import { Screen } from '@/components/Screen'
import { TransText } from '@/components/TransText'
import { useStores, useTripStore } from '@/models'
import { DestinationSnapshotIn } from '@/models/Destination'
import { goBack } from '@/navigators'
import { rtrim } from '@/utils'
import { countryNameKrToIso } from '@/utils/nation'
import { useLingui } from '@lingui/react/macro'
import { FC, useCallback, useRef } from 'react'
import {
  AutocompleteRequestType,
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
  Query,
} from 'react-native-google-places-autocomplete'
import { DestinationListItemBase } from './DestinationSettingScreen'

/* https://github.com/FaridSafi/react-native-google-places-autocomplete */

const lang = 'ko'

const PlacesAutoCompleteQuery: Query<AutocompleteRequestType> = {
  key: process.env.GOOGLE_PLACES_API_KEY,
  language: lang, // language of the results
  type: '(cities)',
}

const mapGooglePlaceDataToDestination: (
  data: GooglePlaceData,
) => Omit<DestinationSnapshotIn, 'id'> = data => {
  const iso =
    countryNameKrToIso[data.structured_formatting.secondary_text.split(' ')[0]]
  return {
    title:
      iso == 'JP'
        ? rtrim(data.structured_formatting.main_text, '시')
        : data.structured_formatting.main_text, // 일본 지명의 경우 -시 suffix 제거: 아카시시 > 아카시, 교토시 > 교토
    region: data.structured_formatting.secondary_text,
    description: data.description,
    countryIso: iso,
  }
}

const GooglePlacesSearchBar = () => {
  const ref = useRef<GooglePlacesAutocompleteRef>(null)

  // const [debounce, setDebounce] = useState(1000)

  const { t } = useLingui()

  const tripStore = useTripStore()
  //   const {navigateWithTrip} = useNavigate()

  const handlePress = useCallback((data: GooglePlaceData) => {
    console.log(JSON.stringify(data))
    tripStore
      .createDestination(mapGooglePlaceDataToDestination(data))
      .then(() => {
        goBack()
      })
  }, [])

  const renderRow = useCallback((data: GooglePlaceData) => {
    return (
      <DestinationListItemBase
        key={data.id}
        item={mapGooglePlaceDataToDestination(data)}
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
      onFail={() => {
        console.log('FAIL')
      }}
    />
  )
}
export const DestinationSearchScreen: FC = () => {
  const tripStore = useTripStore()

  const titleText = tripStore.isDestinationSet ? (
    <TransText h2>
      <TransText h2 primary>
        {tripStore.destinationTitles.map(title => title).join(', ')}
      </TransText>
      {'와\n함께 여행할 도시를 검색해주세요'}
    </TransText>
  ) : (
    '여행할 도시를 검색해주세요'
  )

  return (
    <Screen>
      <ContentTitle title={titleText} />
      <GooglePlacesSearchBar />
    </Screen>
  )
}
