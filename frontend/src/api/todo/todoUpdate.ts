import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../apiInstance";
import { todoQueryKeys } from "./todoQueryKeys";
import { TodoFormData } from "../../../types/Todo";

const updateTodo = async (formData: TodoFormData) => { 
    const response = await apiInstance.put('todo/updateTodos', formData);
    return response.data;
}

export function useTodoUpdate() { 
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTodo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: todoQueryKeys.all });
        },
        onSuccess: (data) => {
            queryClient.setQueryData(todoQueryKeys.edit, data);
        },
        onError: (err, context) => {
            queryClient.setQueryData(todoQueryKeys.edit, context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: todoQueryKeys.edit })
        }
    })
}
