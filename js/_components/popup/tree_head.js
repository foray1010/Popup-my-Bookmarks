import element from 'virtual-element'

function closeHandler(event, {props}) {
  globals.removeTreeInfoFromIndex(props.trees, props.treeIndex)
}

function render({props}) {
  const treeHeadBoxClasses = ['tree-head-box']
  const treeIndex = props.treeIndex
  const trees = props.trees

  const treeInfo = trees[treeIndex]

  if (props.isHidden) {
    treeHeadBoxClasses.push('display-none')
  }

  return (
    <div class={treeHeadBoxClasses.join(' ')}>
      <div class='tree-head-title no-text-overflow'>{treeInfo.title}</div>
      <div class='tree-head-close' onClick={closeHandler} />
    </div>
  )
}

export default {render}
