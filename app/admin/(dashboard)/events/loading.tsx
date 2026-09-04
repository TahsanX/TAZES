import { AdminListSkeleton } from "@/components/admin/list-skeleton";

export default function Loading() {
  return <AdminListSkeleton rows={4} titleWidth="w-32" withThumb label="Loading events" />;
}
