import element from 'virtual-element'
import forEach from 'lodash.foreach'
import {render, tree} from 'deku'

import './_components/common'
import './_components/options/globals'
import App from './_components/options/app'

// get the root folders' title and set as the choices of 'defExpand'
chromep.bookmarks.getChildren('0')
  .then((rootFolders) => {
    const rootFolderChoices = []

    forEach(rootFolders, (thisFolder) => {
      const thisFolderIdNum = parseInt(thisFolder.id, 10)

      rootFolderChoices[thisFolderIdNum] = thisFolder.title
    })

    return rootFolderChoices
  })
  .then((rootFolderChoices) => {
    const booleanChoices = [true, false]
    const openBookmarkChoices = getSelectChoices('opt_clickOption')

    globals.optionsSchema = Immutable([
      {
        name: 'bookmarklet',
        choices: booleanChoices,
        defaultValue: false,
        permissions: ['http://*/', 'https://*/']
      },
      {
        name: 'defExpand',
        choices: rootFolderChoices,
        defaultValue: 1,
        type: 'string'
      },
      {
        name: 'hideRootFolder',
        choices: rootFolderChoices,
        defaultValue: [],
        type: 'select-multiple'
      },
      {
        name: 'setWidth',
        choices: [100, 399],
        defaultValue: 280
      },
      {
        name: 'fontSize',
        choices: [12, 30],
        defaultValue: 12
      },
      {
        name: 'fontFamily',
        choices: [
          'monospace',
          'sans-serif',
          'serif',
          'ArchivoNarrow',
          'Arial',
          'Comic Sans MS',
          'Georgia',
          'Lucida Sans Unicode',
          'Tahoma',
          'Trebuchet MS',
          'Verdana'
        ],
        defaultValue: 'sans-serif',
        type: 'input-select'
      },
      {
        name: 'searchTarget',
        choices: getSelectChoices('opt_searchTargetOpt'),
        defaultValue: 0
      },
      {
        name: 'maxResults',
        choices: [10, 200],
        defaultValue: 50
      },
      {
        name: 'tooltip',
        choices: booleanChoices,
        defaultValue: false
      },
      {
        name: 'warnOpenMany',
        choices: booleanChoices,
        defaultValue: true
      },
      {
        name: 'clickByLeft',
        choices: openBookmarkChoices,
        defaultValue: 0
      },
      {
        name: 'clickByLeftCtrl',
        choices: openBookmarkChoices,
        defaultValue: 4
      },
      {
        name: 'clickByLeftShift',
        choices: openBookmarkChoices,
        defaultValue: 5
      },
      {
        name: 'clickByMiddle',
        choices: openBookmarkChoices,
        defaultValue: 2
      },
      {
        name: 'opFolderBy',
        choices: booleanChoices,
        defaultValue: false
      },
      {
        name: 'rememberPos',
        choices: booleanChoices,
        defaultValue: false
      }
    ])
  })
  .then(globals.initOptionsValue)
  .then(() => {
    const currentModule = Object.keys(globals.optionTableMap)[0]

    globals.getCurrentModuleOptions(currentModule).then((options) => {
      const app = tree(
        <App
          initialCurrentModule={currentModule}
          initialOptions={options} />
      )

      render(app, document.getElementById('container'))
    })
  })

function getSelectChoices(optionName) {
  return chrome.i18n.getMessage(optionName).split('|')
}
