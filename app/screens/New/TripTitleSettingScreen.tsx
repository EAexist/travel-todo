import {useStores, useTripStore} from '@/models'
import {FC, useCallback} from 'react'
import {TitleSettingScreenBase} from './TitleSettingScreenBase'

export const TripTitleSettingScreen: FC = () => {
  const tripStore = useTripStore()

  const handleNextPress = useCallback(async (value: string) => {
    tripStore.setProp('title', value)
    // await tripStore.patch()
  }, [])

  return (
    <TitleSettingScreenBase
      inputProps={{
        label: `여행 이름`,
        placeholder: `여행 이름`,
        autoFocus: true,
      }}
      title={`여행의 이름을 정해주세요`}
      onConfirm={handleNextPress}
      nextButtonProps={{
        navigateProps: {
          name: 'TodolistSetting',
        },
      }}
      initialValue={
        tripStore.isDestinationSet
          ? `${tripStore.destination.map(dest => dest.title).join(', ')} 여행`
          : '수고한 나를 위한 여행'
      }
    />
  )
}
