import { AdminListSkeleton } from "@/components/admin/list-skeleton";

export default function Loading() {
  return <AdminListSkeleton rows={5} titleWidth="w-44" label="Loading committee years" />;
}
