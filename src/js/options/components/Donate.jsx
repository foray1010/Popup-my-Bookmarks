import {createElement} from 'react'
import CSSModules from 'react-css-modules'

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
          <a
            styleName='link'
            href='http://goo.gl/x9Wlq'
            target='_blank'
            rel='noopener noreferrer'
          >
            Chrome Web Store
          </a>
        </li>
        <li>
          fork me on&nbsp;
          <a
            styleName='link'
            href='https://github.com/foray1010/Popup-my-Bookmarks'
            target='_blank'
            rel='noopener noreferrer'
          >
            GitHub
          </a>
        </li>
        <li>
          buy me a drink via&nbsp;
          <a
            styleName='link'
            href={paypalUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            PayPal
          </a>
          &nbsp;or&nbsp;
          <a
            styleName='link'
            href='bitcoin:16sJwjWsUWrFn5iAGGBCiQbqUD4Pb5YdDR'
            target='_blank'
            rel='noopener noreferrer'
          >
            Bitcoin
          </a>
          &nbsp;:)
        </li>
      </ol>
    </section>
  </footer>
)

export default CSSModules(Donate, styles)
