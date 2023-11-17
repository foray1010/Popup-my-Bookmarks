import * as React from 'react'

import classes from './contributors.module.css'

const contributors: Record<string, readonly string[]> = {
  Developer: ['foray1010'],
  Tester: ['David Bryant'],
  'Dutch Translator': ['Marzas'],
  'French Translators': ['foXaCe', 'Alexis Schapman'],
  'German Translator': ['Gürkan ZENGIN'],
  'Italian Translator': ['Giacomo Fabio Leone'],
  'Korean Translator': ['zenyr'],
  'Norwegian Bokmål Translator': ['Bjorn Tore Asheim'],
  'Russian Translators': ['kameo', 'Oleg K,'],
  'Spanish Translator': ['cyanine'],
  'Vietnamese Translator': ['Anh Phan'],
  Sponsors: [
    'Abtin Samadi',
    'Drake Roman',
    'j**************r@u******.nl',
    'Claudine J Haddock',
    'Carlos Velazquez',
    'Jacob Randall',
    'Николай Кондрашов',
    'a******s@v********.ca',
    'L. Smith',
    'j*********e@g****.com',
    'J*****y@c*.com',
  ],
}

export default function Contributors() {
  return (
    <dl className={classes.main}>
      {Object.entries(contributors).map(
        ([contributeType, contributorsOfType]) => (
          <React.Fragment key={contributeType}>
            <dt>{contributeType}</dt>
            {contributorsOfType.map((contributor) => (
              <dd key={contributor}>{contributor}</dd>
            ))}
          </React.Fragment>
        ),
      )}
    </dl>
  )
}
