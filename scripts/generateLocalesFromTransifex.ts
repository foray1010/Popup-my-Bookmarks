/* eslint-disable
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
*/
import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import * as readline from 'node:readline'
import { promisify } from 'node:util'

import type { Collection } from '@transifex/api'
import { transifexApi } from '@transifex/api'
import axios from 'axios'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// eslint-disable-next-line @typescript-eslint/unbound-method
const question = promisify(rl.question).bind(rl)

const organizationSlug = 'foray1010'
const projectSlug = 'popup-my-bookmarks'
const resourceSlug = 'messagesjson-1'

const localesPath = path.join('src', 'core', '_locales')

async function main(): Promise<void> {
  // @ts-expect-error somehow promisify does not work correctly with readline.question
  const transifexApiKey: string = await question(
    'transifex api key (get from https://www.transifex.com/user/settings/api/): ',
  )
  if (!transifexApiKey) throw new Error('transifexApiKey is required')

  transifexApi.setup({
    host: undefined, // use default host
    auth: transifexApiKey,
  })

  /* eslint-disable @typescript-eslint/await-thenable */
  const organization = await transifexApi.Organization.get({
    slug: organizationSlug,
  })

  const project = await transifexApi.Project.get({
    organization,
    slug: projectSlug,
  })

  const resource = await transifexApi.Resource.get({
    project,
    slug: resourceSlug,
  })

  const languages = (await project.fetch('languages', false)) as Collection & {
    data: ReadonlyArray<{
      readonly attributes: {
        readonly code: string
      }
    }>
  }
  await languages.fetch()
  /* eslint-enable @typescript-eslint/await-thenable */

  await Promise.all(
    languages.data.map(async (language) => {
      let mappedLanguage: string
      switch (language.attributes.code) {
        case 'nb_NO':
          mappedLanguage = 'nb'
          break

        case 'es_ES':
          mappedLanguage = 'es'
          break

        default:
          mappedLanguage = language.attributes.code
      }

      console.log(`processing "${mappedLanguage}"...`)

      // @ts-expect-error missing this type
      const url = await transifexApi.ResourceTranslationsAsyncDownload.download(
        {
          resource,
          language,
          mode: 'onlytranslated',
        },
      )
      const { data: messagesJson } = await axios.get<
        Record<
          string,
          {
            readonly message: string
            readonly description?: string
          }
        >
      >(url)

      const sortedMessagesJson = Object.fromEntries(
        Object.entries(messagesJson)
          .map(([k, v]) => {
            const trimmedMessage = v.message.trim()
            if (!trimmedMessage) return undefined

            return [k, { ...v, message: trimmedMessage }] as const
          })
          .filter(<T>(x: T | undefined): x is T => x !== undefined)
          .sort(([a], [b]) => a.localeCompare(b)),
      )

      await fsPromises.mkdir(path.join(localesPath, mappedLanguage), {
        recursive: true,
      })

      await fsPromises.writeFile(
        path.join(localesPath, mappedLanguage, 'messages.json'),
        JSON.stringify(sortedMessagesJson, null, 2) + '\n',
      )

      console.log(`"${mappedLanguage}" is generated`)
    }),
  )
}

main()
  .then(() => {
    rl.close()
  })
  .catch((err: Error) => {
    console.error(err)
    process.exit(1)
  })
