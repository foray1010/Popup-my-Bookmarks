import type * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

type Props = Omit<React.ComponentProps<typeof QueryClientProvider>, 'client'>

export function ReactQueryClientProvider(props: Props) {
  return <QueryClientProvider client={queryClient} {...props} />
}
