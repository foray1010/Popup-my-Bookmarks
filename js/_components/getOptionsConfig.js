import chromep from './lib/chromePromise'

async function getOptionsConfig() {
  const openBookmarkChoices = getSelectChoices('opt_clickOption')
  const rootFolderChoices = []

  // get the root folders' title and set as the choices of 'defExpand'
  const rootFolders = await chromep.bookmarks.getChildren('0')

  for (const rootFolder of rootFolders) {
    const rootFolderIdNum = Number(rootFolder.id)

    rootFolderChoices[rootFolderIdNum] = rootFolder.title
  }

  return {
    bookmarklet: {
      type: 'boolean',
      default: false,
      permissions: [
        'http://*/',
        'https://*/'
      ]
    },
    clickByLeft: {
      type: 'integer',
      default: 0,
      choices: openBookmarkChoices
    },
    clickByLeftCtrl: {
      type: 'integer',
      default: 4,
      choices: openBookmarkChoices
    },
    clickByLeftShift: {
      type: 'integer',
      default: 5,
      choices: openBookmarkChoices
    },
    clickByMiddle: {
      type: 'integer',
      default: 2,
      choices: openBookmarkChoices
    },
    defExpand: {
      type: 'integer',
      default: 1,
      choices: rootFolderChoices
    },
    fontFamily: {
      type: 'string',
      default: 'sans-serif',
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
      ]
    },
    fontSize: {
      type: 'integer',
      default: 12,
      minimum: 12,
      maximum: 30
    },
    hideRootFolder: {
      type: 'array',
      default: [],
      choices: rootFolderChoices
    },
    maxResults: {
      type: 'integer',
      default: 50,
      minimum: 10,
      maximum: 200
    },
    opFolderBy: {
      type: 'boolean',
      default: false
    },
    rememberPos: {
      type: 'boolean',
      default: false
    },
    searchTarget: {
      type: 'integer',
      default: 0,
      choices: getSelectChoices('opt_searchTargetOpt')
    },
    setWidth: {
      type: 'integer',
      default: 280,
      minimum: 100,
      maximum: 399
    },
    tooltip: {
      type: 'boolean',
      default: false
    },
    warnOpenMany: {
      type: 'boolean',
      default: true
    }
  }
}

function getSelectChoices(optionName) {
  return chrome.i18n.getMessage(optionName).split('|')
}

export default getOptionsConfig
