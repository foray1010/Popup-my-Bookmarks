import { forwardRef, type JSX } from 'react'

type Props = Readonly<
  Omit<JSX.IntrinsicElements['img'], 'decoding' | 'loading'>
>
const LazyImage = forwardRef<HTMLImageElement, Props>(
  function InnerLazyImage(props, ref) {
    return <img alt='' {...props} ref={ref} decoding='async' loading='lazy' />
  },
)

export default LazyImage
