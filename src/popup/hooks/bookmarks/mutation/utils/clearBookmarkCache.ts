import { queryClient } from '../../../../../core/utils/queryClient'
import { queryKey } from '../../constants'

export default async function clearBookmarkCache({
  id,
  parentId,
}: {
  id: string
  parentId: string
}) {
  await queryClient.invalidateQueries([queryKey, id])
  await queryClient.invalidateQueries([queryKey, parentId])
}
