import {FC, ReactElement, useEffect, useLayoutEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import {
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import {
  Header,
  HeaderProps as RNEHeaderProps,
  Text,
  TextProps,
  useTheme,
} from '@rneui/themed'
import {BackButton, HeaderIcon, RightActionButton} from '@/components/Header'
import {NavigateProps} from '@/navigators'
import {TransText} from '@/components/TransText'
import {Icon} from '@/models/Todo'
import {IconProps} from '@/components/Icon'
import {BlurView} from 'expo-blur'

interface HeaderProps extends RNEHeaderProps {
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
  const usePlatformEffect = Platform.OS === 'web' ? useEffect : useLayoutEffect

  const {
    theme: {colors},
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
                  onBackPressBeforeNavigate={onBackPressBeforeNavigate}
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
              // {backgroundColor: colors.transparent},
            ]}
            {...props}
          />
        </BlurView>
      ),
    })
    // intentionally created API to have user set when they want to update the header via `deps`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, navigation])
}

export const useMainScreenHeader = ({
  title,
  rightComponent,
  ...props
}: HeaderProps & {
  title: string
  rightComponent: ReactElement<{}>
}) => {
  useHeader({
    backButtonShown: false,
    leftComponent: (
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        h2
        h2Style={{lineHeight: 40}}>
        {title}
      </Text>
    ),
    rightComponent: rightComponent,
    leftContainerStyle: styles.headerLeftContainer,
    rightContainerStyle: styles.headerRightContainer,
    ...props,
  })
}

export const HeaderTitle: FC<TextProps> = props => (
  <Text
    ellipsizeMode="tail"
    numberOfLines={1}
    h2
    h2Style={{lineHeight: 40}}
    {...props}
  />
)

export const HeaderCenterTitle: FC<{icon?: IconProps; title: string}> = ({
  icon,
  title,
}) => {
  return (
    <>
      {icon && (
        <Text style={{fontFamily: 'Tossface', paddingRight: 8}}>
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

export const $headerCenterTitleContainerStyle: ViewStyle = {
  flexGrow: 1,
  flexBasis: 'auto',
  justifyContent: 'center',
  flexDirection: 'row',
  alignItems: 'center',
}

const $headerCenterTitleStyle: TextStyle = {
  fontSize: 15,
}
