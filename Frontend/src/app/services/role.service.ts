import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  getAll() {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/Roles`);
  }

  getRoles(dataTableParam: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Roles/GetRoles`, { dataTableParam });
  }

  get(roleName: string) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/Roles/${roleName}`);
  }

  post(roleName: string) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Roles/${roleName}`, {});
  }

  put(roleModifyRequestModel: any) {
    return this.HttpClient.put<any>(this.BaseApiUrl + `/Roles`, roleModifyRequestModel);
  }

  delete(roleName: string) {
    return this.HttpClient.delete<any>(this.BaseApiUrl + `/Roles/${roleName}`);
  }
}