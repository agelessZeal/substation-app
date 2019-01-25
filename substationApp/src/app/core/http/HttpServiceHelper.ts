import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

interface ResponseData {
  status: string;
  data: any;
  url: string;
}

@Injectable()
export class HttpServiceHelper {

  constructor(private http: HttpClient) {
  }

  public httpAuthGetRequest(accessToken: string, url: string) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };
    return this.http.get<ResponseData>(url, httpOptions);
  }

  public httpGetRequest(url: string) {
    return this.http.get(url);
  }

  public httpPostRequest(accessToken: string, url: string, postBody: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };
    return this.http.post<ResponseData>(url, postBody, httpOptions);
  }
}
