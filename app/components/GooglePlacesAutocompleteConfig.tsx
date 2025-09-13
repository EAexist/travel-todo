import { View } from 'react-native'
import {
  GooglePlacesAutocompleteProps,
  Styles,
} from 'react-native-google-places-autocomplete'

const $googlePlaceSearchBarStyle: Partial<Styles> = {
  listView: {},
  textInputContainer: {},
  row: {
    padding: 0,
  },
}

export const googlePlacesAutocompleteConfig: Partial<GooglePlacesAutocompleteProps> =
  {
    requestUrl: {
      useOnPlatform: 'web', // or "all"
      url: `${process.env.API_URL}/proxy`, // or any proxy server that hits https://maps.googleapis.com/maps/api
      //   headers: {
      //     Accept: 'application/json',
      //   },
    },
    onFail: error => console.error(`google places autocomplete: ${error}`),
    onNotFound: () =>
      console.log('google places autocomplete:No results found'),
    onTimeout: () =>
      console.warn('google places autocomplete: request timeout'),
    enablePoweredByContainer: false,
    styles: $googlePlaceSearchBarStyle,
    listEmptyComponent: <View />,
    predefinedPlaces: [],
    autoFillOnNotFound: false,
    currentLocation: false,
    currentLocationLabel: 'Current location',
    debounce: 500,
    disableScroll: false,
    enableHighAccuracyLocation: true,
    fetchDetails: false,
    filterReverseGeocodingByTypes: [],
    GooglePlacesDetailsQuery: {},
    GooglePlacesSearchQuery: {
      rankby: 'distance',
      type: 'restaurant',
    },
    GoogleReverseGeocodingQuery: {},
    isRowScrollable: true,
    keyboardShouldPersistTaps: 'always',
    listHoverColor: '#ececec',
    listUnderlayColor: '#c8c7cc',
    listViewDisplayed: 'auto',
    keepResultsAfterBlur: false,
    minLength: 0,
    nearbyPlacesAPI: 'GooglePlacesSearch',
    numberOfLines: 1,
    placeholder: '',
    predefinedPlacesAlwaysVisible: false,
    query: {
      key: 'missing api key',
      language: 'en',
      types: 'geocode',
    },
    suppressDefaultStyles: false,
    textInputHide: false,
    textInputProps: {},
    timeout: 10000,
    // listLoaderComponent: <>LOADING</>,
  }
