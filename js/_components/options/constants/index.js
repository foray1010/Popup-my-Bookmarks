import Immutable from 'seamless-immutable'

export const OPTION_TABLE_MAP = Immutable({
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
})
