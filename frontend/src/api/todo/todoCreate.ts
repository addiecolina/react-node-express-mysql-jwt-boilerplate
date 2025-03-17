import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../apiInstance";
import { todoQueryKeys } from "./todoQueryKeys";
import { TodoFormData } from "../../../types/Todo";

const createTodo = async (formData: TodoFormData) => { 
    const response = await apiInstance.post('todo/createTodos', formData);
    return response.data;
}

export function useTodoCreate() { 
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTodo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: todoQueryKeys.all });
        },
        onSuccess: (data) => {
            console.log('data created', data);
        },
        onError: (err, context) => {
            queryClient.setQueryData(todoQueryKeys.all, context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
        }
    })
}
