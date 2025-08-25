import {FlightTodo} from '@/models/Todo'
import {withTodo} from '@/utils/withTodo'
import {CustomTodoEditScreen} from './CustomTodoEditScreen'
import {FlightTicketTodoEditScreen} from './FlightTicketTodoEditScreen'
import {FlightTodoEditScreen} from './FlightTodoEditScreen'

export const TodoEditScreen = withTodo<'TodoEdit'>(({todo}) => {
  switch (todo.type) {
    case 'flight':
      return <FlightTodoEditScreen todo={todo as FlightTodo} />
    case 'flightTicket':
      return <FlightTicketTodoEditScreen todo={todo as FlightTodo} />
    default:
      return <CustomTodoEditScreen todo={todo} />
  }
})
