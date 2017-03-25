'use strict'

const bluebird = require('bluebird')
const co = require('co')
const fs = require('fs')
const path = require('path')

bluebird.promisifyAll(fs)

// markdown handler
function* getMarkdownData(titleList) {
  const dataList = yield titleList.map((title) => {
    return fs.readFileAsync(path.join('markdown', `${title}.md`), 'utf-8')
  })

  return dataList.join('\n\n')
}

// generate markdown file
const generateReadme = co.wrap(function* () {
  const fileName = 'README.md'

  let fileData = yield getMarkdownData([
    'title',
    'description',
    'legacy_version',
    'developer_guide',
    'todo',
    'contributing'
  ])

  // enlarge first header
  fileData = fileData.replace(/^##/, '#')

  yield fs.writeFileAsync(fileName, fileData)
})

const generateStoreDescription = co.wrap(function* () {
  const fileName = '__store.md'

  let fileData = yield getMarkdownData([
    'description',
    'todo',
    'contributing'
  ])

  fileData = fileData
    // remove style of subheader
    .replace(/##### /g, '')
    .trim()

  yield fs.writeFileAsync(fileName, fileData)
})

co(function* () {
  yield [
    generateReadme(),
    generateStoreDescription()
  ]
}).catch((err) => console.error(err.stack))
