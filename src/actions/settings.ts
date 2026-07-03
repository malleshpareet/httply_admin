"use server";

import db from "@/lib/db";

export async function getSettingsAction() {
  let settings = await db.systemSettings.findUnique({
    where: { id: "global" }
  });

  if (!settings) {
    settings = await db.systemSettings.create({
      data: {
        id: "global",
        maintenanceMode: false,
        allowSignups: true,
        enableAIFeatures: true,
        requireAdmin2FA: false,
      }
    });
  }

  return settings;
}

export async function updateSettingsAction(data: {
  maintenanceMode?: boolean;
  allowSignups?: boolean;
  enableAIFeatures?: boolean;
  requireAdmin2FA?: boolean;
}) {
  const settings = await db.systemSettings.upsert({
    where: { id: "global" },
    update: data,
    create: {
      id: "global",
      maintenanceMode: data.maintenanceMode ?? false,
      allowSignups: data.allowSignups ?? true,
      enableAIFeatures: data.enableAIFeatures ?? true,
      requireAdmin2FA: data.requireAdmin2FA ?? false,
    }
  });
  return settings;
}
