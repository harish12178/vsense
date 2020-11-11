import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceassignparamComponent } from './deviceassignparam.component';

describe('DeviceassignparamComponent', () => {
  let component: DeviceassignparamComponent;
  let fixture: ComponentFixture<DeviceassignparamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceassignparamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceassignparamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
