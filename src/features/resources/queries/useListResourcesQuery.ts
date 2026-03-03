import { trpc } from '@/trpc/client';

export const useListResourcesQuery = () => {
    return trpc.resource.list.useSuspenseQuery();
};
