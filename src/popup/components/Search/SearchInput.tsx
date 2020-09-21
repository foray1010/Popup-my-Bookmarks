import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Input from '../../../core/components/baseItems/Input'
import LazyImage from '../../../core/components/baseItems/LazyImage'
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
        <LazyImage
          alt='search'
          className={classes['search-icon']}
          src={searchIcon}
        />
        <Input
          ref={ref}
          inputMode='search'
          placeholder={webExtension.i18n.getMessage('search')}
          {...inputProps}
          className={classNames(classes['search-input'], inputProps.className)}
        />
        {inputProps.value ? (
          <LazyImage
            alt='clear search'
            className={classes['cancel-icon']}
            src={cancelIcon}
            onClick={onCancel}
          />
        ) : null}
      </div>
    )
  },
)

export default SearchInput
