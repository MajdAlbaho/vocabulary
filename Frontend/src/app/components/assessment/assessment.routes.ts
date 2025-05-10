import { Routes } from '@angular/router';
import { RoleGuardService } from '../../services/auth/role-guard.service';
import { AssessmentComponent } from './assessment.component';
import { AssessmentResultComponent } from './assessment-result/assessment-result.component';

export default [
  {
    path: ":id",
    component: AssessmentComponent,
    canActivate: [RoleGuardService],
    // data: {
    //   expectedClaims: [{ type: 'UserType', value: 'Employee' }]
    // }
  },
  {
    path: "assessment-result/:id",
    component: AssessmentResultComponent,
    canActivate: [RoleGuardService],
    // data: {
    //   expectedClaims: [{ type: 'UserType', value: 'Employee' }]
    // }
  },
] as Routes;


