// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-item.css'

import {createElement} from 'react'

type Props = {
  bookmarkInfo: Object
};
const BookmarkItem = (props: Props) => (
  <div styleName='main'>
    {props.bookmarkInfo.iconUrl && <img styleName='icon' src={props.bookmarkInfo.iconUrl} alt='' />}
    <div styleName='title'>{props.bookmarkInfo.title}</div>
  </div>
)

export default BookmarkItem
