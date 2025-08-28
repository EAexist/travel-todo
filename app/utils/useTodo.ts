import {useStores, useTripStore} from '@/models'

export const useTodo = ({params}: {params: {todoId: string}}) => {
  console.log(`[useTodo] ${JSON.stringify(params)}`)
  const tripStore = useTripStore()
  const {todoId} = params
  const todo = tripStore.todoMap.get(todoId)
  return todo
}
