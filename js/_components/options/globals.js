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
  async initOptionsValue() {
    const options = await chromep.storage.sync.get(null)

    const newOptions = {}

    for (const optionInfo of globals.optionsSchema) {
      const optionDefaultValue = optionInfo.defaultValue
      const optionName = optionInfo.name

      if (options[optionName] === undefined) {
        options[optionName] = optionDefaultValue
        newOptions[optionName] = optionDefaultValue

        if (optionInfo.permissions) {
          // to remove unnecessary permissions
          await globals.setPermission(optionInfo, optionDefaultValue)
        }
      }
    }

    await chromep.storage.sync.set(newOptions)
  },
  async setPermission(optionInfo, newOptionValue) {
    const permissionFunc = newOptionValue ?
      chromep.permissions.request :
      chromep.permissions.remove
    const permissionsObj = {
      permissions: [],
      origins: []
    }

    for (const permission of optionInfo.permissions) {
      const propName = permission.includes('://') ? 'origins' : 'permissions'

      permissionsObj[propName].push(permission)
    }

    const isSuccess = await permissionFunc(permissionsObj)

    if (!isSuccess) {
      const optionTableEl = document.getElementById('option-table')

      const optionNameEl = optionTableEl.querySelectorAll(`[name="${optionInfo.name}"]`)

      optionNameEl[newOptionValue ? 1 : 0].click()
    }

    return isSuccess
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
