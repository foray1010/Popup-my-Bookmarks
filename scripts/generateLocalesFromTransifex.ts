/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import * as readline from 'node:readline/promises'

import { type Collection, transifexApi } from '@transifex/api'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const organizationSlug = 'foray1010'
const projectSlug = 'popup-my-bookmarks'
const resourceSlug = 'messagesjson-1'

const localesPath = path.join('src', 'core', '_locales')

async function main(): Promise<void> {
  const transifexApiKey: string = await rl.question(
    'transifex api key (get from https://www.transifex.com/user/settings/api/): ',
  )
  if (!transifexApiKey) throw new Error('transifexApiKey is required')

  transifexApi.setup({
    auth: transifexApiKey,
  })

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

  const languages = (await project.fetch('languages', false)) as Collection &
    Readonly<{
      data: ReadonlyArray<
        Readonly<{
          attributes: Readonly<{
            code: string
          }>
        }>
      >
    }>
  await languages.fetch()

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

      const url: string =
        await transifexApi.ResourceTranslationsAsyncDownload.download({
          resource,
          language,
          mode: 'onlytranslated',
        })
      const messagesJson: Record<
        string,
        Readonly<{
          message: string
          description?: string
        }>
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
      > = await (await fetch(url)).json()

      const sortedMessagesJson = Object.fromEntries(
        Object.entries(messagesJson)
          .map(([k, v]) => {
            const trimmedMessage = v.message.trim()
            if (!trimmedMessage) return

            return [k, { ...v, message: trimmedMessage }] as const
          })
          .filter((x) => x != null)
          .sort(([a], [b]) => a.localeCompare(b)),
      ) satisfies typeof messagesJson

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
  .catch((err: Readonly<Error>) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => {
    rl.close()
  })
