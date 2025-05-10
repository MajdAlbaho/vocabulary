import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService extends BaseService {
  getApiKeys(dataTableParam: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/ApiKeys/GetApiKeys`, { dataTableParam });
  }

  get(id: number) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/ApiKeys/${id}`);
  }

  post(apiKey: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/ApiKeys`, apiKey);
  }

  put(apiKey: any) {
    return this.HttpClient.put<any>(this.BaseApiUrl + `/ApiKeys`, apiKey);
  }

  revoke(id: number) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/ApiKeys/Revoke/${id}`, {});
  }
}