"use client";

import { useEffect, useState } from "react";
import { Activity, Database, Server, Clock, Users, Zap, Wrench, Lock, Save } from "lucide-react";

export function SystemMetricsBar() {
  const [metrics, setMetrics] = useState<any>(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center px-6 justify-between text-xs text-muted-foreground shadow-sm">
      <div className="hidden sm:flex items-center gap-4 pl-64 opacity-75">
        <span className="font-semibold text-primary">Live Monitoring</span>
        
        {/* Settings Status */}
        {metrics?.settings && (
          <div className="flex gap-2">
            {metrics.settings.maintenanceMode && (
              <span className="flex items-center gap-1 text-orange-500 font-medium" title="Maintenance Mode Active">
                <Wrench className="h-3 w-3" /> Maintenance
              </span>
            )}
            {!metrics.settings.allowSignups && (
              <span className="flex items-center gap-1 text-red-500 font-medium" title="Signups Disabled">
                <Lock className="h-3 w-3" /> Signups Locked
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2" title="Active Sessions">
          <Zap className="h-3 w-3 text-yellow-500" />
          <span>{metrics?.activeSessions ?? "--"} Active</span>
        </div>

        <div className="flex items-center gap-2" title="New Users Today">
          <Users className="h-3 w-3 text-blue-500" />
          <span>+{metrics?.newUsersToday ?? "--"} Today</span>
        </div>

        <div className="flex items-center gap-2" title="Total Requests Saved">
          <Save className="h-3 w-3 text-indigo-500" />
          <span>{metrics?.totalRequests ?? "--"} Saved</span>
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3" />
          <span className="font-medium">Health:</span>
          <span className={metrics?.health === "Healthy" ? "text-green-500" : "text-red-500"}>
            {metrics?.health || "--"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Server className="h-3 w-3" />
          <span className="font-medium">RAM:</span>
          <span>{metrics?.memoryMB ? `${metrics.memoryMB} MB` : "--"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Database className="h-3 w-3" />
          <span className="font-medium">DB:</span>
          <span>{metrics?.dbSize || "--"}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span className="font-medium">Up:</span>
          <span>{metrics?.uptimeSeconds ? formatUptime(metrics.uptimeSeconds) : "--"}</span>
        </div>
      </div>
    </div>
  );
}
