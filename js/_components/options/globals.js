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

  async initOptionsValue() {
    const options = await chromep.storage.sync.get(null)

    const newOptions = {}

    for (const optionName of Object.keys(globals.optionsConfig)) {
      const optionConfig = globals.optionsConfig[optionName]

      const optionDefaultValue = optionConfig.default

      if (options[optionName] === undefined) {
        options[optionName] = optionDefaultValue
        newOptions[optionName] = optionDefaultValue

        if (optionConfig.permissions) {
          // to remove unnecessary permissions
          await globals.setPermission(optionName, optionConfig, optionDefaultValue)
        }
      }
    }

    await chromep.storage.sync.set(newOptions)
  },

  async setPermission(optionName, optionConfig, newOptionValue) {
    const permissionFunc = newOptionValue ?
      chromep.permissions.request :
      chromep.permissions.remove
    const permissionsObj = {
      permissions: [],
      origins: []
    }

    for (const permission of optionConfig.permissions) {
      const propName = permission.includes('://') ? 'origins' : 'permissions'

      permissionsObj[propName].push(permission)
    }

    const isSuccess = await permissionFunc(permissionsObj)

    if (!isSuccess) {
      const optionNameEls = document.getElementsByName(optionName)

      optionNameEls[newOptionValue ? 1 : 0].click()
    }

    return isSuccess
  }
}
