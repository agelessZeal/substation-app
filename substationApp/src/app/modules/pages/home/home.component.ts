import {Component, Input, OnInit} from '@angular/core';
import {HttpServiceHelper} from '../../../core/http/HttpServiceHelper';
import {MsalService} from '@azure/msal-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  private pageLoaded: boolean;
  constructor(private httpService: HttpServiceHelper) {
  }

  ngOnInit() {
    this.pageLoaded = true;
  }
}
