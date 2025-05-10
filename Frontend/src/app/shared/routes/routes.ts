import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: "",
    loadChildren: () => import("../../components/dashboard/dashboard.routes")
  },
  {
    path: "dashboard",
    loadChildren: () => import("../../components/dashboard/dashboard.routes")
  },
  {
    path: "assessment",
    loadChildren: () => import("../../components/assessment/assessment.routes")
  },
  {
    path: "settings",
    loadChildren: () => import("../../components/settings/settings.module").then(m => m.SettingsModule)
  },
];
