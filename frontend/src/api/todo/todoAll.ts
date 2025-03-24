import { apiInstance } from '../apiInstance';
import { todoQueryKeys } from './todoQueryKeys';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from "../../utils/hooks/useCustomContext";

export function useTodo(id: string) {
  const { accessToken } = useAuthContext();

  apiInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  const getUserFn = async () => {
    const response = await apiInstance.get(`todo/getTodos/${id}`);
    return response.data;
  };

  return useQuery({
    queryKey: todoQueryKeys.detail(id),
    queryFn: getUserFn,
  });
}