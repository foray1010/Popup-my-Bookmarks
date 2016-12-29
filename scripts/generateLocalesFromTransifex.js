'use strict'

const _ = require('lodash')
const bluebird = require('bluebird')
const co = require('co')
const fs = require('fs-extra')
const path = require('path')
const prompt = require('prompt')
const Transifex = require('transifex')

bluebird.promisifyAll(fs)
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

co(function* () {
  prompt.start()
  const cred = yield prompt.getAsync(schema)

  const transifex = new Transifex({
    credential: `${cred.transifex_username}:${cred.transifex_password}`
  })
  bluebird.promisifyAll(transifex)

  const availableLanguages = yield transifex.statisticsMethodsAsync(
    projectSlug,
    resourceSlug
  )
  yield Object.keys(availableLanguages)
    .map(function* (availableLanguage) {
      const messagesJsonStr = yield transifex.translationInstanceMethodAsync(
        projectSlug,
        resourceSlug,
        availableLanguage,
        {mode: 'onlytranslated'}
      )
      const messagesJson = JSON.parse(messagesJsonStr)

      const sortedMessagesJson = Object.keys(messagesJson)
        .filter((key) => Boolean(_.get(messagesJson, `${key}.message`)))
        .sort()
        .reduce((obj, key) => {
          obj[key] = messagesJson[key]
          return obj
        }, {})

      yield fs.mkdirsAsync(
        path.join(localesPath, availableLanguage)
      )

      yield fs.outputJsonAsync(
        path.join(localesPath, availableLanguage, 'messages.json'),
        sortedMessagesJson
      )

      console.log(`"${availableLanguage}" is generated`)
    })
}).catch((err) => console.error(err.stack))
