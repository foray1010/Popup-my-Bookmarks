import {element} from 'deku'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = {
  render() {
    return (
      <p class='no-result no-text-overflow'>
        {msgNoResult}
      </p>
    )
  }
}

export default NoResult
