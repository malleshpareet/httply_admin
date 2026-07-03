"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Users,
  Shield,
  FolderOpen,
  Send,
  Activity,
  Globe,
  Settings,
  Mail,
} from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoutButton } from "@/components/logout-button";

// Menu items
const navGroups = [
  {
    title: "Analytics",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: BarChart,
      },
    ],
  },
  {
    title: "Users & Access",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Sessions",
        url: "/dashboard/sessions",
        icon: Shield,
      },
    ],
  },
  {
    title: "Workspaces",
    items: [
      {
        title: "All Workspaces",
        url: "/dashboard/workspaces",
        icon: FolderOpen,
      },
      {
        title: "Members",
        url: "/dashboard/members",
        icon: Users,
      },
      {
        title: "Invites",
        url: "/dashboard/invites",
        icon: Mail,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Collections",
        url: "/dashboard/collections",
        icon: FolderOpen,
      },
      {
        title: "Requests",
        url: "/dashboard/requests",
        icon: Send,
      },
      {
        title: "Request Runs",
        url: "/dashboard/request-runs",
        icon: Activity,
      },
      {
        title: "Environments",
        url: "/dashboard/environments",
        icon: Globe,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Image
            src="/logo__2_-removebg-preview.png"
            alt="Httply logo"
            width={32}
            height={32}
            className="drop-shadow-md"
          />
          <span className="font-semibold tracking-tight text-lg">
            Httply Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={pathname === item.url}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 pb-14">
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
