import {element} from 'deku'

import {
  removeTreeInfosAfterIndex
} from '../actions'

const closeHandler = (model) => () => {
  const {dispatch, props} = model

  const {treeIndex} = props

  dispatch(removeTreeInfosAfterIndex(treeIndex))
}

const TreeHeader = {
  render(model) {
    const {context, props} = model

    const {isHidden, treeIndex} = props
    const {trees} = context

    const treeHeaderBoxClasses = ['tree-header-box']
    const treeInfo = trees[treeIndex]

    if (isHidden) {
      treeHeaderBoxClasses.push('display-none')
    }

    return (
      <header class={treeHeaderBoxClasses.join(' ')}>
        <div class='tree-header-title no-text-overflow'>{treeInfo.title}</div>
        <div class='tree-header-close' onClick={closeHandler(model)} />
      </header>
    )
  }
}

export default TreeHeader
