// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  msal_info: {
    // Local Mode
    clientID: 'abe2a66f-24fd-48db-8951-ad9cf48ea0e2',
    redirectUri: 'https://localhost:4200/',
    postLogoutRedirectUri: 'https://localhost:4200/logout',

    // Online Mode
    // clientID: 'abe2a66f-24fd-48db-8951-ad9cf48ea0e2',
    // redirectUri: 'http://localhost:4200/',
    // postLogoutRedirectUri: 'http://localhost:4200/logout',

    consentScopes: 'api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user'
  },
  storeInfo: {
    tokenKey: 'smart_device_token',
    username: 'smart_device_username'
  },
  apiEndPoints: {
    graphProfileAPI: 'https://graph.microsoft.com/v1.0/me',
    // Local Mode
    serverBaseURL: 'http://127.0.0.1:3000',
    // Online Mode
    // serverBaseURL: 'http://127.0.0.1:3000',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
