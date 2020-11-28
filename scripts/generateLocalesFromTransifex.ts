import bluebird from 'bluebird'
import { promises as fsPromises } from 'fs'
import path from 'path'
import prompts from 'prompts'
import Transifex from 'transifex'

const questions = [
  {
    type: 'text',
    name: 'transifexUsername',
    message: 'transifex username (you can register one for free)',
    validate: Boolean,
  } as const,
  {
    type: 'password',
    name: 'transifexPassword',
    message: 'password',
    validate: Boolean,
  } as const,
]

const projectSlug = 'popup-my-bookmarks'
const resourceSlug = 'messagesjson-1'

const localesPath = path.join('src', 'core', '_locales')

interface Messages {
  [key: string]: {
    message: string
    description?: string
  }
}

const main = async () => {
  const {
    transifexPassword,
    transifexUsername,
  }: {
    transifexPassword: string
    transifexUsername: string
  } = await prompts(questions, {
    onCancel: () => process.exit(130),
  })

  const transifex = new Transifex({
    credential: `${transifexUsername}:${transifexPassword}`,
  })
  bluebird.promisifyAll(transifex)

  const availableLanguages = await transifex.statisticsMethodsAsync(
    projectSlug,
    resourceSlug,
  )
  await Promise.all(
    Object.keys(availableLanguages).map(async (availableLanguage) => {
      const messagesJsonStr = await transifex.translationInstanceMethodAsync(
        projectSlug,
        resourceSlug,
        availableLanguage,
        { mode: 'onlytranslated' },
      )
      const messagesJson: Messages = JSON.parse(messagesJsonStr)

      const sortedMessagesJson = Object.keys(messagesJson)
        .sort()
        .reduce<Messages>((messages, key) => {
          messagesJson[key].message = messagesJson[key].message.trim()
          if (!messagesJson[key].message) return messages

          return { ...messages, [key]: messagesJson[key] }
        }, {})

      let mappedLanguage = ''
      switch (availableLanguage) {
        case 'nb_NO':
          mappedLanguage = 'nb'
          break

        case 'es_ES':
          mappedLanguage = 'es'
          break

        default:
          mappedLanguage = availableLanguage
      }

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

main().catch((err: Error) => {
  console.error(err)
})
