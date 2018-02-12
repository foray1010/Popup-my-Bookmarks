'use strict'

const fs = require('fs-extra')
const path = require('path')

// markdown handler
const getMarkdownData = async (titleList) => {
  const dataList = await Promise.all(
    titleList.map((title) => {
      return fs.readFile(path.join('markdown', `${title}.md`), 'utf-8')
    })
  )

  return dataList.join('\n\n')
}

// generate markdown file
const generateReadme = async () => {
  const fileName = 'README.md'

  let fileData = await getMarkdownData([
    'title',
    'description',
    'legacy_version',
    'developer_guide',
    'todo',
    'contributing'
  ])

  // enlarge first header
  fileData = fileData.replace(/^##/, '#')

  await fs.writeFile(fileName, fileData)
}

const generateStoreDescription = async () => {
  const fileName = path.join('build', 'store.md')

  let fileData = await getMarkdownData(['description', 'todo', 'contributing'])

  fileData = fileData
    // remove style of subheader
    .replace(/##### /g, '')
    .trim()

  await fs.writeFile(fileName, fileData)
}
;(async () => {
  try {
    await Promise.all([generateReadme(), generateStoreDescription()])
  } catch (err) {
    console.error(err.stack)
  }
})()
