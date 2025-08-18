import {useTheme} from '@rneui/themed'
import {FC} from 'react'
import {
  ActivityIndicatorProps,
  ActivityIndicator as RNActivityIndicator,
} from 'react-native'

export const ActivityIndicator: FC<ActivityIndicatorProps> = ({...props}) => {
  const {
    theme: {
      colors: {primary: primaryColor},
    },
  } = useTheme()

  return <RNActivityIndicator {...props} color={primaryColor} size={'large'} />
}
