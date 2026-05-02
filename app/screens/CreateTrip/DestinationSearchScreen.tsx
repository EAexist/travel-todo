import { Avatar } from '@/components/Avatar'
import { GooglePlacesAutocomplete } from '@/components/GooglePlacesAutocomplete/GooglePlacesAutocomplete'
import { Icon } from '@/components/Icon'
import { GooglePlacesSearchBarInput, InputIcon } from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen/Screen'
import { TransText } from '@/components/TransText'
import { useTripStore } from '@/models'
import {
    DestinationCreateDTO,
    DestinationSnapshotIn,
} from '@/models/Destination'
import { goBack } from '@/navigators'
import { getGwaWa } from '@/utils'
import { countryNameKrToIso } from '@/utils/nation'
import { useLingui } from '@lingui/react/macro'
import { ListItem, useTheme } from '@rneui/themed'
import { FC, useCallback, useState } from 'react'
import { View } from 'react-native'
import {
    AutocompleteRequestType,
    GooglePlaceData,
    Query
} from 'react-native-google-places-autocomplete'
import { DestinationListItemBase } from './DestinationSettingScreen'

/* https://github.com/FaridSafi/react-native-google-places-autocomplete */

const lang = 'ko'

const PlacesAutoCompleteQuery: Query<AutocompleteRequestType> = {
    key: "dummy_key",
    language: lang, // language of the results
    type: '(cities)',
}

const removeTrailingSi: (original: string) => string = original => {
    const suffix = '시'
    if (original.endsWith(suffix)) {
        return original.substring(0, original.length - suffix.length)
    }

    return original
}

const mapGooglePlaceDataToDestination: (
    data: GooglePlaceData,
) => Pick<
    DestinationSnapshotIn,
    'title' | 'region' | 'iso2DigitNationCode'
> = data => {
    const iso =
        countryNameKrToIso[
        data.structured_formatting.secondary_text.split(' ')[0]
        ]
    return {
        title:
            iso == 'JP'
                ? removeTrailingSi(data.structured_formatting.main_text)
                : data.structured_formatting.main_text, // 일본 지명의 경우 -시 suffix 제거: 아카시시 > 아카시, 교토시 > 교토
        region: data.structured_formatting.secondary_text,
        // description: data.description,
        iso2DigitNationCode: iso,
    }
}

const GooglePlacesSearchBar = () => {
    // const ref = useRef<GooglePlacesAutocompleteRef>(null)

    const {
        theme: { colors },
    } = useTheme()
    // const [debounce, setDebounce] = useState(1000)

    const { t } = useLingui()

    const tripStore = useTripStore()
    //   const {navigateWithTrip} = useNavigate()

    const [inputText, setInputText] = useState('')

    const handlePressCustomDestination = useCallback(() => {
        tripStore
            .createDestination({
                title: inputText,
            })
            .then(() => {
                goBack()
            })
    }, [inputText])

    const handlePressAdd = useCallback((destination: DestinationCreateDTO) => {
        tripStore.createDestination(destination).then(() => {
            goBack()
        })
    }, [])

    const renderRow = useCallback((data: GooglePlaceData) => {
        const destination = mapGooglePlaceDataToDestination(data)

        const isAlreadyAdded = tripStore.destinations.some(
            dest =>
                dest.title === destination.title &&
                dest.region === destination.region,
        )
        // console.log(data)
        return (
            <DestinationListItemBase
                onPress={() => handlePressAdd(destination)}
                key={data.place_id}
                item={destination}
                rightContent={
                    isAlreadyAdded ? (
                        <Avatar
                            icon={{
                                name: 'check',
                                type: 'material',
                                color: colors.contrastText.secondary,
                            }}
                        />
                    ) : (
                        <ListItem.Chevron />
                    )
                }
                disabled={isAlreadyAdded}
                useDisabledStyle={isAlreadyAdded}
            />
        )
    }, [])

    const handleTextChange = useCallback((text: string) => {
        setInputText(text)
    }, [])

    const isAlreadyAdded = tripStore.destinations.some(
        dest => dest.title === inputText && dest.region === null,
    )

    const isInputNotValidHangul = (inputText.length > 0) && !containsHangul(inputText)

    return (
        <View>
            <GooglePlacesAutocomplete
                textInputProps={{
                    InputComp: GooglePlacesSearchBarInput,
                    leftIcon: (
                        // name: 'search',
                        <InputIcon size={24} name={'search'} />
                    ),
                    autoFocus: true,
                    value: inputText,
                    onChangeText: handleTextChange,
                    style: {
                        fontSize: 17,
                    },
                }}
                placeholder={t`도시 또는 국가 검색`}
                query={PlacesAutoCompleteQuery}
                renderRow={renderRow}
                onFail={error => {
                    console.log(error)
                }}
                listEmptyComponent={
                    isInputNotValidHangul && (
                        <ListItem>
                            <Icon
                                name="error"
                                type="material"
                                color={colors.text.secondary}
                            />
                            <ListItem.Title>
                                {'한글만 검색할 수 있어요'}
                            </ListItem.Title>
                        </ListItem>
                    )
                }
            />
            {inputText ? (
                <View style={{ paddingTop: 24 }}>
                    {!isAlreadyAdded ? (
                        <>
                            <ListSubheader
                                title={'도시를 찾지 못하셨나요?'}
                                dense
                            />
                            <ListItemBase
                                onPress={handlePressCustomDestination}
                                title={`"${inputText}" 직접 추가하기`}
                                rightContent={<ListItem.Chevron />}
                            />
                        </>
                    ) : (
                        <>
                            <ListSubheader
                                title={'같은 이름의 목적지가 이미 있어요'}
                                dense
                            />
                            <DestinationListItemBase
                                useDisabledStyle
                                item={{ title: `${inputText}` }}
                                rightContent={
                                    <Avatar
                                        icon={{
                                            name: 'check',
                                            type: 'material',
                                            color: colors.contrastText
                                                .secondary,
                                        }}
                                    />
                                }
                            />
                        </>
                    )}
                </View>
            ) : null}
        </View>
    )
}
export const DestinationSearchScreen: FC = () => {
    const tripStore = useTripStore()

    const destinationTitles = tripStore.destinationTitles
        .map(title => title)
        .join(', ')

    const titleText = tripStore.isDestinationSet ? (
        <TransText h2>
            <TransText h2 primary>
                {destinationTitles}
            </TransText>
            {`${getGwaWa(destinationTitles)}\n함께 여행할 도시를 검색해주세요`}
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

const containsHangul = (text: string): boolean => {
    // Regex matches the Unicode range for:
    // 1. Hangul Syllables (가-힣: U+AC00 - U+D7A3)
    // 2. Hangul Compatibility Jamo (ㄱ-ㅎ, ㅏ-ㅣ: U+3130 - U+318F)
    const koreanRegex = /[\uAC00-\uD7AF\u3130-\u318F]/g

    // The .test() method returns true if the regex finds a match in the string.
    return koreanRegex.test(text)
}
