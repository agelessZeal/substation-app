import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BroadcastService, MsalService} from '@azure/msal-angular';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'substationApp';
  loggedIn: boolean;
  private pageLoaded: boolean;
  public isIframe: boolean;
  public userInfo: any = null;
  private subscription: Subscription;

  constructor(private broadcastService: BroadcastService, private authService: MsalService) {
    this.pageLoaded = false;
    this.isIframe = window !== window.parent && !window.opener;
    this.userInfo = this.authService.getUser();
    if (this.userInfo) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  login() {
    this.authService.loginPopup(['user.read']);
  }

  logout() {
    localStorage.clear();
    location.href = '/home';
    // this.authService.logout();
  }

  ngOnInit() {

    this.broadcastService.subscribe('msal:loginFailure', (payload) => {
      console.log('login failure ' + JSON.stringify(payload));
      this.loggedIn = false;

    });

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      console.log('login success ' + JSON.stringify(payload));
      this.loggedIn = true;
    });

    let self = this;
    setTimeout(function () {
      self.pageLoaded = true;
    }, 3000);

  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
