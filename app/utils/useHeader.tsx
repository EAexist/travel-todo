import { BackButton, RightActionButton } from '@/components/Header'
import { IconProps } from '@/components/Icon'
import { TransText } from '@/components/TransText'
import { NavigateProps } from '@/navigators'
import { typography } from '@/rneui/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
    Header,
    HeaderProps as RNEHeaderProps,
    Text,
    TextProps,
    useTheme,
} from '@rneui/themed'
import { BlurView } from 'expo-blur'
import {
    FC,
    ReactElement,
    useCallback,
    useEffect,
    useLayoutEffect,
} from 'react'
import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { ApiStatus, useApiStatus } from './useApiStatus'

interface HeaderProps extends RNEHeaderProps {
    backgroundColor?: 'primary' | 'secondary'
    headerShown?: boolean
    backButtonShown?: boolean
    rightActionTitle?: string
    onRightPress?: () => void
    backNavigateProps?: NavigateProps
    onBackPressBeforeNavigate?: () => Promise<any>
}

/**
 * A hook that can be used to easily set the Header of a react-navigation screen from within the screen's component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/utility/useHeader/}
 * @param {HeaderProps} headerProps - The props for the `Header` component.
 * @param {any[]} deps - The dependencies to watch for changes to update the header.
 */
export function useHeader(
    {
        headerShown = true,
        backButtonShown = true,
        rightActionTitle,
        onRightPress,
        backNavigateProps,
        onBackPressBeforeNavigate,
        leftComponent,
        containerStyle,
        backgroundColor = 'primary',
        ...props
    }: HeaderProps,
    deps: Parameters<typeof useLayoutEffect>[1] = [],
) {
    const navigation = useNavigation()

    const { apiStatus } = useApiStatus()

    /**
     * We need to have multiple implementations of this hook for web and mobile.
     * Web needs to use useEffect to avoid a rendering loop.
     * In mobile and also to avoid a visible header jump when navigating between screens, we use
     * `useLayoutEffect`, which will apply the settings before the screen renders.
     */
    const usePlatformEffect =
        Platform.OS === 'web'
            ? useEffect
            : // ? (effect: EffectCallback, deps?: DependencyList) =>
              //       useFocusEffect(useCallback(effect, deps || []))
              useLayoutEffect

    const {
        theme: { colors },
    } = useTheme()

    // To avoid a visible header jump when navigating between screens, we use
    // `useLayoutEffect`, which will apply the settings before the screen renders.
    usePlatformEffect(() => {
        navigation.setOptions({
            headerShown,
            header: () => (
                <BlurView intensity={1}>
                    <Header
                        leftComponent={
                            backButtonShown ? (
                                <BackButton
                                    navigateProps={backNavigateProps}
                                    onBackPressBeforeNavigate={
                                        onBackPressBeforeNavigate
                                    }
                                />
                            ) : (
                                leftComponent
                            )
                        }
                        rightComponent={
                            <RightActionButton
                                onPress={onRightPress}
                                title={rightActionTitle}
                            />
                        }
                        containerStyle={[
                            containerStyle,
                            {
                                backgroundColor:
                                    backgroundColor === 'secondary'
                                        ? colors.secondaryBg
                                        : // : 'red',
                                          undefined,
                            },
                        ]}
                        {...props}
                        centerContainerStyle={
                            !!props.centerComponent
                                ? $headerCenterTitleContainerStyle
                                : undefined
                        }
                    />
                </BlurView>
            ),
        })
        // intentionally created API to have user set when they want to update the header via `deps`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, navigation, apiStatus === ApiStatus.IDLE])
}

export function useHeaderOnFocus(
    {
        headerShown = true,
        backButtonShown = true,
        rightActionTitle,
        onRightPress,
        backNavigateProps,
        onBackPressBeforeNavigate,
        leftComponent,
        containerStyle,
        backgroundColor = 'primary',
        ...props
    }: HeaderProps,
    deps: Parameters<typeof useLayoutEffect>[1] = [],
) {
    const navigation = useNavigation()

    /**
     * We need to have multiple implementations of this hook for web and mobile.
     * Web needs to use useEffect to avoid a rendering loop.
     * In mobile and also to avoid a visible header jump when navigating between screens, we use
     * `useLayoutEffect`, which will apply the settings before the screen renders.
     */
    const usePlatformEffect =
        Platform.OS === 'web'
            ? useFocusEffect
            : // ? (effect: EffectCallback, deps?: DependencyList) =>
              //       useFocusEffect(useCallback(effect, deps || []))
              useFocusEffect

    const {
        theme: { colors },
    } = useTheme()

    // To avoid a visible header jump when navigating between screens, we use
    // `useLayoutEffect`, which will apply the settings before the screen renders.
    usePlatformEffect(
        useCallback(() => {
            navigation.setOptions({
                headerShown,
                header: () => (
                    <BlurView intensity={1}>
                        <Header
                            leftComponent={
                                backButtonShown ? (
                                    <BackButton
                                        navigateProps={backNavigateProps}
                                        onBackPressBeforeNavigate={
                                            onBackPressBeforeNavigate
                                        }
                                    />
                                ) : (
                                    leftComponent
                                )
                            }
                            rightComponent={
                                <RightActionButton
                                    onPress={onRightPress}
                                    title={rightActionTitle}
                                />
                            }
                            containerStyle={[
                                containerStyle,
                                {
                                    backgroundColor:
                                        backgroundColor === 'secondary'
                                            ? colors.secondaryBg
                                            : // : 'red',
                                              undefined,
                                },
                            ]}
                            {...props}
                            centerContainerStyle={
                                !!props.centerComponent
                                    ? $headerCenterTitleContainerStyle
                                    : undefined
                            }
                        />
                    </BlurView>
                ),
            })
            // intentionally created API to have user set when they want to update the header via `deps`
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [...deps, navigation]),
    )
}

export const useMainScreenHeader = (
    {
        title,
        rightComponent,
        ...props
    }: HeaderProps & {
        title: string
        rightComponent: ReactElement<{}>
    },
    deps: Parameters<typeof useLayoutEffect>[1] = [],
) => {
    useHeader(
        {
            backButtonShown: false,
            leftComponent: <HeaderTitle>{title}</HeaderTitle>,
            rightComponent: rightComponent,
            leftContainerStyle: styles.headerLeftContainer,
            rightContainerStyle: styles.headerRightContainer,
            ...props,
        },
        deps,
    )
}

export const HeaderTitle: FC<TextProps> = props => (
    <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        h2
        h2Style={{ lineHeight: 40, ...typography.pretendard.semiBold }}
        {...props}
    />
)

export const HeaderCenterTitle: FC<{ icon?: IconProps; title: string }> = ({
    icon,
    title,
}) => {
    return (
        <>
            {icon && (
                <Text style={{ fontFamily: 'Tossface', paddingRight: 8 }}>
                    {icon.name}
                </Text>
            )}
            <TransText style={$headerCenterTitleStyle}>{title}</TransText>
        </>
    )
}

const styles = StyleSheet.create({
    headerLeftContainer: {
        flexGrow: 1,
        paddingLeft: 16,
        paddingRight: 24,
    },
    headerRightContainer: {
        flexBasis: 'auto',
        flexGrow: 0,
        paddingRight: 8,
    },
})

const $headerCenterTitleContainerStyle: ViewStyle = {
    flexGrow: 1,
    flexBasis: 'auto',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
}

const $headerCenterTitleStyle: TextStyle = {
    fontSize: 15,
}
