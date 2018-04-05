import '../../../../css/popup/no-search-result.css'

import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

const NoSearchResult = () => <p styleName='main'>{webExtension.i18n.getMessage('noResult')}</p>

export default NoSearchResult
