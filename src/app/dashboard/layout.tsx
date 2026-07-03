import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { SystemMetricsBar } from "@/components/system-metrics-bar";
import { HeaderActions } from "@/components/header-actions";
import { PusherProvider } from "@/components/pusher-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const domain = "app.httply.qzz.io";

  if (!session) {
    redirect("/login");
  }

  return (
    <PusherProvider>
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="w-full flex justify-between items-center">
            <h1 className="font-semibold">Dashboard</h1>
            <div className="flex items-center">
              <HeaderActions domain={domain} />
              <UserNav user={session.user} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </div>
      </SidebarInset>
      <SystemMetricsBar />
    </SidebarProvider>
    </PusherProvider>
  );
}
