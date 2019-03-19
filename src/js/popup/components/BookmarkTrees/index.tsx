import * as React from 'react'
import {connect} from 'react-redux'

import {RootState, bookmarkCreators} from '../../reduxs'
import BookmarkTrees from './BookmarkTrees'
import withBookmarkEvents from './withBookmarkEvents'
import withDragAndDropEvents from './withDragAndDropEvents'
import withKeyboardNav from './withKeyboardNav'

interface OwnProps {
  mainTreeHeader: React.ReactNode
}

const getTreeIds = (state: RootState): Array<string> =>
  state.bookmark.trees.map((tree) => tree.parent.id)

const mapStateToProps = (state: RootState) => ({
  options: state.options,
  treeIds: getTreeIds(state)
})

const mapDispatchToProps = {
  initBookmarkTrees: bookmarkCreators.initBookmarkTrees
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
const BookmarkTreesContainer = ({initBookmarkTrees, ...restProps}: Props) => {
  React.useEffect(() => {
    initBookmarkTrees()
  }, [initBookmarkTrees])

  return <BookmarkTrees {...restProps} />
}

export default withBookmarkEvents(
  withDragAndDropEvents(
    withKeyboardNav(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(BookmarkTreesContainer)
    )
  )
)
