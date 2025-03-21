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
            console.log('data deleted', data);
        },
        onError: (err, context) => {
            queryClient.setQueryData(todoQueryKeys.all, context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
        }
    })
}
