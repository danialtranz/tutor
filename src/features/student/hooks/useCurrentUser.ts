import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../api/studentApi'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: studentApi.getMe,
  })
}
