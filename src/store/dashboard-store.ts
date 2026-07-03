import { create } from "zustand";

interface DashboardState {
  autoRefreshEnabled: boolean;
  refreshIntervalMs: number;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (ms: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  autoRefreshEnabled: false,
  refreshIntervalMs: 5000,
  setAutoRefresh: (enabled) => set({ autoRefreshEnabled: enabled }),
  setRefreshInterval: (ms) => set({ refreshIntervalMs: ms }),
}));
