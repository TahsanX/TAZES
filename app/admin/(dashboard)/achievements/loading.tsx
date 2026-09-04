import { AdminListSkeleton } from "@/components/admin/list-skeleton";

export default function Loading() {
  return <AdminListSkeleton rows={6} titleWidth="w-52" withThumb label="Loading achievements" />;
}
