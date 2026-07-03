"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { Activity, AlertTriangle, UserPlus, Database, Info } from "lucide-react";
import React from "react";

import { useNotificationsStore } from "@/store/notifications";

const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(e => {
      // Ignore autoplay or context errors
      console.warn("Audio playback failed", e);
    });
  } catch (e) {
    // Ignore errors
  }
};

export function PusherProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize Pusher in the browser
    if (typeof window === "undefined") return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the admin notifications channel
    const channel = pusher.subscribe("admin-notifications");

    // Bind to notification events
    channel.bind("alert", (data: { type: string; message: string; title?: string }) => {
      const { type, message, title } = data;
      
      // Play sound
      playNotificationSound();
      
      // Add to store
      useNotificationsStore.getState().addNotification({ type, message, title });
      
      switch (type) {
        case "ram":
          toast.error(title || "RAM Usage Alert", {
            description: message,
            icon: <Activity className="h-4 w-4 text-red-500" />,
            duration: 8000,
          });
          break;
        case "db":
          toast.warning(title || "Database Alert", {
            description: message,
            icon: <Database className="h-4 w-4 text-yellow-500" />,
            duration: 8000,
          });
          break;
        case "user_registered":
          toast.success(title || "New User Registered", {
            description: message,
            icon: <UserPlus className="h-4 w-4 text-green-500" />,
            duration: 5000,
          });
          break;
        case "warning":
          toast.warning(title || "Warning", {
            description: message,
            icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
            duration: 8000,
          });
          break;
        default:
          toast.info(title || "New Notification", {
            description: message,
            icon: <Info className="h-4 w-4 text-blue-500" />,
          });
          break;
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return <>{children}</>;
}
