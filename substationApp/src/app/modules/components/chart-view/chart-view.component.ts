import {ChangeDetectorRef, Component, Input, NgModule, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpServiceHelper} from '../../../core/http/HttpServiceHelper';
import {NodeInfoService} from '../../../core/services/node-type.service';
// import * as moment from 'moment';
// import {importExpr} from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class ChartViewComponent implements OnInit {
  @Input() accToken: string;
  msTypes: Array<MSTypes>;
  meterings: Array<MSTypes>;
  timeSeries: TimeSeries;
  seriesTypes: string[];
  dataBaseURL: string;

  curMSType: MSTypes;
  curMeteringType: MSTypes;
  curDevInfo: any;
  curSeriesType: string;

  jsonData: any;

  // Parameter for History API
  fromDate: Date; // for History API Call
  toDate: Date; // for History API Call

  // Parameter for Metering API
  numberOf: Number;
  timeSpan: string;
  // sub parameters for time span
  tsYear: string;
  tsMonth: string;
  tsDay: string;
  tsHour: string;
  tsMin: string;
  tsSecond: string;
  // sub parameters for time span
  isTimeSpanValid: boolean;
  startDate: Date;
  endDate: Date;

  chatDataLoaded: boolean;

  public minDate = new Date(2019, 0, 20, 0, 0);


  constructor(private httpService: HttpServiceHelper,
              private cdRef: ChangeDetectorRef,
              private nodeTypeService: NodeInfoService) {
    this.dataBaseURL = environment.apiEndPoints.serverBaseURL;
    this.seriesTypes = ['History', 'Metering', 'Actual'];
    this.curSeriesType = 'History';
    this.fromDate = this.minDate;
    this.numberOf = 100;
    this.timeSpan = '';

    this.tsDay = '';
    this.tsHour = '';
    this.tsMin = '';
    this.tsSecond = '';

    this.isTimeSpanValid = true;
    this.chatDataLoaded = false;
  }

  ngOnInit() {

    this.msTypes = [];
    let self = this;
    setTimeout(function () {
      self.getMSTypes(self.accToken);
    }, 500);
    setTimeout(function () {
      self.getMeterings(self.accToken);
    }, 1000);

    this.nodeTypeService.getNodeInfo().subscribe(msTypeInfo => {
      this.curDevInfo = msTypeInfo;
      this.makeAPIRequest();
    });

  }


  getMSTypes(token: string) {
    this.httpService.httpPostRequest(token, this.dataBaseURL + '/get_ms_types', null)
      .subscribe(res => {
        if (res.status == 'success') {
          this.msTypes = res.data;
          if (this.msTypes.length > 0) {
            this.curMSType = this.msTypes[0]; // set Default measurement infomation
          }
        } else {
          if (res.data == 'Unauthorized') { //Refresh token, webpage
            localStorage.clear();
            location.reload();
          } else {
            alert('Measurement Types Empty!' + JSON.stringify(res.data));
          }
        }
      }, err => {
        console.error('Get Measurements API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  }

  getMeterings(token: string) {
    this.httpService.httpPostRequest(token, this.dataBaseURL + '/get_meterings', null)
      .subscribe(res => {
        if (res.status == 'success') {
          this.meterings = res.data;
          if (this.meterings.length > 0) {
            this.curMeteringType = this.meterings[0];
            this.makeAPIRequest();
          }
        } else {
          if (res.data == 'Unauthorized') { //Refresh token, webpage
            localStorage.clear();
            location.reload();
          } else {
            alert('Measurement Types Empty!' + JSON.stringify(res.data));
          }
        }
      }, err => {
        console.error('Get Meterings API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  }

  makeAPIRequest() {

    this.chatDataLoaded = true;
    this.jsonData = [];
    switch (this.curSeriesType) {
      case 'History':
        //Get Device Info, fromDate, toDate.
        console.error('====Making Historical API===');
        this.makeHistoryAPI(this.curDevInfo, this.curMSType, this.fromDate, this.toDate);
        break;
      case 'Metering':
        console.error('====Making Metering API===');
        this.makeMeteringAPI(this.curDevInfo, this.curMeteringType, this.numberOf, this.timeSpan, this.startDate, this.endDate);
        break;
      case 'Actual':
        console.error('====Making Actual API===');
        this.makeActualAPI(this.curDevInfo, this.curMSType);
        break;
    }
  }

  makeHistoryAPI(devInfo, msType, fromDate, toDate) {
    this.chatDataLoaded = false;
    console.log(devInfo, msType, fromDate, toDate);
    let reqData = {
      devInfo: devInfo,
      msType: msType,
      fromDate: fromDate,
      toDate: toDate
    };
    this.httpService.httpPostRequest(this.accToken, this.dataBaseURL + '/get_history_data', reqData)
      .subscribe(res => {
        if (res.status == 'success') {
          this.timeSeries = res.data;
          console.log('History Time Series Data');
          console.log(this.timeSeries);
        } else {
          if (res.data == 'Unauthorized') { //Refresh token, webpage
            localStorage.clear();
            location.reload();
          } else {
            alert('History Time Series Empty!' + JSON.stringify(res.data));
          }
        }
        this.chatDataLoaded = true;
        this.jsonData = res;
      }, err => {
        console.error('Get History Data API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  }

  makeMeteringAPI(devInfo, meteringType, numberOf, timeSpan, startDate, endDate) {
    console.log(devInfo, meteringType, numberOf, timeSpan, startDate, endDate);
    if (typeof numberOf == 'undefined' || typeof timeSpan == 'undefined' || timeSpan == '') return;
    console.log(devInfo, meteringType, startDate, endDate);
    let reqData = {
      devInfo: devInfo,
      meteringType: meteringType,
      numberOf: numberOf,
      timeSpan: timeSpan,
      startDate: startDate,
      endDate: endDate
    };
    this.chatDataLoaded = false;
    this.httpService.httpPostRequest(this.accToken, this.dataBaseURL + '/get_metering_data', reqData)
      .subscribe(res => {
        if (res.status == 'success') {
          this.timeSeries = res.data;
          console.log('Metering Time Series Data');
          console.log(this.timeSeries);
        } else {
          if (res.data == 'Unauthorized') { //Refresh token, webpage
            localStorage.clear();
            location.reload();
          } else {
            alert('Metering Time Series Empty!' + JSON.stringify(res.data));
          }
        }
        this.chatDataLoaded = true;
        this.jsonData = res;
      }, err => {
        console.error('Get Metering Data API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  }

  makeActualAPI(devInfo, msType) {
    this.chatDataLoaded = false;
    console.log(devInfo, msType);
    let reqData = {
      devInfo: devInfo,
      msType: msType,
    };
    this.httpService.httpPostRequest(this.accToken, this.dataBaseURL + '/get_actual_data', reqData)
      .subscribe(res => {
        if (res.status == 'success') {
          this.timeSeries = res.data;
          console.log('Actual Time Series Data');
          console.log(this.timeSeries);
        } else {
          if (res.data == 'Unauthorized') { //Refresh token, webpage
            localStorage.clear();
            location.reload();
          } else {
            alert('Actual Time Series Empty!' + JSON.stringify(res.data));
          }
        }
        this.chatDataLoaded = true;
        this.jsonData = res;
      }, err => {
        console.error('Get Actual Data API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  }

  onSelectSeries(newValue: string) {
    this.curSeriesType = newValue;
    console.log(this.curSeriesType);
    this.makeAPIRequest();
  }

  onSelectMSType(newValue: string) {
    for (let i = 0; i < this.msTypes.length; i++) {
      if (newValue == this.msTypes[i].id) {
        this.curMSType = this.msTypes[i];
        this.makeAPIRequest();
        break;
      }
    }
  }

  onSelectMetering(newValue: string) {
    for (let i = 0; i < this.meterings.length; i++) {
      if (newValue == this.meterings[i].id) {
        this.curMeteringType = this.meterings[i];
        this.makeAPIRequest();
        break;
      }
    }
  }

  onSelectTimeSpan() {
    console.log(this.tsDay, this.tsHour, this.tsMin, this.tsSecond);
    this.isTimeSpanValid = !(Number(this.tsDay) == 0 && Number(this.tsHour) == 0 && Number(this.tsMin) == 0 && Number(this.tsSecond) == 0);
    if (this.tsDay == '') this.tsDay = '0';
    if (this.tsHour == '') this.tsHour = '0';
    if (this.tsMin == '') this.tsMin = '0';
    if (this.tsSecond == '') this.tsSecond = '0';

    let i = 0, len = 0;

    len = this.tsHour.length;
    for (i = 0; i < 2 - len; i++) {
      this.tsHour = '0' + this.tsHour;
    }
    len = this.tsMin.length;
    for (i = 0; i < 2 - len; i++) {
      this.tsMin = '0' + this.tsMin;
    }
    len = this.tsSecond.length;
    for (i = 0; i < 2 - len; i++) {
      this.tsSecond = '0' + this.tsSecond;
    }

    this.timeSpan = `${this.tsDay}:${this.tsHour}:${this.tsMin}:${this.tsSecond}`;
    this.makeAPIRequest();
  }

  onChangeTimeSpanDay($event) {
    //validation of day
    let newValue = $event.target.value.trim();
    if (Number.isNaN(Number(newValue))) {
      this.tsDay = '0';
    } else {
      this.tsDay = newValue;
    }
    $event.target.value = this.tsDay;
  }

  onChangeTimeSpanHour($event) {
    //validation of Hour
    let newValue = $event.target.value.trim();
    if (Number.isNaN(Number(newValue))) {
      this.tsHour = '0';
    } else {
      if (newValue.length > 2) {
        this.tsHour = newValue.substr(0, 2);
      } else {
        this.tsHour = newValue;
      }
      if (Number(this.tsHour) > 23) {
        this.tsHour = '23';
      }
    }
    $event.target.value = this.tsHour;
  }

  onChangeTimeSpanMin($event) {
    //validation of Minute
    let newValue = $event.target.value.trim();
    if (Number.isNaN(Number(newValue))) {
      this.tsMin = '0';
    } else {
      if (newValue.length > 2) {
        this.tsMin = newValue.substr(0, 2);
      } else {
        this.tsMin = newValue;
      }
      if (Number(this.tsMin) > 59) {
        this.tsMin = '59';
      }
    }
    $event.target.value = this.tsMin;
  }

  onChangeTimeSpanSecond($event) {
    //validation of Second
    let newValue = $event.target.value.trim();
    if (Number.isNaN(Number(newValue))) {
      this.tsMin = '0';
    } else {
      if (newValue.length > 2) {
        this.tsSecond = newValue.substr(0, 2);
      } else {
        this.tsSecond = newValue;
      }
      if (Number(this.tsSecond) > 59) {
        this.tsSecond = '59';
      }
    }
    $event.target.value = this.tsSecond;
  }

  onChangeFromDate(fromDate: Date) {
    this.fromDate = fromDate;
    console.log(this.fromDate.toUTCString());
    this.makeAPIRequest();
  }

  onChangeToDate(toDate: Date) {
    this.toDate = toDate;
    this.makeAPIRequest();
  }

  onChangeNumberOf(newValue: Number) {
    this.numberOf = newValue;
  }

  onSelectNumberOf() {
    this.makeAPIRequest();
  }

  onChangeTimeSpan(timeSpan: string) {
    this.timeSpan = timeSpan;
  }

  onChangeStartDate(startDate: Date) {
    this.startDate = startDate;
    this.makeAPIRequest();
  }

  onChangeEndDate(endDate: Date) {
    this.endDate = endDate;
    this.makeAPIRequest();
  }


}
