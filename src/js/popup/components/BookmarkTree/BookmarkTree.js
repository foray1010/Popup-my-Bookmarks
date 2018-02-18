// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-tree.css'

import {createElement} from 'react'

import BookmarkItem from './BookmarkItem'

type Props = {
  focusId: string,
  onMouseEnter: (string) => () => void,
  onMouseLeave: () => void,
  treeInfo: Object
};
const BookmarkTree = (props: Props) => (
  <section styleName='main'>
    <div>
      {props.treeInfo.children.map((bookmarkInfo) => (
        <BookmarkItem
          key={bookmarkInfo.id}
          bookmarkInfo={bookmarkInfo}
          isFocused={props.focusId === bookmarkInfo.id}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        />
      ))}
    </div>
  </section>
)

export default BookmarkTree
