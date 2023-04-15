import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

async function writeFile(fileName: string, fileData: string): Promise<void> {
  await fsPromises.mkdir(path.dirname(fileName), { recursive: true })
  await fsPromises.writeFile(fileName, fileData)
}

// markdown handler
async function getMarkdownData(
  titleList: ReadonlyArray<string>,
): Promise<string> {
  const dataList = await Promise.all(
    titleList.map(async (title) => {
      return fsPromises.readFile(path.join('markdown', `${title}.md`), 'utf-8')
    }),
  )

  return dataList.join('\n')
}

// generate markdown file
async function generateReadme(): Promise<void> {
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

  await writeFile(fileName, fileData)
}

async function generateStoreDescription(): Promise<void> {
  const fileName = path.join('build', 'store.md')

  let fileData = await getMarkdownData(['description', 'todo', 'contributing'])

  fileData = fileData
    // remove style of subheader
    .replaceAll('##### ', '')
    .trim()

  await writeFile(fileName, fileData)
}

async function main(): Promise<void> {
  await Promise.all([generateReadme(), generateStoreDescription()])
}

main().catch((err: Readonly<Error>) => {
  console.error(err)
  process.exitCode = 1
})
