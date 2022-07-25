import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

type Props = Omit<
  React.ComponentProps<typeof QueryClientProvider>,
  'client' | 'context'
>

export function ReactQueryClientProvider(props: Props) {
  return <QueryClientProvider {...props} client={queryClient} />
}
