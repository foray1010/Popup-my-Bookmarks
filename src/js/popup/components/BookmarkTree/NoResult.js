import webExtension from 'webextension-polyfill'
import {createElement} from 'react'

import '../../../../css/popup/no-result.css'

const NoResult = () => <p styleName='main'>{webExtension.i18n.getMessage('noResult')}</p>

export default NoResult
