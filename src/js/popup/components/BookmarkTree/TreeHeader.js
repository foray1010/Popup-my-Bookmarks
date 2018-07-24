// @flow strict @jsx createElement

import '../../../../css/popup/tree-header.css'

import {createElement} from 'react'

type Props = {|
  onClose: () => void,
  title: string
|}
const TreeHeader = (props: Props) => (
  <header styleName='main'>
    <h1 styleName='title'>{props.title}</h1>
    <button styleName='close' type='button' tabIndex='-1' onClick={props.onClose} />
  </header>
)

export default TreeHeader
