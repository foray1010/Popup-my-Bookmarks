import * as React from 'react'

type Props = Readonly<
  Omit<React.JSX.IntrinsicElements['img'], 'decoding' | 'loading'>
>

const LazyImage = React.forwardRef<HTMLImageElement, Props>(
  function InnerLazyImage(props, ref) {
    return <img alt='' {...props} ref={ref} decoding='async' loading='lazy' />
  },
)

export default LazyImage
