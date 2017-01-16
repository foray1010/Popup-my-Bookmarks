import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import ExternalLink from './ExternalLink'

import styles from '../../../css/options/donate.css'

const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TP67BBZ7VK934'

const Donate = () => (
  <footer styleName='main'>
    <a
      styleName='img'
      href={paypalUrl}
      target='_blank'
      rel='noopener noreferrer'
    >
      <img src='/img/btn_donateCC_LG.png' alt='' />
    </a>
    <section styleName='desc'>
      If you like Popup my Bookmarks, please consider to:
      <ol>
        <li>
          rate it on&nbsp;
          <ExternalLink href='http://goo.gl/x9Wlq'>
            Chrome Web Store
          </ExternalLink>
        </li>
        <li>
          fork me on&nbsp;
          <ExternalLink href='https://github.com/foray1010/Popup-my-Bookmarks'>
            GitHub
          </ExternalLink>
        </li>
        <li>
          buy me a drink via&nbsp;
          <ExternalLink href={paypalUrl}>
            PayPal
          </ExternalLink>
          &nbsp;or&nbsp;
          <ExternalLink href='bitcoin:16sJwjWsUWrFn5iAGGBCiQbqUD4Pb5YdDR'>
            Bitcoin
          </ExternalLink>
          &nbsp;:)
        </li>
      </ol>
    </section>
  </footer>
)

export default CSSModules(Donate, styles)
