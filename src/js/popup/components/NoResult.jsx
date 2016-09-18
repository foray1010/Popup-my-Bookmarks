import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import styles from '../../../css/popup/no-result.scss'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = () => (
  <li>
    <p styleName='main'>
      {msgNoResult}
    </p>
  </li>
)

export default CSSModules(NoResult, styles)
