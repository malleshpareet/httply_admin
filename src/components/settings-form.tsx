"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Sparkles, Shield, Wrench, Users } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";

export function SettingsForm() {
  const { data: serverSettings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowSignups: true,
    enableAIFeatures: true,
    requireAdmin2FA: false,
  });

  // Sync server settings to local state when loaded
  useEffect(() => {
    if (serverSettings) {
      setSettings({
        maintenanceMode: serverSettings.maintenanceMode,
        allowSignups: serverSettings.allowSignups,
        enableAIFeatures: serverSettings.enableAIFeatures,
        requireAdmin2FA: serverSettings.requireAdmin2FA,
      });
    }
  }, [serverSettings]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center border rounded-md">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              General System
            </CardTitle>
            <CardDescription>
              Manage global application state and access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="maintenance-mode" className="text-base font-medium">Maintenance Mode</Label>
                <span className="text-sm text-muted-foreground">
                  Disable access to the platform for all non-admin users.
                </span>
              </div>
              <Switch 
                id="maintenance-mode" 
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleToggle('maintenanceMode')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="allow-signups" className="text-base font-medium">Allow New Signups</Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  Let new users create accounts on the platform.
                </span>
              </div>
              <Switch 
                id="allow-signups" 
                checked={settings.allowSignups}
                onCheckedChange={() => handleToggle('allowSignups')}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI & Automation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              AI & Automation
            </CardTitle>
            <CardDescription>
              Configure artificial intelligence assistance across workspaces.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="enable-ai" className="text-base font-medium">Enable AI Features</Label>
                <span className="text-sm text-muted-foreground">
                  Allow users to use AI for generating requests, writing tests, and analyzing API responses.
                </span>
              </div>
              <Switch 
                id="enable-ai" 
                checked={settings.enableAIFeatures}
                onCheckedChange={() => handleToggle('enableAIFeatures')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Security
            </CardTitle>
            <CardDescription>
              Enforce security policies for the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="require-2fa" className="text-base font-medium">Require 2FA for Admins</Label>
                <span className="text-sm text-muted-foreground">
                  Mandatory two-factor authentication for all administrator accounts.
                </span>
              </div>
              <Switch 
                id="require-2fa" 
                checked={settings.requireAdmin2FA}
                onCheckedChange={() => handleToggle('requireAdmin2FA')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={updateSettingsMutation.isPending} className="w-full sm:w-auto">
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
