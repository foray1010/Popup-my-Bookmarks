import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Input from '../../../core/components/baseItems/Input'
import cancelIcon from '../../images/cancel.svg'
import searchIcon from '../../images/search.svg'
import classes from './search-input.css'

interface Props extends React.ComponentProps<typeof Input> {
  onCancel: () => void
}
const SearchInput = React.forwardRef<HTMLInputElement, Props>(
  function InnerSearchInput({ onCancel, ...inputProps }: Props, ref) {
    return (
      <div className={classes.main}>
        <img className={classes['search-icon']} src={searchIcon} alt='' />
        <Input
          ref={ref}
          inputMode='search'
          placeholder={webExtension.i18n.getMessage('search')}
          {...inputProps}
          className={classNames(classes['search-input'], inputProps.className)}
        />
        {inputProps.value ? (
          <img
            className={classes['cancel-icon']}
            src={cancelIcon}
            alt=''
            onClick={onCancel}
          />
        ) : null}
      </div>
    )
  },
)

export default SearchInput
