import {ButtonProps, Dialog, Icon, useTheme} from '@rneui/themed'
import {FC, useCallback, useState} from 'react'
import {StyleSheet, TouchableOpacity, TouchableOpacityProps} from 'react-native'
import {Button} from '../Button'
import {goBack, NavigateProps, useNavigate} from '@/navigators'
import {DialogProps, IconProps} from '@rneui/base'
import {ViewStyle} from 'react-native'

export const BackButton: FC<
  TouchableOpacityProps & {
    onBackPressBeforeNavigate?: () => Promise<any>
    navigateProps?: NavigateProps
  }
> = ({onBackPressBeforeNavigate, navigateProps}) => {
  const {navigateWithTrip} = useNavigate()
  const _navigate = navigateProps
    ? () =>
        navigateWithTrip(
          navigateProps.name,
          navigateProps.params,
          undefined,
          navigateProps.ignoreTrip,
        )
    : goBack
  const handlePress = useCallback(() => {
    console.log(
      `[BackButton.handlePress()] navigateProps=${JSON.stringify(navigateProps)}`,
    )
    if (onBackPressBeforeNavigate) {
      console.log(
        `[BackButton] calling onBackPressBeforeNavigate=${onBackPressBeforeNavigate}`,
      )
      onBackPressBeforeNavigate().then(() => {
        _navigate()
      })
    } else _navigate()
  }, [onBackPressBeforeNavigate, _navigate, navigateProps])

  return (
    <TouchableOpacity style={styles.BackButton} onPress={handlePress}>
      <Icon
        name="arrow-back-ios"
        type="material"
        color="rgba(0, 0, 0, 0.56)"
        size={20}
      />
    </TouchableOpacity>
  )
}
export const RightActionButton: FC<ButtonProps> = props => {
  const {theme} = useTheme()
  return (
    <Button
      {...props}
      buttonStyle={{
        backgroundColor: theme.colors.transparent,
        ...styles.RightActionButton,
      }}
      titleStyle={{
        color: theme.colors.text.primary,
      }}
    />
  )
}

export const ConfirmBackDialog: FC<DialogProps> = props => {
  const [visible, setVisible] = useState(false)
  const toggleDialog = () => {
    setVisible(!visible)
  }
  return (
    <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
      <Dialog.Title title="Confirm?1" />
      <Dialog.Actions>
        {/* <Dialog.Button
          title="CONFIRM"
          onPress={() => {
            console.log(`Option ${checked} was selected!`)
            toggleDialog5()
          }}
        />
        <Dialog.Button title="CANCEL" onPress={toggleDialog5} /> */}
      </Dialog.Actions>
    </Dialog>
  )
}

export const HeaderIcon = (props: IconProps) => {
  return <Icon color="#333d4b" size={24} {...props} />
}

export const $headerRightButtonStyle: ViewStyle = {
  alignItems: 'center',
  borderRadius: 100, // 6.25rem converted to 100 for full circle
  justifyContent: 'center',
  padding: 8, // 0.5rem converted to px,
}

const styles = StyleSheet.create({
  BackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    // borderRadius: 100,
  },
  // CompleteButtonText: {
  //   fontSize: 15,
  //   letterSpacing: 0.46,
  //   lineHeight: 26,
  //   textAlign: 'left',
  // },
  RightActionButton: {
    paddingHorizontal: 12,
  },
})
