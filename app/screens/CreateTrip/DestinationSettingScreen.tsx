import { Avatar } from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import { useTripStore } from '@/models'
import { Destination, DestinationSnapshotIn } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import { getFlagEmoji } from '@/utils/nation'
import { Trans, useLingui } from '@lingui/react/macro'
import { ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native'
import { EditScreenBaseProps } from '.'
import { useRequireConnection } from '../Loading'

/* @TODO Import of getFlagEmoji fires
 * ERROR  TypeError: Cannot read property 'prototype' of undefined, js engine: hermes [Component Stack]
 * ERROR  Warning: TypeError: Cannot read property 'getFlagEmoji' of undefined
 */
// const getFlagEmoji = (countryCode: string) => {
//   if (!/^[A-Za-z]{2}$/.test(countryCode)) {
//     return '🏳️' // Return white flag for invalid codes.
//   }
//   const codePoints = countryCode
//     .toUpperCase()
//     .split('')
//     .map(char => 127397 + char.charCodeAt(0))
//   return String.fromCodePoint(0x1f44d)
//   return String.fromCodePoint(...codePoints) // Return white flag for invalid codes.
// }

export interface DestinationListItemBaseProps {
    item: Omit<DestinationSnapshotIn, 'id' | 'description'>
    rightContent?: ReactNode
    onPress?: () => void
}

export const DestinationListItemBase: FC<DestinationListItemBaseProps> = ({
    item,
    rightContent,
    onPress,
}) => {
    //   const [flag, setFlag] = useState<string>()
    //   useEffect(() => {
    //     console.log(getFlagEmoji(item.countryIso))
    //     setFlag(getFlagEmoji(item.countryIso))
    //   }, [getFlagEmoji, item.countryIso])

    return (
        <ListItem onPress={onPress} containerStyle={{ height: 60 }}>
            <Avatar
                icon={{ name: getFlagEmoji(item.countryIso) }}
                avatarSize={35}
                fontSize={20}
            />
            {/* <Avatar title={flag} avatarSize={35} /> */}
            <ListItem.Content>
                <ListItem.Title>
                    <Trans>{item.title}</Trans>
                </ListItem.Title>
                <ListItem.Subtitle>
                    {/* <Trans>{`${regionNames.of(item.countryIso.toUpperCase())}ㆍ${item.state}`}</Trans> */}
                    <Trans>{`${item.region}`}</Trans>
                </ListItem.Subtitle>
            </ListItem.Content>
            {rightContent}
        </ListItem>
    )
}

interface DestinationListItemProps {
    destination: Destination
}

const DestinationListItem: FC<DestinationListItemProps> = ({ destination }) => {
    const tripStore = useTripStore()
    const handleClosePress = useCallback(() => {
        tripStore.deleteDestination(destination)
    }, [])
    return (
        <DestinationListItemBase
            key={destination.id}
            item={destination}
            rightContent={
                <ListItem.Chevron
                    onPress={handleClosePress}
                    iconProps={{ name: 'close' }}
                />
            }
        />
    )
}
export const EditTripDestinationScreenBase: FC<EditScreenBaseProps> = observer(
    ({ isInitialSettingScreen }) => {
        const tripStore = useTripStore()
        const { t } = useLingui()

        const renderDestinationListItem: ListRenderItem<Destination> =
            useCallback(
                ({ item }) => (
                    <DestinationListItem key={item.id} destination={item} />
                ),
                [],
            )

        const { navigateWithTrip } = useNavigate()

        const handleSearchPress = useCallback(() => {
            navigateWithTrip('DestinationSearch')
        }, [])
        //   const handleNextPress = useCallback(async () => {
        //     tripStore.patch()
        //   }, [])

        const { titleText, subtitlteText } = tripStore.isDestinationSet
            ? {
                  titleText: `다른 도시도 여행할 예정인가요?`,
                  subtitlteText: `여행 중 여행할 도시를 모두 추가해주세요.`,
              }
            : {
                  titleText: `어디로 떠나시나요?`,
                  subtitlteText: `여행 중 여행할 도시를 모두 추가해주세요.`,
              }

        //   const handleBackPressBeforeNavigate = useCallback(async () => {}, [])

        // useHeader({
        //   // backButtonShown: false,
        //   // backNavigateProps: {name: 'Login', ignoreTrip: true},
        //   // onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
        // })

        // const {isConnected} = useNetInfo()
        const showScreen = useRequireConnection({ title: '여행지 설정' })

        return (
            showScreen && (
                <Screen>
                    <ContentTitle title={titleText} subtitle={subtitlteText} />
                    <View style={{ paddingVertical: 16, flex: 1 }}>
                        <TouchableOpacity onPress={handleSearchPress}>
                            <Input.SearchBase
                                placeholder={t`도시 또는 국가 검색`}
                            />
                        </TouchableOpacity>
                    </View>
                    {tripStore.isDestinationSet && (
                        <View>
                            <ListSubheader
                                title={`선택한 여행지 (${tripStore.destination.length})`}
                            />
                            <FlatList
                                data={tripStore.destination}
                                renderItem={renderDestinationListItem}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    )}
                    <Fab.Container>
                        {isInitialSettingScreen ? (
                            <Fab.NextButton
                                title={
                                    tripStore.isDestinationSet
                                        ? '다음'
                                        : '건너뛰기'
                                }
                                navigateProps={{
                                    name: 'ScheduleSetting',
                                }}
                            />
                        ) : (
                            <Fab.GoBackButton />
                        )}
                    </Fab.Container>
                </Screen>
            )
        )
    },
)

export const TripDestinationSettingScreen: FC = () => {
    return <EditTripDestinationScreenBase isInitialSettingScreen={true} />
}

export const EditTripDestinationScreen: FC = () => {
    return <EditTripDestinationScreenBase isInitialSettingScreen={false} />
}
