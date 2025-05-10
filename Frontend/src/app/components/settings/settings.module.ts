import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbHighlight, NgbModule, NgbNavModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsersComponent } from './users/users.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { UserClaimsComponent } from './users/user-claims/user-claims.component';
import { ForbiddenComponent } from '../../shared/components/forbidden/forbidden.component';
import { SettingsRoute } from './settings.routes';
import { RolesComponent } from './roles/roles.component';
import { RoleEditorComponent } from './roles/role-editor/role-editor.component';
import { ApiKeyComponent } from './api-key/api-key.component';
import { ApiKeyEditorComponent } from './api-key/api-key-editor/api-key-editor.component';
import { RoleClaimsComponent } from './roles/role-claims/role-claims.component';
import { ClaimsComponent } from "../../shared/components/claims/claims.component";
import { KeywordsComponent } from './keywords/keywords.component';
import { KeywordEditorComponent } from './keywords/keyword-editor/keyword-editor.component';
import { InputListComponent } from "../../shared/components/input-list/input-list.component";

@NgModule({
    declarations: [
        UsersComponent,
        UserEditorComponent,
        ResetPasswordComponent,
        UserClaimsComponent,
        RolesComponent,
        RoleEditorComponent,
        RoleClaimsComponent,
        ApiKeyComponent,
        ApiKeyEditorComponent,
        ForbiddenComponent,
        KeywordsComponent,
        KeywordEditorComponent
    ],
    imports: [
    TranslateModule,
    CommonModule,
    SettingsRoute,
    RouterModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbHighlight,
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    ClaimsComponent,
    InputListComponent
]
})
export class SettingsModule { }