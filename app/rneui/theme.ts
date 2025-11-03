import { IconNode } from '@rneui/base'
import { createTheme, IconProps } from '@rneui/themed'
import { Icon } from 'lucide-react-native'
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { colors } from 'theme'

type Font = {
    thin?: TextStyle
    extraLight?: TextStyle
    light?: TextStyle
    regular?: TextStyle
    medium?: TextStyle
    semiBold?: TextStyle
    bold?: TextStyle
    extraBold?: TextStyle
    black?: TextStyle
}

export const typography: { pretendard: Font } = {
    pretendard:
        Platform.OS == 'web'
            ? {
                  thin: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 100,
                  },
                  extraLight: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 200,
                  },
                  light: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 300,
                  },
                  regular: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 400,
                  },
                  medium: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 500,
                  },
                  semiBold: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 600,
                  },
                  bold: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 700,
                  },
                  extraBold: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 800,
                  },
                  black: {
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 900,
                  },
              }
            : Platform.OS == 'android'
              ? {
                    thin: {
                        fontFamily: 'Pretendard-Thin',
                        fontWeight: 'normal',
                    },
                    extraLight: {
                        fontFamily: 'Pretendard-ExtraLight',
                        fontWeight: 'normal',
                    },
                    light: {
                        fontFamily: 'Pretendard-Light',
                        fontWeight: 'normal',
                    },
                    regular: {
                        fontFamily: 'Pretendard-Regular',
                        fontWeight: 'normal',
                    },
                    medium: {
                        fontFamily: 'Pretendard-Medium',
                        fontWeight: 'normal',
                    },
                    semiBold: {
                        fontFamily: 'Pretendard-SemiBold',
                        fontWeight: 'normal',
                    },
                    bold: {
                        fontFamily: 'Pretendard-Bold',
                        fontWeight: 'normal',
                    },
                    extraBold: {
                        fontFamily: 'Pretendard-ExtraBold',
                        fontWeight: 'normal',
                    },
                    black: {
                        fontFamily: 'Pretendard-Black',
                        fontWeight: 'normal',
                    },
                }
              : Platform.OS == 'ios'
                ? {
                      thin: {
                          fontFamily: 'Pretendard',
                          fontWeight: 100,
                      },
                      extraLight: {
                          fontFamily: 'Pretendard',
                          fontWeight: 200,
                      },
                      light: {
                          fontFamily: 'Pretendard',
                          fontWeight: 300,
                      },
                      regular: {
                          fontFamily: 'Pretendard',
                          fontWeight: 400,
                      },
                      medium: {
                          fontFamily: 'Pretendard',
                          fontWeight: 500,
                      },
                      semiBold: {
                          fontFamily: 'Pretendard',
                          fontWeight: 600,
                      },
                      bold: {
                          fontFamily: 'Pretendard',
                          fontWeight: 700,
                      },
                      extraBold: {
                          fontFamily: 'Pretendard',
                          fontWeight: 800,
                      },
                      black: {
                          fontFamily: 'Pretendard',
                          fontWeight: 900,
                      },
                  }
                : {
                      thin: {
                          fontFamily: 'Pretendard-Thin',
                      },
                      extraLight: {
                          fontFamily: 'Pretendard-ExtraLight',
                      },
                      light: {
                          fontFamily: 'Pretendard-Light',
                      },
                      regular: {
                          fontFamily: 'Pretendard-Regular',
                      },
                      medium: {
                          fontFamily: 'Pretendard-Medium',
                      },
                      semiBold: {
                          fontFamily: 'Pretendard-SemiBold',
                      },
                      bold: {
                          fontFamily: 'Pretendard-Bold',
                      },
                      extraBold: {
                          fontFamily: 'Pretendard-ExtraBold',
                      },
                      black: {
                          fontFamily: 'Pretendard-Black',
                      },
                  },
}

