import * as React from 'react'
import { ReactQueryConfigProvider } from 'react-query'

type ReactQueryConfigProviderProps = React.ComponentProps<
  typeof ReactQueryConfigProvider
>

type Props = Omit<ReactQueryConfigProviderProps, 'config'> & {
  config?: ReactQueryConfigProviderProps['config']
}

export default function ReactQueryDefaultConfigProvider({
  config,
  ...restProps
}: Props) {
  return (
    <ReactQueryConfigProvider
      {...restProps}
      config={React.useMemo(
        () => ({
          ...config,
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            ...config?.queries,
          },
        }),
        [config],
      )}
    />
  )
}
