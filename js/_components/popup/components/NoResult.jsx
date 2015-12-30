import element from 'virtual-element'

function render() {
  return (
    <div class='no-result no-text-overflow'>
      {chrome.i18n.getMessage('noResult')}
    </div>
  )
}

export default {render}
