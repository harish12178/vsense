import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Auth';
import { Dashboard1Component } from './Dashboard/dashboard1/dashboard1.component';
import { Dashboard2Component } from './Dashboard/dashboard2/dashboard2.component';
import { ExceptionComponent } from './Exception/exception/exception.component';
import { LoginComponent } from './login/login.component';
import { DeviceComponent } from './Master/device/device.component';
import { DeviceassignComponent } from './Master/deviceassign/deviceassign.component';
import { DeviceassignparamComponent } from './Master/deviceassignparam/deviceassignparam.component';
import { DeviceparamComponent } from './Master/deviceparam/deviceparam.component';
import { EquipmentComponent } from './Master/equipment/equipment.component';
import { LocationComponent } from './Master/location/location.component';

const routes: Routes = [
  {
    path:'dashboard',
    component:Dashboard1Component,
    canActivate: [AuthGuard]
  },
  {
    path:'devicedetails',
    component:Dashboard2Component,
    canActivate: [AuthGuard]
  },
  {
    path:'exceptions',
    component:ExceptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'masters',
    canActivate: [AuthGuard],
    children:[
      {
        path:'device',
        component:DeviceComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'deviceparam',
        component:DeviceparamComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'equipment',
        component:EquipmentComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'location',
        component:LocationComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'deviceassign',
        component:DeviceassignComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'deviceassignparam',
        component:DeviceassignparamComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
