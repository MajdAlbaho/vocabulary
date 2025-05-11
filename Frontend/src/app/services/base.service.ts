import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    protected BaseApiUrl: string = environment.baseApiUrl;
    protected HttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.HttpClient = httpClient;
    }
}
