import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import styles from '../../../css/options/donate.css'

const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick' +
  '&hosted_button_id=TP67BBZ7VK934'

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
    <p styleName='desc'>
      {'If you like Popup my Bookmarks, please rate this extension on '}
      <a
        styleName='link'
        href='http://goo.gl/x9Wlq'
        target='_blank'
        rel='noopener noreferrer'
      >
        Chrome Web Store
      </a>
      {' and consider to buy me a drink via '}
      <a
        styleName='link'
        href={paypalUrl}
        target='_blank'
        rel='noopener noreferrer'
      >
        PayPal
      </a>
      {'!'}
    </p>
  </footer>
)

export default CSSModules(Donate, styles)
