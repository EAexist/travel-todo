import BottomSheet, {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
} from '@gorhom/bottom-sheet'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from '@rneui/themed'
import {
  PropsWithChildren,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { StyleSheet, Platform } from 'react-native'
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

export const useNavigationBottomSheet = (
  ref: RefObject<BottomSheetModal | null>,
  promiseBeforeNavigate?: () => Promise<any>,
) => {
  //   const ref = useRef<BottomSheetMethods>(null)
  const [activeCandidateKey, setActiveCandidateKey] = useState<
    string | undefined
  >(undefined)
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    setActiveKey(undefined)
  }, [])

  const handleBottomSheetModalChange = useCallback(
    (index: number) => {
      console.log(`[onChange] ${index} ${activeCandidateKey}`)
      if (index < 0 && activeCandidateKey) {
        console.log(`[onChange] setActiveKey`)
        setActiveKey(activeCandidateKey)
      } else {
        setActiveCandidateKey(undefined)
      }
    },
    [activeCandidateKey, setActiveCandidateKey],
  )
  const activate = useCallback((path: string) => {
    ref?.current?.forceClose()
    setActiveCandidateKey(path)
  }, [])

  const useActiveKey = (callback: (activeKey: string) => void) =>
    useFocusEffect(
      useCallback(() => {
        console.log(`activeKey=${activeKey}`)
        if (activeKey) {
          const temp = activeKey
          setActiveKey(undefined)
          callback(temp)
        }
      }, [activeKey]),
    )

  return {
    useActiveKey,
    activate,
    handleBottomSheetModalChange,
  }
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
    flex: 1,
    ...(Platform.OS === 'web' ? { maxWidth: 480 } : {}),
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
