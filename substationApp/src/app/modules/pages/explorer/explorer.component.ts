import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Subscription} from 'rxjs';
import {BroadcastService, MsalService} from '@azure/msal-angular';
import {HttpClient} from '@angular/common/http';
import {HttpServiceHelper} from '../../../core/http/HttpServiceHelper';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})

export class ExplorerComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  accessToken: string;

  constructor(private authService: MsalService, private http: HttpClient, private httpService: HttpServiceHelper, private broadcastService: BroadcastService) {
  }

  ngOnInit() {
    this.accessToken = '';
    this.checkLogin();
  }

  getUserProfile() {
    this.httpService.httpGetRequest(environment.apiEndPoints.graphProfileAPI)
      .subscribe(respData => {
        console.log(respData);
      }, error => {
        console.log('Http get request to MS Graph failed' + JSON.stringify(error));
      });
  }

  /***
   * Send token into Server
   * @param token
   */
  sendToken(token: string) {
    this.httpService.httpPostRequest(token, environment.apiEndPoints.serverBaseURL + '/check_token', null)
      .subscribe(res => {
        if (res.status == 'success') {
          localStorage.setItem(environment.storeInfo.tokenKey, token);
          localStorage.setItem(environment.storeInfo.username, res.data.displayName);
          this.accessToken = token;
        } else {
          alert(JSON.stringify(res.data));
        }
      }, err => {
        localStorage.clear();
        this.accessToken = '';
        console.error('Local API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  }

  checkLogin() {
    let curToken = localStorage.getItem(environment.storeInfo.tokenKey);
    if (curToken) {
      this.accessToken = curToken;
    }
    this.getUserProfile();
    this.subscription = this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {
      console.log('access token:' + payload._token);
      return this.sendToken(payload._token);
    });

    //will work for acquireTokenSilent and acquireTokenPopup
    this.subscription = this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
      console.log('acquire token failure ' + JSON.stringify(payload));
      if (payload.indexOf('consent_required') !== -1 || payload.indexOf('interaction_required') != -1) {
        this.authService.acquireTokenPopup(['user.read', 'mail.send']).then((token) => {
          this.getUserProfile();
          localStorage.clear();
          this.accessToken = '';
        }, (error) => {
          console.error('Something went wrong', error.toString());
          localStorage.clear();
          this.accessToken = '';
        });
      }
    });
  }

  //extremely important to unsubscribe
  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
