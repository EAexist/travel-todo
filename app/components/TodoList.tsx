import ListSubheader from '@/components/ListItem/ListSubheader'
import { useTripStore } from '@/models'
import { Todo } from '@/models/Todo'
import { typography } from '@/rneui/theme'
import { Divider, ListItem, Text, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback } from 'react'
import {
    DefaultSectionT,
    ScrollView,
    SectionList,
    SectionListData,
    SectionListRenderItem,
    View,
} from 'react-native'

interface TodoListProps {
    sections: SectionListData<Todo, DefaultSectionT>[]
    renderItem: (todo: Todo) => ReactNode
}
export const TodoList: FC<TodoListProps> = observer(
    ({ sections, renderItem }) => {
        const {
            theme: { colors },
        } = useTheme()

        const renderItem_: SectionListRenderItem<
            //   Partial<ReservationSnapshot>,
            Todo,
            DefaultSectionT
        > = ({ item }) => (
            <Observer render={() => <View>{renderItem(item)}</View>} />
        )
        const renderSectionHeader = useCallback(
            ({ section: { title, data } }: { section: DefaultSectionT }) => (
                <>
                    <ListSubheader title={title} />
                    {data.length == 0 && (
                        <ListItem>
                            <ListItem.Title
                                style={{
                                    color: colors.text.secondary,
                                    ...typography.pretendard.light,
                                }}>
                                남은 할 일 없음
                            </ListItem.Title>
                        </ListItem>
                    )}
                </>
            ),
            [],
        )

        return (
            <ScrollView>
                <SectionList
                    sections={sections.map((section, index) => ({
                        ...section,
                        isLast: index === sections.length - 1,
                    }))}
                    keyExtractor={item => item.id}
                    renderItem={renderItem_}
                    renderSectionHeader={renderSectionHeader}
                    renderSectionFooter={({ section: { isLast } }) => {
                        return !isLast ? <Divider /> : null
                    }}
                />
            </ScrollView>
        )
    },
)
