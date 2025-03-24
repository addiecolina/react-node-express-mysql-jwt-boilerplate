import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../apiInstance";
import { todoQueryKeys } from "./todoQueryKeys";
import { useAuthContext } from "../../utils/hooks/useCustomContext";

const deleteTodo = async (slugs: string[]) => { 
    const response = await apiInstance.delete('todo/deleteTodos', { data: { slugs } });
    return response.data;
}

export function useTodoDelete() { 
    const queryClient = useQueryClient();
    const { accessToken } = useAuthContext();

    apiInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return useMutation({
        mutationFn: deleteTodo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: todoQueryKeys.all });
        },
        onSuccess: (data) => {
            queryClient.setQueryData(todoQueryKeys.all, data);
        },
        onError: (err, context) => {
            queryClient.setQueryData(todoQueryKeys.all, context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
        }
    })
}
