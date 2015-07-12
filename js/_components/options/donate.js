import {element} from 'deku'

function render() {
  return (
    <div id='donate'>
      <div id='donate-img'>
        <form
          action='https://www.paypal.com/cgi-bin/webscr'
          method='post'
          target='_blank'>
          <input type='hidden' name='cmd' value='_s-xclick' />
          <input
            type='hidden'
            name='encrypted'
            value={
              '-----BEGIN PKCS7-----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-\
              ----END PKCS7-----'
            } />
          <input
            type='image'
            name='submit'
            src='/img/btn_donateCC_LG.png'
            alt='' />
        </form>
      </div>
      <div id='donate-desc'>
        {'If you like Popup my Bookmarks, please rate this extension on '}
        <a class='link' href='http://goo.gl/x9Wlq' target='_blank'>
          Chrome Web Store
        </a>
        {' and consider to buy me a drink via '}
        <span id='donate-here' class='link'>
          PayPal
        </span>
        {'!'}
      </div>
    </div>
  )
}

function shouldUpdate() {
  // static HTML, never update
  return false
}

export default {render, shouldUpdate}
