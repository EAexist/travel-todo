import {IAnyModelType, types} from 'mobx-state-tree'

const withLoading = (baseModel: IAnyModelType) => {
  return baseModel.props({
    isLoading: types.maybe(types.boolean),
  })
}

export default withLoading
