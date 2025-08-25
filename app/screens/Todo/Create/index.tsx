import {FlightTodo} from '@/models/Todo'
import {withTodo} from '@/utils/withTodo'
import {CustomTodoEditScreen} from '../Edit/CustomTodoEditScreen'
import {FlightTicketTodoEditScreen} from '../Edit/FlightTicketTodoEditScreen'
import {FlightTodoEditScreen} from '../Edit/FlightTodoEditScreen'

const CreateCustomTodoScreen = withTodo<'CreateCustomTodo'>(({todo}) => {
  return <CustomTodoEditScreen todo={todo} isBeforeInitialization={true} />
})

const CreateFlightTodoScreen = withTodo<'CreateFlightTodo'>(({todo}) => {
  return (
    <FlightTodoEditScreen
      todo={todo as FlightTodo}
      isBeforeInitialization={true}
    />
  )
})

const CreateFlightTicketTodoScreen = withTodo<'CreateFlightTicketTodo'>(
  ({todo}) => {
    return (
      <FlightTicketTodoEditScreen
        todo={todo as FlightTodo}
        isBeforeInitialization={true}
      />
    )
  },
)

export const Custom = CreateCustomTodoScreen
export const Flight = CreateFlightTodoScreen
export const FlightTicket = CreateFlightTicketTodoScreen
