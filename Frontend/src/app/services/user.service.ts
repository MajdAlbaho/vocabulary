import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  getUsers(dataTableParam: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Users/GetUsers`, { dataTableParam });
  }

  get(id: any) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/Users/GetById/${id}`);
  }

  resetPassword(ApplicationUserId: any, newPassword: string) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Users/ResetPassword`, {
      'ApplicationUserId': ApplicationUserId,
      'NewPassword': newPassword,
    });
  }

  register(user: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Users/Register`, user);
  }

  put(user: any) {
    return this.HttpClient.put<any>(this.BaseApiUrl + `/Users/UpdateUser`, user);
  }
}
