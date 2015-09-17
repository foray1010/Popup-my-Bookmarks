import forEach from 'lodash.foreach'

import {confirmButtonHandler} from './option_button'

window.globals = {
  optionTableMap: {
    general: [
      'bookmarklet',
      'defExpand',
      'hideRootFolder',
      'searchTarget',
      'maxResults',
      'tooltip',
      'warnOpenMany',
      'rememberPos'
    ],
    userInterface: [
      'setWidth',
      'fontSize',
      'fontFamily'
    ],
    control: [
      'clickByLeft',
      'clickByLeftCtrl',
      'clickByLeftShift',
      'clickByMiddle',
      'opFolderBy'
    ]
  },
  getCurrentModuleOptions(currentModule) {
    return chromep.storage.sync.get(globals.optionTableMap[currentModule] || [])
  },
  initOptionsValue() {
    return chromep.storage.sync.get(null).then((options) => {
      const newOptions = {}

      forEach(globals.optionsSchema, (optionInfo) => {
        const optionDefaultValue = optionInfo.defaultValue
        const optionName = optionInfo.name

        if (options[optionName] === undefined) {
          options[optionName] = optionDefaultValue
          newOptions[optionName] = optionDefaultValue

          if (optionInfo.permissions) {
            // to remove unnecessary permissions
            globals.setPermission(optionInfo, optionDefaultValue)
          }
        }
      })

      return chromep.storage.sync.set(newOptions)
    })
  },
  setPermission(optionInfo, newOptionValue) {
    const permissionFunc = newOptionValue ?
      chromep.permissions.request :
      chromep.permissions.remove
    const permissionsObj = {
      permissions: [],
      origins: []
    }

    forEach(optionInfo.permissions, (permission) => {
      const propName = permission.includes('://') ? 'origins' : 'permissions'

      permissionsObj[propName].push(permission)
    })

    return permissionFunc(permissionsObj).then((isSuccess) => {
      if (!isSuccess) {
        const optionTableEl = document.getElementById('option-table')

        const optionNameEl = optionTableEl.querySelectorAll(`[name="${optionInfo.name}"]`)

        optionNameEl[newOptionValue ? 1 : 0].click()

        confirmButtonHandler()
      }

      return isSuccess
    })
  },
  updateOptionsState(options, optionName, newOptionValue) {
    const mutableOptions = options.asMutable()

    if (typeof newOptionValue === 'string') {
      newOptionValue = newOptionValue.trim().replace('\s+', ' ')
    }

    mutableOptions[optionName] = newOptionValue

    globals.setRootState({
      options: Immutable(mutableOptions)
    })
  }
}
