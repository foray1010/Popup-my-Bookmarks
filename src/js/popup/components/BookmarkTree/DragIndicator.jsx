import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import styles from '../../../../css/popup/drag-indicator.css'

const DragIndicator = () => (
  <li>
    <div styleName='main' />
  </li>
)

export default CSSModules(DragIndicator, styles)
