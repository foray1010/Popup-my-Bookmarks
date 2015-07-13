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
            value={'-----BEGIN PKCS7-----MIIHVwYJKoZIhvcNAQcEoIIHSDCCB0QCAQExgg\
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\
EW3EZo0XRwaiGzetGCeh66/I=-----END PKCS7-----'} />
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
