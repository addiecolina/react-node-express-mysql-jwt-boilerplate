// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const todoQueryKeys = {
  all: ['todo'],
  details: () => [...todoQueryKeys.all, 'todo'],
  detail: (id: string) => [...todoQueryKeys.details(), id],
};