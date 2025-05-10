import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserAssessmentService extends BaseService {
  getAll() {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/UserAssessments`);
  }

  getAssessments(dataTableParam: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/UserAssessments/GetAssessments`, { dataTableParam });
  }

  get(id: number) {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/UserAssessments/${id}`);
  }

  post(applicationUserId: string, maxScore: number) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/UserAssessments`, { applicationUserId, maxScore });
  }

  submit(requestParam: any) {
    return this.HttpClient.post<any>(this.BaseApiUrl + `/UserAssessments/Submit`, requestParam);
  }

  delete(id: number) {
    return this.HttpClient.delete<any>(this.BaseApiUrl + `/UserAssessments/${id}`);
  }
}