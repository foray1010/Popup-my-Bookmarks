import '../../../../css/popup/no-result.css'

import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

const NoResult = () => <p styleName='main'>{webExtension.i18n.getMessage('noResult')}</p>

export default NoResult
