import { api } from "@/services/api";
import { InputProps } from "@rneui/themed";
import React, { FC, ForwardRefExoticComponent, useEffect, useState } from 'react';
import { ScrollView, TextInputProps, View } from "react-native";
import { AutocompleteRequestType, GooglePlaceData, GooglePlacesAutocompleteProps as GooglePlacesAutocompleteNativeProps, Query } from "react-native-google-places-autocomplete";

export interface GooglePlaceAutoCompleteResponse {
    predictions: GooglePlaceData[],
    status: string
}

export const GooglePlacesAutocomplete: FC<GooglePlacesAutocompleteNativeProps & {
    textInputProps: TextInputProps & {
        InputComp:
        ForwardRefExoticComponent<InputProps>,
    },
    query: Query<AutocompleteRequestType>
}> = ({
    textInputProps,
    placeholder,
    renderRow,
    listEmptyComponent,
    query,
    onNotFound = () =>
        console.log('google places autocomplete:No results found'),
    onFail = error => console.error(`google places autocomplete: ${error}`),
    debounce = 500,
}) => {
        const [results, setResults] = useState<any[]>([]);
        const { InputComp, onChangeText, value, ...restInputProps } = textInputProps;

        useEffect(() => {
            const handler = setTimeout(async () => {
                if (value && (value.trim().length > 0)) {
                    const response = await api.googlePlaceAutocomplete({
                        input: value,
                        language: query.language,
                        type: query.type,
                    })
                    if (response.kind === 'ok' && response.data.status === "OK") {
                        setResults(response.data.predictions)
                    }
                    else {
                        if (onFail) onFail()
                    }
                } else {
                    if (onNotFound) onNotFound()
                    setResults([])
                }
            }, debounce);
            return () => clearTimeout(handler);
        }, [value, debounce]);

        return (
            <View>
                <InputComp
                    {...restInputProps}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                />
                {
                    renderRow &&
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {results.length > 0
                            ? results.map((item, index) => renderRow(item, index))
                            : listEmptyComponent}
                    </ScrollView>
                }
            </View>
        );
    }