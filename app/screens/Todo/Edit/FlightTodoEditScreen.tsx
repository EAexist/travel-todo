import { Avatar } from '@/components/Avatar'
import { GestureHandlerRootViewWrapper } from '@/components/BottomSheetModal'
import { Button } from '@/components/Button'
import * as Fab from '@/components/Fab'
import { Title } from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import { useStores, useTripStore } from '@/models'
import { Airline, FlightTodo, ReservationLink } from '@/models/Todo'
import { goBack, useNavigate } from '@/navigators'
import { api } from '@/services/api'
import { useHeader } from '@/utils/useHeader'
import { Icon, ListItem, Switch } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import {
    DefaultSectionT,
    FlatList,
    SectionList,
    SectionListData,
    SectionListRenderItem,
    View,
} from 'react-native'
import {
    TodoConfirmListItem,
    useTodoConfirmListItem,
} from '../TodoConfirmListItem'

const FlightRecommendation: FC<{ todoId: string }> = ({ todoId }) => {
    const {
        tripStore: { id: tripId },
    } = useStores()

    const [sections, setSections] =
        useState<SectionListData<Airline, DefaultSectionT>[]>()

    useEffect(() => {
        const getRecommendedFlightRoute = async () => {
            api.getRecommendedFlightRoute(tripId, todoId).then(response => {
                if (response.kind == 'ok') {
                    setSections(
                        response.data.map(flightRoute => ({
                            title: `${flightRoute.departureAirport.airportName} > ${flightRoute.arrivalAirport.airportName}`,
                            reservationLinks: flightRoute.reservationLinks,
                            data: flightRoute.airlines,
                        })),
                    )
                }
            })
        }
        getRecommendedFlightRoute()
    }, [setSections])

    const renderItem: SectionListRenderItem<Airline, DefaultSectionT> = ({
        item,
    }) => (
        <Observer
            render={() => (
                <ListItem>
                    <Avatar icon={{ name: item.iataCode }} />
                    <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            )}
        />
    )

    const renderSectionHeader = useCallback(
        ({
            section: { title, reservationLinks },
        }: {
            section: DefaultSectionT
        }) => {
            const renderItem = ({ item }: { item: ReservationLink }) => (
                <ListItem>
                    <Avatar icon={{ name: item.name }} />
                    <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            )

            return (
                <View>
                    <ListSubheader title={title} />
                    <FlatList
                        data={reservationLinks}
                        renderItem={renderItem}
                        keyExtractor={item => item.name}
                        style={{ flexGrow: 0 }}
                    />
                </View>
            )
        },
        [],
    )

    return sections ? (
        <SectionList
            sections={sections}
            keyExtractor={item => item.iataCode}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
        />
    ) : (
        <></>
    )
}

export const FlightTodoEditScreen: FC<{
    todo: FlightTodo
    isBeforeInitialization?: boolean
}> = observer(({ todo, isBeforeInitialization = false }) => {
    //   const [isConfirmed, setIsConfirmed] = useState(false)
    //   const [isCompleted, setIsCompleted] = useState(false)
    const { navigateWithTrip } = useNavigate()
    const tripStore = useTripStore()

    //   const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        console.log('Hello [FlightTodoEditScreen')
    }, [])

    const { patchTodo, completeAndPatchTodo } = useTripStore()

    const { isCompleted, setIsCompleted } = useTodoConfirmListItem(
        todo,
        'ConfirmFlight',
        isBeforeInitialization,
    )

    const handleConfirm = useCallback(async () => {
        if (!todo.isCompleted && isCompleted) {
            navigateWithTrip('ConfirmFlight', { todoId: todo.id })
        } else if (todo.isCompleted && !isCompleted) {
            todo.setIncomplete()
            patchTodo(todo).then(() => {
                goBack()
            })
        } else {
            goBack()
        }
    }, [patchTodo, todo, todo.isCompleted, isCompleted])

    const handleNotePress = useCallback(() => {
        console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
        navigateWithTrip('TodoNote', {
            todoId: todo.id,
        })
    }, [navigateWithTrip, todo.id])

    const handleDeparturePress = useCallback(() => {
        navigateWithTrip('DepartureAirportSetting')
    }, [])

    const handleArrivalPress = useCallback(() => {
        navigateWithTrip('ArrivalAirportSetting')
    }, [])

    const handleBackPressBeforeNavigate = useCallback(async () => {
        if (isBeforeInitialization) tripStore.deleteTodo(todo)
    }, [isBeforeInitialization])

    useHeader({
        onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
        // centerComponent: (
        //   <View style={$headerTitleStyle}>
        //     <TransText>✈️ 항공권 예약</TransText>
        //   </View>
        // ),
        // centerContainerStyle: {flexGrow: 1, flexBasis: 1, justifyContent: 'center'},
    })

    const handleChange = useCallback(() => {
        setIsCompleted(prev => !prev)
        console.log(isCompleted)
    }, [setIsCompleted, isCompleted])

    return (
        <Screen>
            <Title>
                <ListItem>
                    <Avatar icon={{ name: '✈️' }} size="xlarge" fontSize={28} />
                    <ListItem.Content>
                        <ListItem.Title>{todo.title}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </Title>
            <TextInfoListItem
                title={'공항(도시) 지정하기'}
                rightContent={
                    <Switch
                        value={todo.isRouteFixed}
                        onValueChange={value =>
                            todo.setProp('isRouteFixed', value)
                        }
                    />
                }
            />
            {todo.isRouteFixed && (
                <ListItem>
                    <ListItem.Content>
                        <View>
                            <Button>
                                {todo.departure ? (
                                    `${todo.departure?.name}${todo.departure?.iataCode ? ` (${todo.departure?.iataCode})` : ''}`
                                ) : (
                                    <>
                                        출발지 선택
                                        <Icon name="" />
                                    </>
                                )}
                            </Button>
                            <Icon name={''} />
                            <Button>
                                {todo.arrival ? (
                                    `${todo.arrival?.name}${todo.arrival?.iataCode ? ` (${todo.arrival?.iataCode})` : ''}`
                                ) : (
                                    <>
                                        도착지 선택
                                        <Icon name="" />
                                    </>
                                )}
                            </Button>
                        </View>
                    </ListItem.Content>
                </ListItem>
            )}
            {/* <Divider /> */}
            <TodoConfirmListItem
                todo={todo}
                isCompleted={isCompleted}
                onChange={handleChange}
            />
            <TextInfoListItem
                onPress={handleNotePress}
                title={'메모'}
                rightContent={<ListItem.Chevron />}>
                <TransText primary>
                    {todo.note || '메모를 남겨보세요'}
                </TransText>
            </TextInfoListItem>
            <FlightRecommendation todoId={todo.id} />
            <Fab.Container>
                <Fab.Button onPress={handleConfirm} title={'확인'} />
            </Fab.Container>
        </Screen>
    )
})
