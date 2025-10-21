import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListItem/ListSubheader'
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { Todo } from '@/models/Todo'
import { Divider } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import {
    ComponentType,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from 'react'
import {
    DefaultSectionT,
    SectionList,
    SectionListProps,
    SectionListRenderItem,
} from 'react-native'

export interface TodolistEditScreenBaseProps<SectionT = DefaultSectionT>
    extends Pick<
        SectionListProps<any, SectionT>,
        | 'renderItem'
        | 'renderSectionHeader'
        | 'sections'
        | 'keyExtractor'
        | 'renderSectionFooter'
    > {
    title: string
    instruction?: string
    Todo?: ComponentType<{ item: Todo }>
}

const TodolistEditScreenBase = observer(function <
    SectionT extends DefaultSectionT,
>({
    // headerRightComponent,
    title,
    instruction,
    renderItem,
    renderSectionHeader,
    renderSectionFooter,
    Todo,
    sections,
    children,
    keyExtractor,
}: PropsWithChildren<TodolistEditScreenBaseProps<SectionT>>) {
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    // Handler for tab changes
    const handleTabChange = useCallback(
        (newIndex: number) => {
            setActiveTabIndex(newIndex)
        },
        [setActiveTabIndex],
    )
    const renderSectionHeaderInner = useCallback(
        ({ section: { title } }: { section: DefaultSectionT }) => (
            <ListSubheader size="xlarge" title={title} />
        ),
        [],
    )

    const renderSectionFooterInner = useCallback(
        ({ section: { isLast } }: { section: DefaultSectionT }) =>
            !isLast ? <Divider /> : null,
        [],
    )

    const keyExtractorInner = useCallback((item: any) => item.id, [])

    return (
        <Screen>
            <ContentTitle title={title} subtitle={instruction} />
            {/* <Tab
          value={activeTabIndex}
          onChange={handleTabChange}
          // indicatorStyle={tripStyles.TabIndicator}
        >
          <FlatList
            data={sections}
            renderItem={({ item }) => (
              <Tab.Item title={<Trans>{item.title}</Trans>} />
            )}
            keyExtractor={(item) => item.title}
          />
        </Tab> */}
            <SectionList
                sections={sections.map((section, index) => ({
                    ...section,
                    isLast: index === sections.length - 1,
                }))}
                keyExtractor={keyExtractor || keyExtractorInner}
                renderItem={renderItem}
                renderSectionHeader={
                    renderSectionHeader || renderSectionHeaderInner
                }
                renderSectionFooter={
                    renderSectionFooter || renderSectionFooterInner
                }
            />
            {children}
        </Screen>
    )
})

export default TodolistEditScreenBase

// const styles = StyleSheet.create({
//   TodolistEditScreenBase: {
//     backgroundColor: '#ffffff',
//     flex: 1,
//     paddingBottom: 12, // Corresponds to 0.75rem bottom padding
//   },
//   DoneText: {
//     color: '#333d4b',
//     fontFamily: 'Roboto',
//     fontSize: 15,
//     letterSpacing: 0.46,
//     lineHeight: 26,
//     textAlign: 'left',
//   },
//   Line1: {
//     height: 1, // Corresponds to 0.0625rem border
//     width: '100%', // Corresponds to 375px width
//     backgroundColor: '#f2f4f6',
//     marginTop: 0,
//   },
//   TabCountText: {
//     color: '#006ffd',
//     fontFamily: 'PretendardVariable',
//     fontSize: 17,
//     lineHeight: 24,
//     marginLeft: 4,
//     textAlign: 'left', // Corresponds to 0.25rem gap for count
//   },
//   TabTextActive: {
//     color: '#333d4b',
//     fontFamily: 'PretendardVariable',
//     fontSize: 17,
//     lineHeight: 24,
//     textAlign: 'left',
//   },
//   TabTextInactive: {
//     color: '#6b7684',
//     fontFamily: 'PretendardVariable',
//     fontSize: 17,
//     lineHeight: 24,
//     textAlign: 'left',
//   },
//   TabsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     paddingHorizontal: 20, // Corresponds to 1.25rem padding
//     gap: 16, // Corresponds to 1rem gap
//   },
// })
