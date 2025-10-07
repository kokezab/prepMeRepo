import { useQuery } from "@tanstack/react-query";
import { Collections } from "@/lib/collections.ts";
import { listUsers } from "@/features/users/api/usersApi";

export default function useListUsers() {
  return useQuery({
    queryKey: [Collections.users],
    queryFn: listUsers,
  });
}
