import * as Fab from '@/components/Fab'
import { ControlledInput } from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import { Screen } from '@/components/Screen/Screen'
import { useTripStore } from '@/models'
import { FC, useCallback } from 'react'
import { View } from 'react-native'
import { EditScreenBaseProps } from '.'
import { useSetValueScreen } from './useSetValueScreen'

const TripTitleEditScreenBase: FC<EditScreenBaseProps> = ({
    isInitialSettingScreen,
}) => {
    const tripStore = useTripStore()

    const handleNextPress = useCallback(async (value: string) => {
        tripStore.setProp('title', value)
        tripStore.patch({
            id: tripStore.id,
            title: tripStore.title,
        })
    }, [])

    const { value, setValue, promiseBeforeNavigate } = useSetValueScreen({
        initialValue: tripStore.title
            ? tripStore.title
            : tripStore.isDestinationSet
              ? `${tripStore.destinations.map(dest => dest.title).join(', ')} 여행`
              : '수고한 나를 위한 여행',
        onConfirm: handleNextPress,
    })

    return (
        <Screen>
            <ContentTitle title={`여행의 이름을 정해주세요`} />
            <View>
                <ControlledInput
                    value={value}
                    onChangeText={setValue}
                    label={`여행 이름`}
                    placeholder={`여행 이름`}
                    autoFocus
                />
            </View>
            <Fab.Container>
                {isInitialSettingScreen ? (
                    <Fab.NextButton
                        promiseBeforeNavigate={promiseBeforeNavigate}
                        navigateProps={{
                            name: 'TodolistSetting',
                        }}
                    />
                ) : (
                    <Fab.GoBackButton
                        promiseBeforeNavigate={promiseBeforeNavigate}
                    />
                )}
            </Fab.Container>
        </Screen>
    )
}

export const TripTitleSettingScreen: FC = () => {
    return <TripTitleEditScreenBase isInitialSettingScreen={true} />
}

export const EditTripTitleScreen: FC = () => {
    return <TripTitleEditScreenBase isInitialSettingScreen={false} />
}
