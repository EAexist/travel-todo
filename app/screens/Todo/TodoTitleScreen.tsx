import * as Fab from '@/components/Fab'
import {ControlledInput} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {AppStackScreenProps} from '@/navigators'
import {useTodo} from '@/utils/useTodo'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {View} from 'react-native'
import {useSetValueScreen} from '../CreateTrip/useSetValueScreen'

export const TodoTitleScreen: FC<AppStackScreenProps<'TodoTitle'>> = observer(
  ({route}) => {
    const item = useTodo(route)
    const handleNextPress = useCallback(
      async (value: string) => {
        item?.setTitle(value)
      },
      [item],
    )

    const {value, setValue, promiseBeforeNavigate} = useSetValueScreen({
      initialValue: item?.title,
      onConfirm: handleNextPress,
    })

    return (
      <Screen>
        <ContentTitle title={`어떤 할 일을 추가할까요?`} />
        <View>
          <ControlledInput
            value={value}
            setValue={setValue}
            label={`할 일 이름`}
            placeholder={`할 일 이름 입력하기`}
            autoFocus
          />
        </View>
        <Fab.Container>
          <Fab.NextButton
            promiseBeforeNavigate={promiseBeforeNavigate}
            navigateProps={{
              name: 'TodoNote',
              params: {todoId: item?.id},
            }}
          />
        </Fab.Container>
      </Screen>
    )
  },
)
