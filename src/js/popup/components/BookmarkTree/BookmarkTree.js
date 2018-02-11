// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-tree.css'

import {createElement} from 'react'

import BookmarkItem from './BookmarkItem'

type Props = {
  treeInfo: Object
};
const BookmarkTree = (props: Props) => (
  <section styleName='main'>
    <div>
      {props.treeInfo.children.map((bookmarkInfo) => (
        <BookmarkItem key={bookmarkInfo.id} bookmarkInfo={bookmarkInfo} />
      ))}
    </div>
  </section>
)

export default BookmarkTree
