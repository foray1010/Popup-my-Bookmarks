// @flow strict @jsx createElement

import '../../../css/options/contributors.css'

import {Fragment, createElement} from 'react'

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
  <dl styleName='main'>
    {Object.keys(contributors).map((contributeType) => (
      <Fragment key={contributeType}>
        <dt>{contributeType}</dt>
        {contributors[contributeType].map((contributor) => (
          <dd key={contributor}>{contributor}</dd>
        ))}
      </Fragment>
    ))}
  </dl>
)

export default Contributors
