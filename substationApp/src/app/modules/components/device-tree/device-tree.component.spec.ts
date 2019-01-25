import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTreeComponent } from './device-tree.component';

describe('DeviceTreeComponent', () => {
  let component: DeviceTreeComponent;
  let fixture: ComponentFixture<DeviceTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
