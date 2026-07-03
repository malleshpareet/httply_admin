import { create } from "zustand";

export interface AppNotification {
  id: string;
  type: string;
  title?: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "date" | "read">) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  addNotification: (notif) => set((state) => ({
    notifications: [
      {
        ...notif,
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString(),
        read: false,
      },
      ...state.notifications
    ].slice(0, 50) // keep last 50
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearAll: () => set({ notifications: [] }),
  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));
