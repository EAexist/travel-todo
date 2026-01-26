import { GooglePlacesAutocomplete as GooglePlacesAutocompleteNative, GooglePlacesAutocompleteProps as GooglePlacesAutocompleteNativeProps } from "react-native-google-places-autocomplete";
import { googlePlacesAutocompleteConfig } from "./GooglePlacesAutocompleteConfig";

export const GooglePlacesAutocomplete = (props: GooglePlacesAutocompleteNativeProps) => {
    return <GooglePlacesAutocompleteNative
        onPress={() => { }}
        onNotFound={() =>
            console.log('google places autocomplete:No results found')}
        onFail={error => console.error(`google places autocomplete: ${error}`)}
        {...googlePlacesAutocompleteConfig}
        {...props} />
}

