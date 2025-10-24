import ListSubheader from '@/components/ListItem/ListSubheader'
import { useTripStore } from '@/models'
import { isCategoryTodo, Todo } from '@/models/Todo'
import { ListItem, TabView, Text, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback, useState } from 'react'
import {
    DefaultSectionT,
    SectionList,
    SectionListData,
    SectionListRenderItem,
    View,
} from 'react-native'
import { Label } from './Label'
import SwitchTab, { SwitchTabItem } from './SwitchTab'

interface TodoListProps {
    sections: SectionListData<Todo, DefaultSectionT>[]
    renderItem: (todo: Todo) => ReactNode
}
export const TodoList: FC<TodoListProps> = observer(
    ({ sections, renderItem }) => {
        const tripStore = useTripStore()

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
            ({
                section: { title, data, category },
            }: {
                section: DefaultSectionT
            }) => (
                <>
                    {
                        // category === 'TODO' ? (
                        //     <ListSubheader
                        //         title={'할 일'}
                        //         size="xlarge"
                        //         rightContent={
                        //             <Text>{tripStore.numbefOfTodoText}</Text>
                        //         }
                        //     />
                        // ) : category === 'GOODS' ? (
                        //     <ListSubheader
                        //         lg
                        //         title={'짐'}
                        //         size="xlarge"
                        //         rightContent={
                        //             <Text>{tripStore.numbefOfGoodsText}</Text>
                        //         }
                        //     />
                        // ) :
                        data.length > 0 && <ListSubheader title={title} />
                    }
                    {/* {data.length == 0 && (
                        <ListItem>
                            <ListItem.Title
                                style={{
                                    color: colors.text.secondary,
                                    ...typography.pretendard.light,
                                }}>
                                남은 할 일 없음
                            </ListItem.Title>
                        </ListItem>
                    )} */}
                </>
            ),
            [],
        )

        const [activeTabIndex, setActiveTabIndex] = useState(0)
        const handleTabChange = useCallback(
            (newIndex: number) => {
                setActiveTabIndex(newIndex)
            },
            [setActiveTabIndex],
        )

        const todoSections = sections.filter(({ category }) =>
            isCategoryTodo(category),
        )

        const goodsSections = sections.filter(
            ({ category }) => !isCategoryTodo(category),
        )
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    <SwitchTab
                        value={activeTabIndex}
                        onChange={e => setActiveTabIndex(e)}>
                        <SwitchTabItem title="할 일" />
                        <SwitchTabItem title="짐 챙기기" />
                    </SwitchTab>
                </View>
                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                        paddingVertical: 16,
                    }}>
                    <Label
                        title="완료한 할일 숨기기"
                        style={{
                            fontSize: 13,
                        }}
                        dense
                        rightContent={
                            <ListItem.CheckBox
                                checked={tripStore.settings.doHideCompletedTodo}
                                onPress={tripStore.toggleDoHideCompletedTodo}
                                containerStyle={{ width: 'auto', marginTop: 1 }}
                                checkedColor={colors.contrastText.secondary}
                                size={20}
                            />
                        }
                    />
                </View>
                <TabView
                    value={activeTabIndex}
                    onChange={handleTabChange}
                    containerStyle={{ overflow: 'hidden' }}>
                    <TabView.Item style={{ flex: 1 }}>
                        <SectionList
                            sections={todoSections}
                            keyExtractor={item => item.id}
                            renderItem={renderItem_}
                            renderSectionHeader={renderSectionHeader}
                        />
                    </TabView.Item>
                    <TabView.Item style={{ flex: 1 }}>
                        <SectionList
                            sections={goodsSections}
                            keyExtractor={item => item.id}
                            renderItem={renderItem_}
                            renderSectionHeader={renderSectionHeader}
                        />
                    </TabView.Item>
                </TabView>
                {/* <SectionList
                    sections={sections.map((section, index) => ({
                        ...section,
                        isLast: index === sections.length - 1,
                    }))}
                    keyExtractor={item => item.id}
                    renderItem={renderItem_}
                    renderSectionHeader={renderSectionHeader}
                    renderSectionFooter={({ section: { category } }) => {
                        return category === 'FOREIGN' ? <Divider /> : null
                    }}
                /> */}
            </View>
        )
    },
)
