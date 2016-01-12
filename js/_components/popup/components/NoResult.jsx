import {element} from 'deku'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = {
  render() {
    return (
      <div class='no-result no-text-overflow'>
        {msgNoResult}
      </div>
    )
  }
}

export default NoResult
