import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Organization name, contact info, and footer content shown across the public site.
      </p>
      <div className="mt-6">
        <SettingsForm defaults={settings} />
      </div>
    </div>
  );
}
