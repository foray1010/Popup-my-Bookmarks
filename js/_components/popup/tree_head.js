import element from 'virtual-element'

function closeHandler(event, {props}) {
  globals.removeTreeInfoFromIndex(props.trees, props.treeIndex)
}

function render({props}) {
  const treeIndex = props.treeIndex
  const trees = props.trees

  const treeInfo = trees[treeIndex]

  return (
    <div class='tree-head-box'>
      <div class='tree-head-title no-text-overflow'>{treeInfo.title}</div>
      <div class='tree-head-close' onClick={closeHandler} />
    </div>
  )
}

export default {render}
