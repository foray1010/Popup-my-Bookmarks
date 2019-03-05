import * as React from 'react'

import classes from '../../../css/options/contributors.css'

const contributors = {
  Developer: ['foray1010'],
  Tester: ['David Bryant'],
  'Dutch Translator': ['Marzas'],
  'French Translator': ['foXaCe', 'Alexis Schapman'],
  'German Translator': ['Gürkan ZENGIN'],
  'Italian Translator': ['Giacomo Fabio Leone'],
  'Korean Translator': ['zenyr'],
  'Norwegian Bokmål Translator': ['Bjorn Tore Asheim'],
  'Russian Translator': ['kameo', 'Oleg K,'],
  'Vietnamese Translator': ['Anh Phan'],
  Donor: [
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
    'J*****y@c*.com'
  ]
}

const Contributors = () => (
  <dl className={classes.main}>
    {Object.entries(contributors).map(([contributeType, contributorsOfType]) => (
      <React.Fragment key={contributeType}>
        <dt>{contributeType}</dt>
        {contributorsOfType.map((contributor) => (
          <dd key={contributor}>{contributor}</dd>
        ))}
      </React.Fragment>
    ))}
  </dl>
)

export default Contributors
