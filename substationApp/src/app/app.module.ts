import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MsalModule, MsalInterceptor} from '@azure/msal-angular';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LogLevel} from 'msal';
import {HomeComponent} from './modules/pages/home/home.component';
import {HttpServiceHelper} from './core/http/HttpServiceHelper';
import {ExplorerComponent} from './modules/pages/explorer/explorer.component';
import {DeviceTreeComponent} from './modules/components/device-tree/device-tree.component';
import {ChartViewComponent} from './modules/components/chart-view/chart-view.component';
import {TreeModule} from 'ng2-tree';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {NgxMaskModule} from 'ngx-mask';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import {FormsModule} from '@angular/forms';

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log('client logging' + message);
}

export const protectedResourceMap: [string, string[]][] = [
  ['https://example/api/todolist', [environment.msal_info.consentScopes]],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExplorerComponent,
    DeviceTreeComponent,
    ChartViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MsalModule.forRoot({
        // clientID: '6226576d-37e9-49eb-b201-ec1eeb0029b6',
        // clientID: 'abe2a66f-24fd-48db-8951-ad9cf48ea0e2',
        // clientID: '7dce6b56-a49c-4639-93ed-c65bc57c2a26',
        clientID: environment.msal_info.clientID,
        authority: 'https://login.microsoftonline.com/common/',
        validateAuthority: true,
        redirectUri: environment.msal_info.redirectUri,
        cacheLocation: 'localStorage',
        postLogoutRedirectUri: environment.msal_info.postLogoutRedirectUri,
        navigateToLoginRequestUrl: true,
        popUp: false,
        consentScopes: ['user.read'],
        unprotectedResources: ['https://www.microsoft.com/en-us/'],
        protectedResourceMap: protectedResourceMap,
        logger: loggerCallback,
        correlationId: '1234',
        level: LogLevel.Info,
        piiLoggingEnabled: true
      }
    ),
    TreeModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskModule.forRoot(),
    NgxJsonViewerModule
  ],
  providers: [HttpServiceHelper,
    {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
