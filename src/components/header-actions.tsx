"use client";

import { Bell, RefreshCw, Search, Moon, Sun, ExternalLink, Settings, Home, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotificationsStore } from "@/store/notifications";
import { formatDistanceToNow } from "date-fns";

export function HeaderActions({ domain }: { domain: string }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = useNotificationsStore((state) => state.unreadCount());
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);

  // Avoid hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-2 mr-4">
          {/* Search Bar Placeholder */}
          <Button 
            variant="outline" 
            className="hidden lg:flex w-64 justify-start text-muted-foreground bg-muted/50 border-muted relative hover:bg-muted/80 transition-colors cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="text-sm font-normal">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Domain Indicator */}
          <Tooltip>
            <TooltipTrigger render={
              <Link href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                <div className="hidden md:flex items-center text-sm text-muted-foreground bg-muted hover:bg-muted/80 transition-colors px-3 py-1.5 rounded-full mx-1 cursor-pointer border border-transparent hover:border-border">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  {domain}
                  <ExternalLink className="ml-2 h-3 w-3 opacity-70" />
                </div>
              </Link>
            } />
            <TooltipContent>
              <p>Open Application</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          {mounted && (
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              } />
              <TooltipContent>
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Refresh & Notifications */}
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Refresh Page</span>
              </Button>
            } />
            <TooltipContent>
              <p>Refresh Page</p>
            </TooltipContent>
          </Tooltip>
          
          <Popover onOpenChange={(isOpen) => { if(isOpen) markAllAsRead(); }}>
            <Tooltip>
              <TooltipTrigger render={
                <PopoverTrigger render={
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                } />
              } />
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            
            <PopoverContent className="w-80 p-0" align="end">
              <PopoverHeader className="p-4 border-b">
                <PopoverTitle className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-normal">
                      {unreadCount} new
                    </span>
                  )}
                </PopoverTitle>
              </PopoverHeader>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-muted/30' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="text-sm font-medium leading-none">{notif.title}</p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(notif.date), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </TooltipProvider>

      {/* Command Palette */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
