import * as React from 'react'

import LazyImage from '../../core/components/baseItems/LazyImage'
import donateIcon from '../images/btn_donateCC_LG.png'
import classes from './donate.css'
import ExternalLink from './ExternalLink'

const paypalUrl =
  'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TP67BBZ7VK934'

const Donate = () => (
  <footer className={classes.main}>
    <p className={classes.container}>
      <span className={classes.img}>
        <ExternalLink href={paypalUrl}>
          <LazyImage alt='donate' src={donateIcon} />
        </ExternalLink>
      </span>
      <span className={classes.desc}>
        If you like Popup my Bookmarks, please consider to:
        <ol>
          <li>
            rate it on&nbsp;
            <ExternalLink href='https://chrome.google.com/webstore/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni/reviews'>
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
            <ExternalLink href={paypalUrl}>PayPal</ExternalLink>
            &nbsp;or&nbsp;
            <ExternalLink href='bitcoin:3G8ZSQPeLWNvyo8AQJzMjVHvyzCSMFwhfA'>
              Bitcoin
            </ExternalLink>
            &nbsp;:)
          </li>
        </ol>
      </span>
    </p>
  </footer>
)

export default Donate
