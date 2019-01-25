import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './modules/pages/home/home.component';
import {MsalGuard} from '@azure/msal-angular';
import {ExplorerComponent} from './modules/pages/explorer/explorer.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'explorer', component: ExplorerComponent, canActivate : [MsalGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
