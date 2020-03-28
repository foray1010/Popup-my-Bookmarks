import { promises as fsPromises } from 'fs'
import path from 'path'

// markdown handler
const getMarkdownData = async (titleList: Array<string>) => {
  const dataList = await Promise.all(
    titleList.map((title) => {
      return fsPromises.readFile(path.join('markdown', `${title}.md`), 'utf-8')
    }),
  )

  return dataList.join('\n')
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
    'contributing',
  ])

  // enlarge first header
  fileData = fileData.replace(/^##/, '#')

  await fsPromises.writeFile(fileName, fileData)
}

const generateStoreDescription = async () => {
  const fileName = path.join('build', 'store.md')

  let fileData = await getMarkdownData(['description', 'todo', 'contributing'])

  fileData = fileData
    // remove style of subheader
    .replace(/##### /g, '')
    .trim()

  await fsPromises.writeFile(fileName, fileData)
}
;(async () => {
  try {
    await Promise.all([generateReadme(), generateStoreDescription()])
  } catch (err) {
    console.error(err.stack)
  }
})()
