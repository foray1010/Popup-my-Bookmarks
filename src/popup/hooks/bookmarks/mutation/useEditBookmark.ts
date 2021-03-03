import { useMutation } from 'react-query'
import webExtension from 'webextension-polyfill'

import { queryClient } from '../../../../core/utils/queryClient'
import { queryKey } from '../constants'

export default function useEditBookmark() {
  return useMutation(
    async ({
      id,
      changes,
    }: {
      id: string
      changes: webExtension.bookmarks._UpdateChanges
    }) => {
      await webExtension.bookmarks.update(id, changes)
    },
    {
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries([queryKey, id])
      },
    },
  )
}
