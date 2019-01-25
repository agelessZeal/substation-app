import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeInfoService {

  private subject = new Subject<any>();

  public setNodeInfo(nodeType: string, nodeValue: string) {
    this.subject.next({type: nodeType, value: nodeValue});
  }

  clearNodeInfo() {
    this.subject.next();
  }

  getNodeInfo(): Observable<any> {
    return this.subject.asObservable();
  }
}
