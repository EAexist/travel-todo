// import {GooglePlacesSearchBarInput} from '@/components/Input'
// import {useStores, useTripStore} from '@/models'
// import {goBack} from '@/navigators'
// import {useLingui} from '@lingui/react/macro'
// import countryNameKrToIsoJSON from 'app/utils/countryNameKrToIso.json'
// import {useCallback, useEffect, useRef} from 'react'
// import {
//   AutocompleteRequestType,
//   GooglePlaceData,
//   GooglePlacesAutocomplete,
//   GooglePlacesAutocompleteProps,
//   GooglePlacesAutocompleteRef,
//   Query,
//   Styles,
// } from 'react-native-google-places-autocomplete'
// import {DestinationListItemBase} from './DestinationSettingScreen'
// import GooglePlacesTextInput, {
//   GooglePlacesTextInputRef,
//   Place,
// } from 'react-native-google-places-textinput'

// /* https://github.com/FaridSafi/react-native-google-places-autocomplete */

// const lang = 'ko'

// const $googlePlaceSearchBarStyle: Partial<Styles> = {
//   listView: {},
//   textInputContainer: {},
//   row: {
//     padding: 0,
//   },
// }

// export const googlePlacesAutocompleteConfig: Partial<GooglePlacesAutocompleteProps> =
//   {
//     requestUrl: {
//       useOnPlatform: 'web', // or "all"
//       url: `http://localhost:5000/proxy/google-places-autocomplete`, // or any proxy server that hits https://maps.googleapis.com/maps/api
//       //   headers: {
//       //     Accept: 'application/json',
//       //   },
//     },
//     enablePoweredByContainer: false,
//     styles: $googlePlaceSearchBarStyle,
//     listEmptyComponent: <></>,
//     predefinedPlaces: [],
//   }

// const PlacesAutoCompleteQuery: Query<AutocompleteRequestType> = {
//   key: process.env.GOOGLE_PLACES_API_KEY,
//   language: lang, // language of the results
//   types: '(cities)',
// }

// export const GooglePlacesAutocompleteWrapper = () => {
//   const ref = useRef<GooglePlacesTextInputRef>(null)

//   useEffect(() => {
//     ref.current?.focus()
//     console.log('APIKEY', process.env.GOOGLE_PLACES_API_KEY)
//   }, [ref])

//   const {t} = useLingui()
//   const countryNameKrToIso = countryNameKrToIsoJSON as {[key: string]: string}

//   const tripStore = useTripStore()
//   //   const {navigateWithTrip} = useNavigate()

//   const handlePress_ = useCallback((data: GooglePlaceData) => {
//     tripStore
//       .createDestination({
//         title: data.structured_formatting.main_text,
//         state: data.structured_formatting.secondary_text,
//         iso2DigitNationCode:
//           countryNameKrToIso[
//             data.structured_formatting.secondary_text.split(',')[0]
//           ] || '',
//       })
//       .then(() => {
//         goBack()
//       })
//   }, [])

//   const handlePress = useCallback((data: Place) => {
//     tripStore
//       .createDestination({
//         title: data.structuredFormat.mainText.text,
//         state: data.structuredFormat.secondaryText?.text || '',
//         iso2DigitNationCode: data.structuredFormat.secondaryText?.text.split(',')
//           ? countryNameKrToIso[
//               data.structuredFormat.secondaryText?.text.split(',')[0]
//             ]
//           : '',
//       })
//       .then(() => {
//         goBack()
//       })
//   }, [])

//   const renderRow = useCallback((data: GooglePlaceData, index: number) => {
//     console.log(data)
//     return (
//       <DestinationListItemBase
//         item={{
//           title: data.structured_formatting.main_text,
//           state: data.structured_formatting.secondary_text,
//           iso2DigitNationCode:
//             countryNameKrToIso[
//               data.structured_formatting.secondary_text.split(' ')[0]
//             ] || '',
//         }}
//       />
//     )
//   }, [])

//   return (
//     <GooglePlacesTextInput
//       apiKey={process.env.GOOGLE_PLACES_API_KEY}
//       proxyUrl="http://localhost:5000/proxy/google-places-autocomplete"
//       //   requestUrl={{
//       //     useOnPlatform: 'web', // or "all"
//       //     url: `http://localhost:5000/proxy/google-places-autocomplete`, // or any proxy server that hits https://maps.googleapis.com/maps/api
//       //     //   headers: {
//       //     //     Accept: 'application/json',
//       //     //   },
//       //   }}
//       //   styles={$googlePlaceSearchBarStyle}
//       ref={ref}
//       debounceDelay={500}
//       onPlaceSelect={handlePress}
//       onError={error => console.error(error)}
//       //   textInputProps={{
//       //     InputComp: GooglePlacesSearchBarInput,
//       //     leftIcon: {
//       //       name: 'search',
//       //     },
//       //     autoFocus: true,
//       //   }}
//       placeHolderText={t`도시 또는 나라 이름 검색`}
//       languageCode="ko"
//       types={["(cities)"]}
//       //   query={PlacesAutoCompleteQuery}
//       renderRow={renderRow}
//     />
//   )
// }
