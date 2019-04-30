import path from 'path'

import bluebird from 'bluebird'
import fs from 'fs-extra'
import prompts from 'prompts'
import R from 'ramda'
import Transifex from 'transifex'

const questions: Array<prompts.PromptObject<string>> = [
  {
    type: 'text',
    name: 'transifex_username',
    message: 'transifex_username (you can register one for free)',
    validate: Boolean
  },
  {
    type: 'password',
    name: 'transifex_password',
    message: 'password',
    validate: Boolean
  }
]

const projectSlug = 'popup-my-bookmarks'
const resourceSlug = 'messagesjson-1'

const localesPath = path.join('src', '_locales')

interface Messages {
  [key: string]: {
    message: string
    description?: string
  }
}

const main = async () => {
  const response = await prompts(questions, {onCancel: () => process.exit(130)})

  const transifex = new Transifex({
    credential: `${response.transifex_username}:${response.transifex_password}`
  })
  bluebird.promisifyAll(transifex)

  const availableLanguages = await transifex.statisticsMethodsAsync(projectSlug, resourceSlug)
  await Promise.all(
    Object.keys(availableLanguages).map(async (availableLanguage) => {
      const messagesJsonStr = await transifex.translationInstanceMethodAsync(
        projectSlug,
        resourceSlug,
        availableLanguage,
        {mode: 'onlytranslated'}
      )
      const messagesJson: Messages = JSON.parse(messagesJsonStr)

      const sortedMessagesJson = Object.keys(messagesJson)
        .filter((key) => Boolean(R.path([key, 'message'], messagesJson)))
        .sort()
        .reduce((obj: Messages, key) => {
          // trim message
          if (messagesJson[key].message) {
            messagesJson[key].message = messagesJson[key].message.trim()
          }

          return {
            ...obj,
            [key]: messagesJson[key]
          }
        }, {})

      let mappedLanguage = ''
      switch (availableLanguage) {
        case 'nb_NO':
          mappedLanguage = 'nb'
          break

        default:
          mappedLanguage = availableLanguage
      }

      await fs.mkdirs(path.join(localesPath, mappedLanguage))

      await fs.outputJson(
        path.join(localesPath, mappedLanguage, 'messages.json'),
        sortedMessagesJson,
        {spaces: 2}
      )

      console.log(`"${mappedLanguage}" is generated`)
    })
  )
}

main().catch((err: Error) => {
  console.error(err)
})
