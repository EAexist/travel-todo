import {
    Icon,
    IconProps,
    InputProps,
    ListItem,
    Input as RNEInput,
    useTheme,
} from '@rneui/themed'
import {
    ComponentType,
    createRef,
    FC,
    forwardRef,
    useCallback,
    useEffect,
    useState,
} from 'react'
import { TextInput, TextStyle, ViewStyle } from 'react-native'
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete'

// https://stackoverflow.com/questions/34087459/focus-style-for-textinput-in-react-native
export type ControlledInputProps = {
    value?: string
} & Omit<InputProps, 'value' | 'numberOfLines'>

export const withControl = <T,>(
    WrappedComponent: ComponentType<T & InputProps>,
) => {
    const Component: FC<ControlledInputProps & T> = ({
        value,
        onChangeText,
        autoFocus,
        ...props
    }) => {
        const [isFocused, setIsFocused] = useState(false)
        return (
            <WrappedComponent
                onChangeText={onChangeText}
                value={value}
                numberOfLines={1}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                primary={isFocused}
                autoFocus={autoFocus}
                {...(props as T)}
            />
        )
    }
    return Component
}

export const ControlledInput = withControl(RNEInput as FC)
export const ControlledListItemInput = withControl(ListItem.Input as FC)

export const InputIcon = (props: IconProps) => {
    const {
        theme: { colors },
    } = useTheme()
    return (
        <Icon
            size={24}
            type={'material'}
            color={colors.text.secondary}
            {...props}
        />
    )
}

export const SearchBase = (props: InputProps) => {
    return (
        <RNEInput
            leftIcon={<InputIcon size={24} name={'search'} />}
            style={{ fontSize: 17 }}
            {...props}
        />
    )
}

export const GooglePlacesSearchBarInput = forwardRef<
    GooglePlacesAutocompleteRef,
    InputProps
>((props, ref) => {
    return <RNEInput ref={ref} {...props} />
})
const $searchBaseContainerStyle: ViewStyle = {
    backgroundColor: 'cadetblue',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
}

GooglePlacesSearchBarInput.displayName = 'GooglePlacesSearchBarInput'

export const Search = ({
    value,
    setValue,
    ...props
}: {
    value: string
    setValue: (value: string) => void
} & InputProps) => {
    const inputRef = createRef<TextInput>()

    const handleChangeText = useCallback(
        (input: string) => {
            setValue(input)
        },
        [setValue],
    )

    useEffect(() => {
        inputRef.current?.focus()
    }, [inputRef])

    return (
        <RNEInput
            ref={inputRef}
            onChangeText={handleChangeText}
            value={value}
            multiline
            //   underlineColorAndroid={'transparent'}
            //   style={{
            //     paddingTop: 0,
            //     paddingBottom: 0,
            //   }}
            {...props}
        />
    )
}

const $inputStyle: TextStyle = {
    fontFamily: 'Pretendard',
    fontWeight: 400,
    fontSize: 21,
    lineHeight: 1.6 * 21,
    textAlignVertical: 'bottom',
    // height: 1.6 * 21,
    // minHeight: 1.6 * 21,
}

// interface InputBaseProps extends InputProps {
//   iconProps?: IconProps
// }
// export const InputBase = ({iconProps, ...props}: InputBaseProps) => {
//   const {
//     theme: {colors},
//   } = useTheme()
//   return (
//     <RNEInput
//       {...(iconProps
//         ? {
//             leftIcon: (
//               <Icon
//                 size={24}
//                 type={'material'}
//                 color={colors.text.secondary}
//                 {...iconProps}
//               />
//             ),
//             leftIconContainerStyle: {
//               paddingRight: 16,
//               width: 48,
//             },
//           }
//         : {})}
//       {...props}
//     />
//   )
// }
