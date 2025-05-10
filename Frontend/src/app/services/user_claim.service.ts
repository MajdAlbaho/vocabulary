import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserClaimService extends BaseService {

  getByUserId(userId: any) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/UserClaims/GetByUserId/${userId}`);
  }

  put(userId: string, userClaims: any) {
    return this.HttpClient.put<any>(this.BaseApiUrl + `/UserClaims/${userId}`, userClaims);
  }

  delete(userId: string) {
    return this.HttpClient.delete<any>(this.BaseApiUrl + `/UserClaims/${userId}`);
  }
}
