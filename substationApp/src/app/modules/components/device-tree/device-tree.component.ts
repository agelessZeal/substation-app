import {AfterViewInit, Component, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {} from '@angular/core';
import {TreeModel} from 'ng2-tree';
import * as treeSetting from './tree-setting';
import {HttpServiceHelper} from '../../../core/http/HttpServiceHelper';
import {environment} from '../../../../environments/environment';
import {NodeInfoService} from '../../../core/services/node-type.service';

//https://github.com/valor-software/ng2-tree/issues/299
//https://github.com/valor-software/ng2-tree/issues/316

@Component({
  selector: 'app-device-tree',
  templateUrl: './device-tree.component.html',
  styleUrls: ['./device-tree.component.css']
})

export class DeviceTreeComponent implements OnInit {

  @Input() accToken: string;
  @ViewChild('treeComponent') treeComponent;
  devTreeLoaded: boolean;
  //3 - make sure that tree object conforms to the TreeModel interface
  public tree: TreeModel = {
    value: 'All',
    id: 'all_1',
    settings: treeSetting.MyTreeSetting.settings,
    children: []
  };

  constructor(private httpService: HttpServiceHelper, private nodeInfoService: NodeInfoService) {
    this.devTreeLoaded = false;
  }

  ngOnInit() {
    let self = this;
    setTimeout(function () {
      self.loadTreeData(self.accToken);
    }, 500);

  }

  loadTreeData(token: string) {
    let self = this;
    this.httpService.httpPostRequest(token, environment.apiEndPoints.serverBaseURL + '/get_tree', null)
      .subscribe(res => {
        if (res.status == 'success') {
          let oopNodeController = self.treeComponent.getControllerByNodeId('all_1');
          for (let i = 0; i < res.data.length; i++) {
            oopNodeController.addChild(res.data[i]);
          }

          //Select Default Node
          oopNodeController.select();

        } else {
          if (res.data == 'Unauthorized') { //Refresh token, webpage
            alert('Token Expired, Please login again!');
            localStorage.clear();
            location.reload();
          } else {
            alert('No Data ' + JSON.stringify(res.data));
          }
        }
        self.devTreeLoaded = true;
      }, err => {
        console.error('Local API Error ', JSON.stringify(err));
        alert(JSON.stringify(err));
        self.devTreeLoaded = true;
      });
  }

  onDevItemClick($e) {
    let nodeType = $e.node.id.split('_')[0];
    let nodeId = $e.node.value;
    this.nodeInfoService.setNodeInfo(nodeType, nodeId);
  }

}
