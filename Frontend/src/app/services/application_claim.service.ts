import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationClaimService extends BaseService {
  get() {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/ApplicationClaims`);
  }
}
