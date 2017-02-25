import {createElement} from 'react'

import '../../../../css/popup/no-result.css'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = () => (
  <li>
    <p styleName='main'>
      {msgNoResult}
    </p>
  </li>
)

export default NoResult
