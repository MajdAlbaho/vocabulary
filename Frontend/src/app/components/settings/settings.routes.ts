import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsersComponent } from './users/users.component';
import { UserClaimsComponent } from './users/user-claims/user-claims.component';
import { RolesComponent } from './roles/roles.component';
import { ApiKeyComponent } from './api-key/api-key.component';
import { RoleClaimsComponent } from './roles/role-claims/role-claims.component';
import { KeywordsComponent } from './keywords/keywords.component';

const routes: Routes = [
    {
        path: 'keywords', component: KeywordsComponent,
    },
    {
        path: "users",
        component: UsersComponent,
        // canActivate: [NotAdminGuardService]
    },
    {
        path: 'users/claims/:id', component: UserClaimsComponent,
    },
    {
        path: 'roles', component: RolesComponent,
    },
    {
        path: 'roles/claims/:id', component: RoleClaimsComponent,
    },
    {
        path: 'api-keys', component: ApiKeyComponent,
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SettingsRoute { }