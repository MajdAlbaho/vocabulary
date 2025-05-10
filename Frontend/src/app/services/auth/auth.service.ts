import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../shared/services/localStorage.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(httpClient: HttpClient, private localStorageService: LocalStorageService) {
    super(httpClient);
  }

  login(userName: string, password: string) {
    let req = {
      email: '',
      userName: userName,
      password: password,
    }
    return this.HttpClient.post(this.BaseApiUrl + "/Auth/Login", req);
  }

  register(email: string, userName: string, password: string) {
    let req = {
      email: email,
      userName: userName,
      password: password,
    }
    return this.HttpClient.post(this.BaseApiUrl + "/Auth/Register", req);
  }

  public hasAccess(allowedClaims: any): boolean {
    if (allowedClaims == null) return true;

    const storageClaims = this.localStorageService.getItem('claims');
    if (storageClaims == null) return false;

    try {
      const userClaims = JSON.parse(storageClaims);
      return allowedClaims.some((allowedClaim: any) =>
        userClaims.some((userClaim: any) =>
          userClaim.type === allowedClaim.type && userClaim.value === allowedClaim.value
        )
      );
    } catch (error) {
      return false;
    }
  }

  logout() {
    return this.HttpClient.post(this.BaseApiUrl + "/Auth/Logout", {});
  }
}
