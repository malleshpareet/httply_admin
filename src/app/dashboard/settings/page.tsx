import { SettingsForm } from "@/components/settings-form";

export const metadata = {
  title: "System Settings | Httply Admin",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage global configuration, feature flags, and security policies.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
