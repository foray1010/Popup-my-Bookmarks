import * as React from 'react'

type Props = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'decoding' | 'loading'
>

const LazyImage = React.forwardRef<HTMLImageElement, Props>(
  function InnerLazyImage(props: Props, ref) {
    return <img {...props} ref={ref} decoding='async' loading='lazy' />
  },
)

export default LazyImage
