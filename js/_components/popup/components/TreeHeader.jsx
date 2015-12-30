import element from 'virtual-element'

function closeHandler(event, {props}) {
  globals.removeTreeInfoFromIndex(props.trees, props.treeIndex)
}

function render({props}) {
  const treeHeaderBoxClasses = ['tree-header-box']
  const treeIndex = props.treeIndex
  const trees = props.trees

  const treeInfo = trees[treeIndex]

  if (props.isHidden) {
    treeHeaderBoxClasses.push('display-none')
  }

  return (
    <header class={treeHeaderBoxClasses.join(' ')}>
      <div class='tree-header-title no-text-overflow'>{treeInfo.title}</div>
      <div class='tree-header-close' onClick={closeHandler} />
    </header>
  )
}

export default {render}
