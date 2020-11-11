import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { ChartsModule } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import 'chartjs-plugin-labels';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { MenuListItemComponent } from "./menu-list-item/menu-list-item.component";
import { NavService } from "./nav.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TopNavComponent } from "./top-nav/top-nav.component";
import { Dashboard1Component } from './Dashboard/dashboard1/dashboard1.component';
import { Dashboard2Component } from './Dashboard/dashboard2/dashboard2.component';
import { DeviceComponent } from './Master/device/device.component';
import { DeviceparamComponent } from './Master/deviceparam/deviceparam.component';
import { EquipmentComponent } from './Master/equipment/equipment.component';
import { LocationComponent } from './Master/location/location.component';
import { DeviceassignComponent } from './Master/deviceassign/deviceassign.component';
import { DeviceassignparamComponent } from './Master/deviceassignparam/deviceassignparam.component';
import { ExceptionComponent } from './Exception/exception/exception.component';
import {NotificationSnackBarComponent} from './notification-snack-bar/notification-snack-bar.component';
import {InformationDialogComponent} from './information-dialog/information-dialog.component';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor, ErrorInterceptor } from './Auth';
import { UserService } from './Services/user.service';
import { AuthenticationService } from './Services/authentication.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { VsenseapiService } from './Services/vsenseapi.service';
import { NotificationService } from './Services/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuListItemComponent,
    TopNavComponent,
    AppComponent,
    NotificationSnackBarComponent,
    Dashboard2Component,
    Dashboard1Component,
    DeviceComponent,
    DeviceparamComponent,
    EquipmentComponent,
    LocationComponent,
    DeviceassignComponent,
    DeviceassignparamComponent,
    ExceptionComponent,
    LoginComponent,
    InformationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    HttpClientModule,
    MatTableModule,
    MatProgressBarModule,
    MatGridListModule,
    ChartsModule,
    GaugeModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [NavService,VsenseapiService,NotificationService,UserService,AuthenticationService,BnNgIdleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents:[InformationDialogComponent]
})
export class AppModule { }
