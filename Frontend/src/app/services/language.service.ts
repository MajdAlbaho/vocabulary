import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends BaseService {
  getAll() {
    return this.HttpClient.get<any>(this.BaseApiUrl + `/Languages/GetAll`);
  }
}