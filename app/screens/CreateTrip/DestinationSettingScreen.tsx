import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import { ListItemBase, ListItemBaseProps } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen/Screen'
import { useTripStore, useUserStore } from '@/models'
import { Destination, DestinationSnapshotIn } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import { getFlagEmoji } from '@/utils/nation'
import { useResourceQuota } from '@/utils/resourceQuota/useResourceQuota'
import { useHeader } from '@/utils/useHeader'
import { useLingui } from '@lingui/react/macro'
import { ListItem, useTheme } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native'
import { EditScreenBaseProps } from '.'
import { NetworkConnectionRequiringBoundary } from '../Loading/NetworkConnectionRequiringBoundary'

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

export interface DestinationListItemBaseProps extends ListItemBaseProps {
    item: Omit<DestinationSnapshotIn, 'id' | 'description'>
}

export const DestinationListItemBase: FC<DestinationListItemBaseProps> = ({
    item,
    ...props
}) => {
    const {
        theme: { colors },
    } = useTheme()

    return (
        <ListItemBase
            avatarProps={{
                icon: {
                    ...(item.iso2DigitNationCode
                        ? { name: getFlagEmoji(item.iso2DigitNationCode) }
                        : {
                              name: 'location-on',
                              type: 'material',
                              color: colors.contrastText.secondary,
                          }),
                },
            }}
            containerStyle={{ height: 60 }}
            title={item.title}
            subtitle={item.region}
            {...props}
        />
        // <ListItem onPress={onPress} containerStyle={{ height: 60 }}>
        //     <Avatar
        //         icon={
        //             item.iso2DigitNationCode
        //                 ? { name: getFlagEmoji(item.iso2DigitNationCode) }
        //                 : {
        //                       name: 'location-on',
        //                       type: 'material',
        //                       color: colors.contrastText.secondary,
        //                   }
        //         }
        //         // avatarSize={}
        //         // fontSize={20}
        //     />
        //     {/* <Avatar title={flag} avatarSize={35} /> */}
        //     <ListItem.Content>
        //         <ListItem.Title>
        //             <Trans>{item.title}</Trans>
        //         </ListItem.Title>
        //         <ListItem.Subtitle>
        //             {/* <Trans>{`${regionNames.of(item.iso2DigitNationCode.toUpperCase())}ㆍ${item.state}`}</Trans> */}
        //             <Trans>{`${item.region}`}</Trans>
        //         </ListItem.Subtitle>
        //     </ListItem.Content>
        //     {rightContent}
        // </ListItem>
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
        const userStore = useUserStore()
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

        useHeader({
            centerComponent: undefined,
        })

        const { maxDestinations, hasReachedDestinationNumberLimit } =
            useResourceQuota()

        return (
            <NetworkConnectionRequiringBoundary title="여행지 설정">
                <Screen>
                    <ContentTitle title={titleText} subtitle={subtitlteText} />
                    <View style={{ paddingVertical: 16, flex: 1 }}>
                        <TouchableOpacity
                            onPress={handleSearchPress}
                            disabled={hasReachedDestinationNumberLimit}>
                            <Input.SearchBase
                                editable={false}
                                pointerEvents="none"
                                placeholder={
                                    hasReachedDestinationNumberLimit
                                        ? `여행지 개수 제한에 도달했어요 (${tripStore.destinations.length}/${maxDestinations})`
                                        : `도시 또는 국가 검색`
                                }
                                disabled={hasReachedDestinationNumberLimit}
                            />
                        </TouchableOpacity>
                    </View>
                    {tripStore.isDestinationSet && (
                        <View>
                            <ListSubheader
                                title={`여행지 (${tripStore.destinations.length}/${maxDestinations})`}
                            />
                            <FlatList
                                data={tripStore.destinations}
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
            </NetworkConnectionRequiringBoundary>
        )
    },
)

export const TripDestinationSettingScreen: FC = () => {
    return <EditTripDestinationScreenBase isInitialSettingScreen={true} />
}

export const EditTripDestinationScreen: FC = () => {
    return <EditTripDestinationScreenBase isInitialSettingScreen={false} />
}
