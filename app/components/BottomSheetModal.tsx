import { isMobile } from '@/utils/platform'
import {
    BottomSheetBackdropProps,
    BottomSheetModalProps,
    BottomSheetView,
    BottomSheetBackdrop as GorhomBottomSheetBackdrop,
    BottomSheetModal as GorhomBottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useTheme } from '@rneui/themed'
import {
    PropsWithChildren,
    Ref
} from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView as RNGestureHandlerRootView } from 'react-native-gesture-handler'
import { GestureHandlerRootViewProps } from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView'

export const GestureHandlerRootViewWrapper = (
    props: GestureHandlerRootViewProps,
) => {
    const {
        theme: { colors },
    } = useTheme()
    return (
        <RNGestureHandlerRootView
            style={{
                ...styles.gestureHandlerRootView,
                // backgroundColor: colors.transparent,
                // backgroundColor: 'red',
            }}
            {...props}
        />
    )
}

const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => (
    <GorhomBottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        {...props}
    />
)

export type BottomSheetModal = GorhomBottomSheetModal

export const BottomSheetModal = ({
    children,
    ref,
    ...props
}: PropsWithChildren<
    BottomSheetModalProps & { ref: Ref<BottomSheetModal> }
>) => {
    return (
        <GorhomBottomSheetModal
            ref={ref}
            containerStyle={styles.containerStyle}
            style={styles.style}
            backgroundStyle={styles.backgroundStyle}
            backdropComponent={BottomSheetBackdrop}
            onChange={index => {
                console.log(`BottomSheetModal Change ${index}`)
            }}
            detached={true}
            bottomInset={12}
            enableDynamicSizing={true}
            enablePanDownToClose={true}
            //   index={-1}
            {...props}
        // snapPoints={snapPoints}
        >
            <BottomSheetView style={styles.contentContainerStyle}>
                {children}
            </BottomSheetView>
        </GorhomBottomSheetModal>
    )
}

BottomSheetModal.displayName = 'BottomSheetModal'

const styles = StyleSheet.create({
    gestureHandlerRootView: {
        ...(isMobile
            ? {
                flex: 1,
            }
            : {
                height: 852,
                width: 383,
                alignSelf: 'center',
            }),
    },
    containerStyle: {},
    style: {
        marginHorizontal: 10,
    },
    backgroundStyle: {
        borderRadius: 24,
    },
    contentContainerStyle: {
        paddingBottom: 24,
        // flex: 1,
    },
})

export default BottomSheetModal