export const colorTheme = {
    lightColors: {
        // background:
        primary: '#006FFD',
        light0: '#2272EB',
        light1: '#E2EEFF',
        secondary: '#F2F3F5',
        secondaryBg: '#F2F4F6',
        black: '#333D4B',
        active: '#191E28',
        inactive: '#AFB8C1',
        text: {
            primary: '#333D4B',
            secondary: '#6B7684',
        },
        contrastText: {
            primary: 'white',
            secondary: '#4E5968',
        },
        icon: {
            secondary: '#B0B8C1',
        },
        grey0: '#F2F4F6',
        grey1: '#D1D6DB',
        grey2: '#bfbfbf',
        divider: '#F2F4F6',
        transparent: 'transparent',
        palette: [
            // '#9BF6FF',
            '#A0C4FF',
            '#BDB2FF',
            '#FFC6FF',
            '#FFADAD',
            '#FFD6A5',
            '#FDFFB6',
            '#CAFFBF',
        ],
    },
}

export const getPaletteColor = (index: number) =>
    colorTheme.lightColors?.palette[
        index % colorTheme.lightColors?.palette?.length
    ]

export const colorTheme_ = createTheme(colorTheme)

const theme = createTheme({
    ...colorTheme_,
    components: {
        SwitchTab: ({ variant = 'primary', size = 'md' }, { colors }) => ({
            variant: variant,
            disableIndicator: true,
            style: {
                paddingRight: 0,
                paddingLeft: 0,
                backgroundColor:
                    variant === 'primary' ? colors.secondary : colors.white,
                ...(size === 'md'
                    ? {
                          borderRadius: 24,
                          overflow: 'hidden',
                      }
                    : {
                          borderRadius: 48,
                          overflow: 'hidden',
                      }),
            },
        }),
        SwitchTabItem: (
            {
                variant = 'primary',
                size = 'md',
                icon,
                color,
                active,
                titleStyle,
                iconRight,
            },
            { colors },
        ) => ({
            containerStyle: {
                backgroundColor: 'transparent',
                ...(size === 'md'
                    ? {
                          flexShrink: 1,
                          flexGrow: 0,
                          flexBasis: 'auto',
                          padding: 4,
                          paddingVertical: 4,
                      }
                    : {
                          padding: 4,
                          paddingVertical: 4,
                      }),
                flexShrink: 1,
                flexGrow: 0,
                flexBasis: 'auto',
            },
            style: {
                ...(size === 'md'
                    ? {
                          flexShrink: 1,
                          flexGrow: 0,
                          flexBasis: 'auto',
                      }
                    : {}),
                flexShrink: 1,
                flexGrow: 0,
                flexBasis: 'auto',
            },
            // icon: {
            //     // ...(icon as Partial<IconProps>),
            //     color: active ? colors.primary : colors.contrastText.secondary,
            //     size: active ? 28 : 24,
            // },
            buttonStyle: (active: boolean) => ({
                // backgroundColor: active ? colors.white : 'transparent',
                minWidth: 96,
                flexDirection: iconRight ? 'row-reverse' : 'row',
                backgroundColor: active
                    ? variant === 'primary'
                        ? colors.white
                        : color === 'primary'
                          ? colors.secondary
                          : colors.secondary
                    : 'transparent',
                ...(size === 'md'
                    ? {
                          paddingVertical: 0,
                          paddingHorizontal: 8,
                          borderRadius: 24,
                          overflow: 'hidden',
                      }
                    : {
                          paddingVertical: 0,
                          paddingHorizontal: 0,
                          borderRadius: 24,
                          overflow: 'hidden',
                      }),
            }),
            titleStyle: (active: boolean) => ({
                letterSpacing: 0.5,
                paddingHorizontal: 0,
                paddingVertical: 8,
                color: active
                    ? color === 'primary'
                        ? colors.primary
                        : colors.text.primary
                    : colors.text.secondary,
                // paddingHorizontal: 0,
                ...(size === 'md'
                    ? {
                          fontSize: 13,
                          ...(active
                              ? typography.pretendard.medium
                              : typography.pretendard.regular),
                      }
                    : {
                          fontSize: 16,
                          ...(active
                              ? typography.pretendard.medium
                              : typography.pretendard.regular),
                      }),
                // ...(titleStyle as TextStyle),
            }),
            // variant,
            // size,
            // icon,
            // color,
            // active,
            // iconRight,
        }),
        StyledSwitch: (
            { variant = 'default', size = 'md', ...props },
            { colors },
        ) => ({
            style: [
                {
                    backgroundColor: props.isActive
                        ? colors.primary
                        : variant === 'default'
                          ? colors.grey1
                          : colors.white,
                    ...(size === 'md'
                        ? {
                              width: 56,
                              borderRadius: 24,
                              overflow: 'hidden',
                          }
                        : {
                              width: 64,
                              borderRadius: 48,
                              overflow: 'hidden',
                          }),
                },
                props.style,
            ] as StyleProp<ViewStyle>,
            ...props,
        }),
        Switch: (_, { colors }) => ({
            trackColor: {
                false: colors.inactive,
                true: colors.inactive,
            },
            thumbColor: colors.text.secondary,
            style: {
                height: 24,
            },
        }),
        SectionCard: () => ({
            containerStyle: {
                borderWidth: 0,
                boxShadow: 'none',
                borderRadius: 24,
                paddingHorizontal: 0,
                // backgroundColor: 'red',
            },
        }),
        Avatar: (props, { colors }) => ({
            containerStyle: {
                backgroundColor: '#F5F5F7',
                alignItems: 'center',
                justifyContent: 'center',
                ...(props.rounded
                    ? {}
                    : {
                          borderRadius: props.avatarSize === 'xsmall' ? 5 : 10,
                      }),
                ...(props.avatarSize === 'xsmall'
                    ? {
                          width: 24,
                          height: 24,
                      }
                    : props.avatarSize === 'small'
                      ? {
                            width: 32,
                            height: 32,
                        }
                      : props.avatarSize === 'medium'
                        ? {
                              width: 40,
                              height: 40,
                          }
                        : props.avatarSize === 'large'
                          ? {
                                width: 40,
                                height: 40,
                            }
                          : props.avatarSize === 'xlarge'
                            ? {
                                  width: 60,
                                  height: 60,
                              }
                            : props.avatarSize
                              ? {
                                    width: props.avatarSize + 24,
                                    height: props.avatarSize + 24,
                                }
                              : {}),
                // min-width: 32,
                // min-height: 32,
            },
            avatarStyle: {
                alignSelf: 'center',
                ...props.avatarStyle,
                ...(props.avatarSize === 'xsmall'
                    ? {
                          width: 18,
                          height: 18,
                      }
                    : props.avatarSize === 'small'
                      ? {
                            width: 26,
                            height: 26,
                        }
                      : props.avatarSize === 'medium'
                        ? {
                              width: 34,
                              height: 34,
                          }
                        : props.avatarSize === 'large'
                          ? {
                                width: 40,
                                height: 40,
                            }
                          : props.avatarSize === 'xlarge'
                            ? {
                                  width: 52,
                                  height: 52,
                              }
                            : props.avatarSize
                              ? {
                                    width: props.avatarSize + 24,
                                    height: props.avatarSize + 24,
                                }
                              : {}),
            },
            ...(props.icon
                ? {
                      icon: {
                          size:
                              props.icon.type === 'font-awesome-5'
                                  ? props.avatarSize === 'xsmall'
                                      ? 14
                                      : props.avatarSize === 'small'
                                        ? 18
                                        : props.avatarSize === 'medium'
                                          ? 22
                                          : props.avatarSize === 'large'
                                            ? 26
                                            : props.avatarSize === 'xlarge'
                                              ? 30
                                              : props.avatarSize
                                  : props.avatarSize === 'xsmall'
                                    ? 18
                                    : props.avatarSize === 'small'
                                      ? 22
                                      : props.avatarSize === 'medium'
                                        ? 26
                                        : props.avatarSize === 'large'
                                          ? 30
                                          : props.avatarSize === 'xlarge'
                                            ? 34
                                            : props.avatarSize,
                          color: props.icon.color || colors.primary,
                      },
                  }
                : {}),
            // iconStyle: {
            //     // color: props.iconStyle?.color || colors.primary
            //     // ...(props.size === 'medium'
            //     //   ? {
            //     //       width: 20,
            //     //       height: 20,
            //     //     }
            //     //   : props.size === 'xlarge'
            //     //     ? {
            //     //         width: 40,
            //     //         height: 40,
            //     //       }
            //     //     : {
            //     //         // width: 32,
            //     //         // height: 32,
            //     //       }),
            //     // min-width: 32,
            //     // min-height: 32,
            // },
            titleStyle: {
                borderRadius: 10,
                overflow: 'hidden',
                ...(props.size === 'medium'
                    ? {
                          fontSize: 20,
                      }
                    : props.size === 'xlarge'
                      ? {
                            fontSize: 40,
                        }
                      : {
                            // width: 32,
                            // height: 32,
                        }),
                // min-width: 32,
                // min-height: 32,
            },
        }),
        Text: (props, { colors }) => ({
            style: {
                ...typography.pretendard.regular,
                color: props.primary ? colors.primary : colors.text.primary,
                fontSize: 17,
                fontStyle: 'normal',
                lineHeight: 1.5 * 17,
                letterSpacing: 0.15,
                // textDecoration: 'none',
                textTransform: 'none',
                ...(props.disabled ? { opacity: 0.5 } : {}),
            },
            h2Style: {
                ...typography.pretendard.bold,
                fontSize: 21,
                lineHeight: 1.6 * 21,
                letterSpacing: 0,
                textTransform: 'none',
            },
            h3Style: {
                ...typography.pretendard.bold,
                fontSize: 17,
                lineHeight: 1.33 * 21,
                letterSpacing: 0,
                textTransform: 'none',
                color: '#212121',
            },
        }),
        Button: ({ color }, { colors }) => ({
            titleStyle: {
                ...typography.pretendard.semiBold,
                fontSize: 17,
                lineHeight: 1.41 * 17,
                ...(color === 'primary'
                    ? { color: colors.contrastText.primary }
                    : color === 'secondary'
                      ? { color: colors.contrastText.secondary }
                      : {}),
            },
            buttonStyle: {
                borderRadius: 16,
                overflow: 'hidden',
                height: 56,
            },
        }),
        FAB: ({}, { colors }) => ({
            color: colors.primary,
        }),
        Chip: ({ color }, { colors }) => ({
            titleStyle: {
                ...typography.pretendard.semiBold,
                fontSize: 14,
                letterSpacing: 0.16,
                lineHeight: 18,
                color:
                    color === 'primary'
                        ? colors.contrastText.primary
                        : colors.contrastText.secondary,
            },
            containerStyle: {
                borderRadius: 0,
                overflow: 'hidden',
            },
            buttonStyle: {
                backgroundColor:
                    color === 'primary' ? colors.primary : colors.secondary,
                height: 36,
                padding: 4,
                borderRadius: 8,
                overflow: 'hidden',
                // height: 56,
            },
        }),
        Header: (props, { colors }) => ({
            elevated: false,
            containerStyle: {
                backgroundColor: colors.transparent,
                // backgroundColor: 'bisque',
                borderBottomWidth: 0,
                height: 48,
                paddingHorizontal: 8,
            },
            leftContainerStyle: {
                justifyContent: 'center',
                paddingLeft: 4,
            },
            centerContainerStyle: {
                flexGrow: 0,
            },
            rightContainerStyle: {
                // flexDirection: 'row',
                // alignItems: 'stretch',
                // justifyContent: 'flex-end',
                // flex: 1,
                justifyContent: 'center',
                // height: '100%',
                // justifyContent: ''
                // alignItems: '',
                // flexGrow: 0,
                // alignItems: 'center',
            },
        }),
        Icon: (props, { colors }) => ({
            color: colors.primary,
        }),
        SectionHeader: props => ({
            style: {
                paddingTop: 24,
                paddingBottom: 8,
                paddingHorizontal: 20,
            },
            titleStyle: props.lg
                ? {
                      // color: colors.text.primary,
                  }
                : {
                      ...typography.pretendard.medium,
                      fontSize: 17,
                      lineHeight: 1.43 * 17,
                  },
        }),
        ListSubheader: ({ size = 'medium', ...props }, { colors }) => ({
            style: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                height:
                    size === 'xlarge'
                        ? 64
                        : size === 'large'
                          ? 56
                          : props.dense
                            ? 32
                            : 44,
                ...(props.dense
                    ? {
                          paddingHorizontal: 24,
                      }
                    : {
                          paddingVertical: 8,
                          paddingHorizontal: 24,
                      }),
            },
            titleStyle:
                size === 'medium'
                    ? {
                          ...typography.pretendard.medium,
                          fontSize: 13,
                          color: colors.text?.secondary,
                      }
                    : size === 'large'
                      ? {
                            ...typography.pretendard.semiBold,
                            fontSize: 17,
                            lineHeight: 48,
                        }
                      : {
                            ...typography.pretendard.semiBold,
                            fontSize: 19,
                            lineHeight: 48,
                        },
        }),
        Divider: ({ width }, { colors }) =>
            width
                ? {
                      // inset: true,
                      insetType: 'middle',
                      color: colors.text.primary,
                      width: width,
                      style: {
                          opacity: 0.4,
                          marginVertical: 8,
                          marginHorizontal: 16,
                      },
                  }
                : {
                      width: 16,
                      color: colors.divider,
                      style: {
                          height: 28,
                          paddingHorizontal: 20,
                      },
                  },
        Input: ({ primary, size, label }, { colors }) => ({
            containerStyle: {
                paddingHorizontal: 24,
                // height: 92
                // paddingVertical: 14,
                // width: '100%',
                // borderBottomWidth: 1,
                // borderColor: colors.light0,
            },
            inputContainerStyle: {
                // paddingTop: label ? 0 : 12,
                borderBottomWidth: 2,
                borderColor: primary ? colors.primary : colors.grey0,
            },
            // inputContainerStyle: {},
            inputStyle: {
                ...(size === 'small'
                    ? {
                          height: 40,
                          ...typography.pretendard.regular,
                          fontSize: 17,
                          lineHeight: 40,
                      }
                    : {
                          ...typography.pretendard.semiBold,
                          fontSize: 21,
                          lineHeight: 1.6 * 21,
                          // fontWeight: 400,
                          // fontSize: 15,
                          // lineHeight: 1.6 * 15,}
                      }),
                color: colors.text.primary,
                outlineStyle: undefined,
            },
            labelStyle: {
                ...typography.pretendard.medium,
                fontSize: 12,
                lineHeight: 1 * 12,
                letterSpacing: 0.01,
                color: primary ? colors.light0 : colors.text.secondary,
            },
            // cursorColor: colors.primary,
            // selectionColor: colors.primary,
            // placeholderTextColor: colors.text.primary,
            // leftIconContainerStyle: {
            //   paddingRight: 8,
            // },
        }),
        ListItemInput: ({ primary }, { colors }) => ({
            containerStyle: {},
            inputContainerStyle: {
                // paddingTop: label ? 0 : 12,
                borderBottomWidth: 2,
                borderColor: primary ? colors.primary : colors.grey0,
            },
            inputStyle: {
                width: '100%',
                textAlign: 'left',
                ...typography.pretendard.semiBold,
                fontSize: 21,
                lineHeight: 1.6 * 22,
                color: colors.text.primary,
                outlineStyle: undefined,
            },
            labelStyle: {
                ...typography.pretendard.medium,
                fontSize: 12,
                lineHeight: 1 * 12,
                letterSpacing: 0.01,
                color: primary ? colors.light0 : colors.text.secondary,
            },
        }),
        ListItem: (props, { colors }) => ({
            style: {
                ...(props.useDisabledStyle ? { opacity: 0.5 } : {}),
            },
            containerStyle: {
                height: props.dense === false ? 64 : 52,
                borderRadius: 16,
                overflow: 'hidden',
                alignItems: 'center',
                paddingHorizontal: 24, // 1.5rem
                paddingVertical: 24, // ListItem has default vertical padding, overriding here
                ...(props.backgroundColor === 'secondary'
                    ? { backgroundColor: colors.secondaryBg }
                    : {}),
                ...(props.asCard
                    ? {
                          marginHorizontal: 15,
                          marginTop: 15,
                          height: 82,
                          borderRadius: 24,
                          overflow: 'hidden',
                      }
                    : {}),
            },
        }),
        ListItemTitle: ({ ...props }, { colors }) => ({
            style: {
                display: 'flex',
                ...typography.pretendard.medium,
                fontSize: 17,
                lineHeight: 1.43 * 17,
                overflow: 'hidden',
                ...(props.primary
                    ? { color: colors.primary }
                    : { color: colors.text.primary }),
            },
            numberOfLines: 1,
            ellipsizeMode: 'tail',
        }),
        ListItemSubtitle: ({ style }, { colors }) => ({
            style: {
                ...typography.pretendard.regular,
                color: colors.text.secondary,
                fontSize: 12,
                letterSpacing: 0.17,
                lineHeight: 1 * 12,
                textOverflow: 'ellipsis',
            },
            numberOfLines: 1,
            ellipsizeMode: 'tail',
        }),
        ListItemChevron: ({ primary }, { colors }) => ({
            size: 28,
            color: primary ? colors.primary : colors.text.secondary,
        }),
        ListItemCheckBox: (props, { colors }) => ({
            containerStyle: {
                width: 32,
                alignItems: 'center',
                backgroundColor: 'transparent',
            },
            iconType: 'material',
            checkedIcon: 'check-circle',
            uncheckedIcon: 'radio-button-unchecked',
            // ...props,
        }),
        Tab: ({ indicatorStyle }, { colors }) => ({
            style: {
                paddingHorizontal: 16,
            },
            indicatorStyle: [
                {
                    backgroundColor: colors.text.primary,
                },
                indicatorStyle,
            ],
        }),
        TabItem: (_, { colors }) => ({
            containerStyle: {
                backgroundColor: colors.white,
                paddingVertical: 8,
            },
            titleStyle: (active: boolean) => ({
                fontSize: 17,
                paddingHorizontal: 0,
                ...(active
                    ? typography.pretendard.semiBold
                    : typography.pretendard.regular),
                color: active ? colors.text.primary : colors.text.secondary,
            }),
        }),
        // FAB: {
        //   containerStyle: {
        //     backgroundColor: '#ffffff',
        //     width: '100%',
        //   },
        //   style: {
        //     backgroundColor: '#006ffd',
        //     borderRadius: 1 * 16,
        //     paddingHorizontal: 1.375 * 16,
        //     paddingVertical: 1 * 16,
        //     width: '100%',
        //   },
        //   titleStyle: {
        //     color: '#ffffff',
        //     fontSize: 17,
        //     lineHeight: 1.5 * 16,
        //     textAlign: 'left',
        //   },
        // },
    },
})

export default theme
