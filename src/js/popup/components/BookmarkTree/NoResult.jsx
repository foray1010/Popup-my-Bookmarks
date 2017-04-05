import {createElement} from 'react'

import '../../../../css/popup/no-result.css'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = () => (
  <p styleName='main'>
    {msgNoResult}
  </p>
)

export default NoResult
