import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RoleGuardService } from '../../services/auth/role-guard.service';

export default [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedClaims: [{ type: 'Assessments', value: 'Manage', logout: true }]
    }
  },
] as Routes;


