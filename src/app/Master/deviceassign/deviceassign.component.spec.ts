import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceassignComponent } from './deviceassign.component';

describe('DeviceassignComponent', () => {
  let component: DeviceassignComponent;
  let fixture: ComponentFixture<DeviceassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
