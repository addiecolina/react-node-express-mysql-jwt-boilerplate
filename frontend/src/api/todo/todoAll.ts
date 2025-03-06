import { apiInstance } from '../apiInstance';
import { todoQueryKeys } from './todoQueryKeys';
import { useQuery } from '@tanstack/react-query';

export function useTodo(id: string) {
  const getUserFn = async () => {
    const response = await apiInstance.get(`todo/getTodos/${id}`);
    return response.data;
  };

  return useQuery({
    queryKey: todoQueryKeys.detail(id),
    queryFn: getUserFn,
    retry: 1,
  });
}