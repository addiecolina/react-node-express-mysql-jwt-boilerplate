import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../apiInstance";
import { todoQueryKeys } from "./todoQueryKeys";

const deleteTodo = async (slugs: string[]) => { 
    const response = await apiInstance.delete('todo/deleteTodos', { data: { slugs } });
    return response.data;
}

export function useTodoDelete() { 
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTodo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: todoQueryKeys.all });
        },
        onSuccess: (data) => {
            queryClient.setQueryData(todoQueryKeys.delete, data);
        },
        onError: (err, context) => {
            queryClient.setQueryData(todoQueryKeys.delete, context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: todoQueryKeys.delete })
        }
    })
}
