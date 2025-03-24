import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../apiInstance";
import { todoQueryKeys } from "./todoQueryKeys";
import { TodoFormData } from "../../../types/Todo";
import { useAuthContext } from "../../utils/hooks/useCustomContext";

const createTodo = async (formData: TodoFormData) => { 
    const response = await apiInstance.post('todo/createTodos', formData);
    return response.data;
}

export function useTodoCreate() { 
    const queryClient = useQueryClient();
    const { accessToken } = useAuthContext();

    apiInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return useMutation({
        mutationFn: createTodo,
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
