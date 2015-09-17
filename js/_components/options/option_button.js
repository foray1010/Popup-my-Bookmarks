import element from 'virtual-element'
import forEach from 'lodash.foreach'

// will be called by globals.setPermission, so no parameters
function confirmButtonHandler() {
  const newOptions = {}
  const optionTableEl = document.getElementById('option-table')

  const namedElList = optionTableEl.querySelectorAll('[name]')

  forEach(namedElList, (namedEl) => {
    const optionName = namedEl.name

    const optionInfo = globals.optionsSchema.find((option) => option.name === optionName)

    const optionType = optionInfo.type || typeof optionInfo.choices[0]

    let optionValue = namedEl.value.trim().replace('\s+', ' ')

    // option in array form
    switch (optionType) {
      case 'select-multiple':
        if (!newOptions[optionName]) {
          newOptions[optionName] = []
        }
    }

    if (namedEl.tagName === 'INPUT') {
      switch (namedEl.type) {
        case 'checkbox':
        case 'radio':
          if (!namedEl.checked) {
            return true
          }
      }
    }

    // change to non-string type
    switch (optionType) {
      case 'boolean':
        optionValue = optionValue === 'true'
        break

      case 'number':
      case 'select-multiple':
      case 'string':
        optionValue = parseInt(optionValue, 10)
    }

    if (optionInfo.permissions) {
      // to remove unnecessary permissions
      globals.setPermission(optionInfo, optionValue)
    }

    if (Array.isArray(newOptions[optionName])) {
      newOptions[optionName].push(optionValue)
    } else {
      newOptions[optionName] = optionValue
    }
  })

  chromep.storage.sync.set(newOptions).then(() => {
    chromep.storage.sync.get(null).then((options) => {
      globals.setRootState({
        options: Immutable(options)
      })
    })
  })
}

function defaultButtonHandler(event, {props}) {
  chromep.storage.sync.clear()
    .then(globals.initOptionsValue)
    .then(() => {
      globals.getCurrentModuleOptions(props.currentModule).then((options) => {
        globals.setRootState({
          options: Immutable(options)
        })
      })
    })
}

function render() {
  return (
    <div id='option-button-box'>
      <button onClick={confirmButtonHandler}>{chrome.i18n.getMessage('confirm')}</button>
      <button onClick={defaultButtonHandler}>{chrome.i18n.getMessage('default')}</button>
    </div>
  )
}

export default {confirmButtonHandler, render}
