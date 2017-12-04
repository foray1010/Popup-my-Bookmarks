'use strict'

const bluebird = require('bluebird')
const fs = require('fs-extra')
const path = require('path')
const prompt = require('prompt')
const R = require('ramda')
const Transifex = require('transifex')

bluebird.promisifyAll(prompt)

const schema = {
  properties: {
    transifex_username: {
      description: 'transifex_username (you can register one for free)',
      required: true
    },
    transifex_password: {
      hidden: true,
      required: true
    }
  }
}

const projectSlug = 'popup-my-bookmarks'
const resourceSlug = 'messagesjson-1'

const localesPath = path.join('src', '_locales')
;(async () => {
  try {
    prompt.start()
    const cred = await prompt.getAsync(schema)

    const transifex = new Transifex({
      credential: `${cred.transifex_username}:${cred.transifex_password}`
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
        const messagesJson = JSON.parse(messagesJsonStr)

        const sortedMessagesJson = Object.keys(messagesJson)
          .filter((key) => Boolean(R.path([key, 'message'], messagesJson)))
          .sort()
          .reduce((obj, key) => {
            // trim message
            if (messagesJson[key].message) {
              messagesJson[key].message = messagesJson[key].message.trim()
            }

            return {
              ...obj,
              [key]: messagesJson[key]
            }
          }, {})

        let mappedLanguage
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
  } catch (err) {
    console.error(err.stack)
  }
})()
