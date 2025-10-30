import { goBack, navigate, NavigateProps, useNavigate } from '@/navigators'
import { ButtonProps } from '@rneui/themed'
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { LayoutChangeEvent, View, ViewStyle } from 'react-native'
import { Button as ButtonBase } from '../Button'

interface FabHeightContextType {
    height: number
    setHeight: Dispatch<SetStateAction<number>>
}

const FabHeightContext = createContext<FabHeightContextType>(
    {} as FabHeightContextType,
)
export const FabProvider = ({ children }: PropsWithChildren) => {
    const [height, setHeight] = useState(0)
    //   useEffect(() => {
    //     console.log(`[FabHeightContext] height=${height}`)
    //   }, [height])
    return (
        <FabHeightContext.Provider value={{ height, setHeight }}>
            {children}
        </FabHeightContext.Provider>
    )
}
export const useFabHeight = () => useContext(FabHeightContext)

/**
 * Fab.Container
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export const Container: FC<
    PropsWithChildren<{ fixed?: boolean; dense?: boolean }>
> = ({ fixed = true, dense = false, children }) => {
    const { setHeight } = useFabHeight()
    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            setHeight(event.nativeEvent.layout.height)
        },
        [setHeight],
    )
    useEffect(() => {
        if (setHeight)
            return () => {
                setHeight(0)
            }
    }, [setHeight])
    return (
        <View
            onLayout={fixed ? handleLayout : undefined}
            style={$containerStyle(fixed, dense)}>
            {children}
        </View>
    )
}

/**
 * Fab.Button
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export const Button: FC<ButtonProps> = props => (
    <ButtonBase
        // buttonStyle={styles.Button}
        // titleStyle={styles.ButtonTitleStyle}
        {...props}
    />
)
/**
 * Fab.NavigateButtonBase
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export interface NavigateButtonBaseProps extends Omit<ButtonProps, 'onPress'> {
    navigate: () => void
    promiseBeforeNavigate?: () => Promise<any>
}
export const NavigateButtonBase: FC<NavigateButtonBaseProps> = ({
    navigate,
    promiseBeforeNavigate,
    ...props
}) => {
    const handlePress = useCallback(() => {
        if (promiseBeforeNavigate)
            promiseBeforeNavigate().then(() => {
                navigate()
            })
        else navigate()
    }, [navigate, promiseBeforeNavigate])

    return <Button onPress={handlePress} uppercase {...props} />
}

/**
 * Fab.NextButton
 * @param {ButtonProps}
 * @returns {ReactElement}
 */

export type GoBackButtonProps = Omit<NavigateButtonBaseProps, 'navigate'>

export const GoBackButton: FC<GoBackButtonProps> = props => {
    const navigate = () => {
        goBack()
    }

    return (
        <NavigateButtonBase
            title={props?.title || '확인'}
            navigate={navigate}
            {...props}
        />
    )
}

/**
 * Fab.NextButton
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export interface NextButtonProps
    extends Omit<NavigateButtonBaseProps, 'navigate'> {
    doNavigateWithTrip?: boolean
    navigateProps: NavigateProps
}

export const NextButton: FC<NextButtonProps> = ({
    navigateProps,
    doNavigateWithTrip = true,
    ...props
}) => {
    const { navigateWithTrip } = useNavigate()

    const _navigate = doNavigateWithTrip ? navigateWithTrip : navigate

    return (
        <NavigateButtonBase
            title={props?.title || '다음'}
            navigate={() => _navigate(navigateProps.name, navigateProps.params)}
            {...props}
        />
    )
}

const $containerStyle: (fixed: boolean, dense: boolean) => ViewStyle = (
    fixed,
    dense,
) => ({
    // backgroundColor: 'blue',
    gap: 0.75 * 16,
    ...(dense
        ? {
              paddingBottom: 0,
          }
        : {
              paddingBottom: 2 * 16,
          }),
    paddingHorizontal: 1.25 * 16,
    paddingVertical: 1.25 * 16,
    ...(fixed
        ? {
              bottom: 0,
              position: 'absolute',
              width: '100%',
          }
        : {
              // position: 'absolute',
              // width: '100%'
          }),
})
