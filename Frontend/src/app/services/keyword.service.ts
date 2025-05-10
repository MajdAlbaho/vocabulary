import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordService extends BaseService {
  getAll() {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/Keywords`);
  }

  getKeywords(dataTableParam: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Keywords/GetKeywords`, { dataTableParam });
  }

  get(keywordId: string) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/Keywords/${keywordId}`);
  }

  post(keyword: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/Keywords`, keyword);
  }

  put(keyword: any) {
    return this.HttpClient.put<any>(this.BaseApiUrl + `/Keywords`, keyword);
  }

  delete(keywordId: number) {
    return this.HttpClient.delete<any>(this.BaseApiUrl + `/Keywords/${keywordId}`);
  }
}