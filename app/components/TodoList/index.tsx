import { Label } from '@/components/Label'
import { ListItemBase } from '@/components/ListItem/ListItem'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { ToggleSwitchTab, ToggleSwitchTabProps } from '@/components/SwitchTab'
import { useTripStore } from '@/models'
import { isSupplyCategory, Todo, TodoCategory } from '@/models/Todo'
import { ListItem, TabView, Text, useTheme } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback, useState } from 'react'
import {
    DefaultSectionT,
    ScrollView,
    SectionList,
    SectionListData,
    SectionListRenderItem,
    View,
} from 'react-native'

export const DoShowSupplyTodosFirstToggleSwitch: FC<
    Pick<ToggleSwitchTabProps, 'value' | 'onChange' | 'variant'>
> = observer(props => {
    const tripStore = useTripStore()

    return (
        <ToggleSwitchTab
            {...props}
            tabItemProps={{
                false: {
                    title: '할 일',
                },
                true: {
                    title: '준비할 짐',
                },
            }}
        />
    )
})

interface TodoListTabViewProps {
    doShowSupplyTodosFirst: boolean
    toggleDoShowSupplyTodosFirst: () => void
    renderTabViewItem: (isSupply: boolean) => ReactNode
}

export const TodolistTabView = observer(
    ({
        doShowSupplyTodosFirst,
        toggleDoShowSupplyTodosFirst,
        renderTabViewItem,
    }: TodoListTabViewProps) => {
        const activeTabIndex = doShowSupplyTodosFirst ? 1 : 0

        return (
            <TabView
                value={activeTabIndex}
                onChange={toggleDoShowSupplyTodosFirst}
                containerStyle={{ overflow: 'hidden' }}>
                <TabView.Item style={{ flex: 1 }}>
                    {renderTabViewItem(false)}
                </TabView.Item>
                <TabView.Item style={{ flex: 1 }}>
                    {renderTabViewItem(true)}
                </TabView.Item>
            </TabView>
        )
    },
)

interface TodoListProps<T = Todo> {
    sections: SectionListData<T, TodolistSectionT>[]
    renderItem: SectionListRenderItem<T, TodolistSectionT>
    keyExtractor: (item: T) => string
    doShowSupplyTodosFirst: boolean
    toggleDoShowSupplyTodosFirst: () => void
    renderTabHeader?: (isSupply: boolean) => ReactNode
    renderTabViewItem?: (isSupply: boolean) => ReactNode
}

export interface TodolistSectionT extends DefaultSectionT {
    title: string
    category: TodoCategory
}

export const TodolistSectionHeader: FC<{
    section: TodolistSectionT
}> = ({ section: { title, data, category } }) =>
    // category !== 'WORK' && category !== 'SUPPLY' &&
    data.length > 0 ? <ListSubheader title={title} /> : null

export const TodolistTabView_ = observer(
    <T extends {}>({
        sections,
        renderItem,
        keyExtractor,
        doShowSupplyTodosFirst,
        toggleDoShowSupplyTodosFirst,
        renderTabHeader,
        renderTabViewItem,
    }: TodoListProps<T>) => {
        const renderSectionHeader = useCallback(
            ({
                section: { title, data, category },
            }: {
                section: TodolistSectionT
            }) =>
                category !== 'WORK' &&
                category !== 'SUPPLY' &&
                data.length > 0 ? (
                    <ListSubheader title={title} />
                ) : null,
            [],
        )

        const activeTabIndex = doShowSupplyTodosFirst ? 1 : 0

        const todoSections = sections.filter(({ category }) =>
            isSupplyCategory(category),
        )

        const supplySections = sections.filter(
            ({ category }) => !isSupplyCategory(category),
        )

        return (
            <TabView
                value={activeTabIndex}
                onChange={toggleDoShowSupplyTodosFirst}
                containerStyle={{ overflow: 'hidden' }}>
                <TabView.Item style={{ flex: 1 }}>
                    <ScrollView>
                        {renderTabHeader ? renderTabHeader(false) : null}
                        {renderTabViewItem ? (
                            renderTabViewItem(false)
                        ) : (
                            <SectionList
                                sections={todoSections}
                                keyExtractor={keyExtractor}
                                renderItem={renderItem}
                                renderSectionHeader={renderSectionHeader}
                                ListEmptyComponent={
                                    <ListItemBase title={'할 일이 없어요'} />
                                }
                            />
                        )}
                    </ScrollView>
                </TabView.Item>
                <TabView.Item style={{ flex: 1 }}>
                    <ScrollView>
                        {renderTabHeader ? renderTabHeader(true) : null}
                        {renderTabViewItem ? (
                            renderTabViewItem(true)
                        ) : (
                            <SectionList
                                sections={supplySections}
                                keyExtractor={keyExtractor}
                                renderItem={renderItem}
                                renderSectionHeader={renderSectionHeader}
                            />
                        )}
                    </ScrollView>
                </TabView.Item>
            </TabView>
            // </View>
        )
    },
)
export const TodolistEditContent = observer(
    ({
        renderTabViewItem,
        variant,
    }: Pick<TodoListTabViewProps, 'renderTabViewItem'> &
        Pick<ToggleSwitchTabProps, 'variant'>) => {
        const [doShowSupplyTodosFirst, setDoShowSupplyTodosFirst] =
            useState(false)

        return (
            <View style={{ flex: 1 }}>
                <DoShowSupplyTodosFirstToggleSwitch
                    value={doShowSupplyTodosFirst}
                    onChange={() => setDoShowSupplyTodosFirst(prev => !prev)}
                    variant={variant}
                />
                <TodolistTabView
                    doShowSupplyTodosFirst={doShowSupplyTodosFirst}
                    toggleDoShowSupplyTodosFirst={() =>
                        setDoShowSupplyTodosFirst(prev => !prev)
                    }
                    renderTabViewItem={renderTabViewItem}
                />
            </View>
        )
    },
)
