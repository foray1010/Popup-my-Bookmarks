import {element} from 'deku'

const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick' +
  '&hosted_button_id=TP67BBZ7VK934'

const Donate = {
  render() {
    return (
      <footer id='donate'>
        <a id='donate-img' href={paypalUrl} target='_blank'>
          <img src='/img/btn_donateCC_LG.png' alt='' />
        </a>
        <p id='donate-desc'>
          {'If you like Popup my Bookmarks, please rate this extension on '}
          <a class='link' href='http://goo.gl/x9Wlq' target='_blank'>
            Chrome Web Store
          </a>
          {' and consider to buy me a drink via '}
          <a class='link' href={paypalUrl} target='_blank'>
            PayPal
          </a>
          {'!'}
        </p>
      </footer>
    )
  }
}

export default Donate
