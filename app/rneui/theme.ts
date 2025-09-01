import {createTheme} from '@rneui/themed'
import {Platform, TextStyle} from 'react-native'

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

export const typography: {pretendard: Font} = {
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

const colorTheme = createTheme({
  lightColors: {
    // background:
    primary: '#006FFD',
    light0: '#2272EB',
    light1: '#E2EEFF',
    secondary: '#F2F3F5',
    secondaryBg: '#F6F4F2',
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
    grey0: '#F2F4F6',
    grey1: '#D1D6DB',
    divider: '#F2F4F6',
    transparent: 'transparent',
  },
})

const theme = createTheme({
  ...colorTheme,
  components: {
    SectionCard: () => ({
      containerStyle: {
        borderWidth: 0,
        boxShadow: 'none',
        borderRadius: 16,
        paddingHorizontal: 0,
      },
    }),
    Avatar: (props, {colors}) => ({
      containerStyle: {
        backgroundColor: '#F5F5F7',
        alignItems: 'center',
        justifyContent: 'center',
        ...(props.rounded
          ? {}
          : {
              borderRadius: 10,
            }),
        ...(props.size === 'small'
          ? {
              width: 32,
              height: 32,
            }
          : props.size === 'medium'
            ? {
                width: 40,
                height: 40,
              }
            : props.size === 'large'
              ? {
                  width: 40,
                  height: 40,
                }
              : props.size === 'xlarge'
                ? {
                    width: 60,
                    height: 60,
                  }
                : {
                    width: 32,
                    height: 32,
                  }),
        // min-width: 32,
        // min-height: 32,
      },
      ...(props.icon
        ? {
            icon: {
              color: colors.primary,
              size:
                props.size === 'small'
                  ? 24
                  : props.size === 'medium'
                    ? 30
                    : props.size === 'large'
                      ? 36
                      : props.size === 'xlarge'
                        ? 40
                        : 44,
            },
          }
        : {}),
      iconStyle: {
        // ...(props.size === 'medium'
        //   ? {
        //       width: 20,
        //       height: 20,
        //     }
        //   : props.size === 'xlarge'
        //     ? {
        //         width: 40,
        //         height: 40,
        //       }
        //     : {
        //         // width: 32,
        //         // height: 32,
        //       }),
        // min-width: 32,
        // min-height: 32,
      },
      titleStyle: {
        borderRadius: 10,
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
    Text: (props, {colors}) => ({
      style: {
        ...typography.pretendard.regular,
        color: props.primary ? colors.primary : colors.text.primary,
        fontSize: 17,
        fontStyle: 'normal',
        lineHeight: 1.5 * 17,
        letterSpacing: 0.15,
        // textDecoration: 'none',
        textTransform: 'none',
        ...(props.disabled ? {opacity: 0.5} : {}),
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
    Button: ({color}, {colors}) => ({
      titleStyle: {
        ...typography.pretendard.semiBold,
        fontSize: 17,
        lineHeight: 1.41 * 17,
        ...(color === 'primary'
          ? {color: colors.contrastText.primary}
          : color === 'secondary'
            ? {color: colors.contrastText.secondary}
            : {}),
      },
      buttonStyle: {
        borderRadius: 16,
        height: 56,
      },
    }),
    Chip: (props, {colors}) => ({
      titleStyle: {
        ...typography.pretendard.semiBold,
        color: colors.contrastText.secondary,
        fontSize: 14,
        letterSpacing: 0.16,
        lineHeight: 18,
      },
      containerStyle: {
        borderRadius: 0,
      },
      buttonStyle: {
        backgroundColor: colors.secondary,
        height: 36,
        padding: 4,
        borderRadius: 8,
        // height: 56,
      },
    }),
    Header: (props, {colors}) => ({
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
    Icon: (props, {colors}) => ({
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
    ListSubheader: (props, {colors}) => ({
      style: {
        height: props.lg ? 64 : 44,
        paddingVertical: 8,
        paddingHorizontal: 20,
      },
      titleStyle: props.lg
        ? {
            ...typography.pretendard.semiBold,
            fontSize: 19,
            lineHeight: 48,
            letterSpacing: 0.01,
            // color: var(-text--secondary),
          }
        : {
            ...typography.pretendard.medium,
            fontSize: 13,
            letterSpacing: 0.1,
            color: colors.text?.secondary,
          },
    }),
    Divider: ({inset}, {colors}) =>
      inset
        ? {
            insetType: 'middle',
            color: colors.black,
            width: 1,
            style: {
              opacity: 0.5,
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
    Input: ({primary, label}, {colors}) => ({
      containerStyle: {
        paddingHorizontal: 20,
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
        ...typography.pretendard.semiBold,
        fontSize: 21,
        lineHeight: 1.6 * 22,
        color: colors.text.primary,
        outlineStyle: undefined,
        // fontWeight: 400,
        // fontSize: 15,
        // lineHeight: 1.6 * 15,
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
    ListItemInput: ({primary}, {colors}) => ({
      containerStyle: {
        // paddingHorizontal: 20,
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
        flexDirection: 'column',
        alignItems: 'stretch',
      },
      // inputContainerStyle: {},
      inputStyle: {
        ...typography.pretendard.semiBold,
        fontSize: 21,
        lineHeight: 1.6 * 22,
        color: colors.text.primary,
        outlineStyle: undefined,
        textAlign: 'left',
      },
      labelStyle: {
        ...typography.pretendard.medium,
        fontSize: 12,
        lineHeight: 1 * 12,
        letterSpacing: 0.01,
        color: primary ? colors.light0 : colors.text.secondary,
      },
    }),
    ListItem: props => ({
      style: {
        ...(props.useDisabledStyle ? {opacity: 0.5} : {}),
      },
      containerStyle: {
        // backgroundColor: colorTheme.lightColors?.disabled,
        height: 52,
        borderRadius: 16,
        paddingHorizontal: 20, // 1.5rem
        paddingVertical: 0, // ListItem has default vertical padding, overriding here
        // flexDirection: 'row',
        // gap: 12,
        alignItems: 'center',
      },
    }),
    ListItemTitle: (props, {colors}) => ({
      style: {
        display: 'flex',
        ...typography.pretendard.medium,
        fontSize: 17,
        lineHeight: 1.43 * 17,
        overflow: 'hidden',
        ...(props.primary ? {color: colors.primary} : {}),
      },
      numberOfLines: 1,
      ellipsizeMode: 'tail',
    }),
    ListItemSubtitle: (_, {colors}) => ({
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
    ListItemChevron: ({primary}, {colors}) => ({
      size: 32,
      color: primary ? colors.primary : colors.text.secondary,
    }),
    ListItemCheckBox: (_, {colors}) => ({
      containerStyle: {
        width: 32,
        alignItems: 'center',
      },
    }),
    TabItem: (_, {colors}) => ({
      containerStyle: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        width: '33.33%',
      },
      titleStyle: (active: boolean) => ({
        color: active ? colors.text.primary : colors.text.secondary,

        fontSize: 17,
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
