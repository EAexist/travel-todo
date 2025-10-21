import { StyledSwitchprops, useTheme, withTheme } from '@rneui/themed'
import { FC } from 'react'
import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { Icon } from './Icon'

const StyledSwitch: FC<StyledSwitchprops> = ({
    isActive,
    onChange,
    variant,
    children,
    style,
    iconProps,
    ...props
}) => {
    // const [isActive, setIsActive] = useState(false)

    const {
        theme: { colors },
    } = useTheme()
    return (
        <Pressable
            {...props}
            onPress={onChange}
            style={[
                style as StyleProp<ViewStyle>,
                {
                    padding: 4,
                    alignItems: isActive ? 'flex-end' : 'flex-start',
                },
            ]}>
            <Icon
                {...iconProps[isActive ? 'true' : 'false']}
                {...(isActive
                    ? {
                          ...iconProps['true'],
                      }
                    : {
                          color: colors.text.secondary,
                          ...iconProps['false'],
                      })}
                containerStyle={{
                    width: 24,
                    height: 24,
                    justifyContent: 'center',
                    borderRadius: '100%',

                    /* Elevation */
                    elevation: 3, // Standard Material Design elevation level (can be 1 to 10+)

                    // 3. iOS Shadow Properties (Simulates elevation)
                    shadowColor: '#000', // Black shadow color
                    shadowOffset: {
                        // Slight downward offset for a "lifted" look
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25, // Transparency of the shadow
                    shadowRadius: 3.84, // Blur radius of the shadow
                    backgroundColor: colors.white,
                }}
            />
        </Pressable>
    )
}
export default withTheme<StyledSwitchprops>(StyledSwitch, 'StyledSwitch')
