import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RoleClaimService extends BaseService {

  getByRoleName(roleName: any) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/RoleClaims/GetByRoleName/${roleName}`);
  }

  put(roleName: string, claims: any) {
    return this.HttpClient.put<any>(this.BaseApiUrl + `/RoleClaims/${roleName}`, claims);
  }

  delete(roleName: string) {
    return this.HttpClient.delete<any>(this.BaseApiUrl + `/RoleClaims/${roleName}`);
  }
}
