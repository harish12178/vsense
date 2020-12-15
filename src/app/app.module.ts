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
import {MatRippleModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

import { MenuListItemComponent } from "./Layout/menu-list-item/menu-list-item.component";
import { NavService } from "./nav.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TopNavComponent } from "./Layout/top-nav/top-nav.component";
import { Dashboard1Component } from './Pages/Dashboard/dashboard1/dashboard1.component';
import { Dashboard2Component } from './Pages/Dashboard/dashboard2/dashboard2.component';
import { DeviceComponent } from './Pages/Master/device/device.component';
import { DeviceparamComponent } from './Pages/Master/deviceparam/deviceparam.component';
import { EquipmentComponent } from './Pages/Master/equipment/equipment.component';
import { LocationComponent } from './Pages/Master/location/location.component';
import { DeviceassignComponent } from './Pages/Master/deviceassign/deviceassign.component';
import { DeviceassignparamComponent } from './Pages/Master/deviceassignparam/deviceassignparam.component';
import { ExceptionComponent } from './Pages/Exception/exception/exception.component';
import {NotificationSnackBarComponent} from './Notifications/notification-snack-bar/notification-snack-bar.component';
import {InformationDialogComponent} from './Notifications/information-dialog/information-dialog.component';
import { LoginComponent } from './Auth/login/login.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { VsenseapiService } from './Services/vsenseapi.service';
import { NotificationService } from './Services/notification.service';
import { ExcelService } from './Services/excel.service';
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MasterService} from './Services/master.service';
import {AuthService} from './Services/auth.service';
import {AuthInterceptorService} from './Services/auth-interceptor.service';
import {MenuAppComponent} from './Pages/UME/menu-app/menu-app.component';
import {RoleComponent} from './Pages/UME/role/role.component';
import {UserComponent} from './Pages/UME/user/user.component';
import {NotificationDialogComponent} from './Notifications/notification-dialog/notification-dialog.component';
import {MenuUpdataionService} from './services/menu-update.service';
import {ForgetPasswordLinkDialogComponent} from './Auth/forget-password-link-dialog/forget-password-link-dialog.component';
import { WINDOW_PROVIDERS } from './window.providers';
import {ForgotPasswordComponent} from './Auth/forgot-password/forgot-password.component';
import {ChangePasswordDialogComponent} from './Auth/change-password-dialog/change-password-dialog.component';
import {ChangePasswordComponent} from './Auth/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuAppComponent,
    RoleComponent,
    UserComponent,
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
    InformationDialogComponent,
    NotificationDialogComponent,
    ForgetPasswordLinkDialogComponent,
    ForgotPasswordComponent,
    ChangePasswordDialogComponent,
    ChangePasswordComponent
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
    MatProgressSpinnerModule,
    MatRippleModule,
    Ng2SearchPipeModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [NavService,VsenseapiService,NotificationService,BnNgIdleService,
    ExcelService,DatePipe,MasterService,AuthService,AuthInterceptorService,MenuUpdataionService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent],
  entryComponents:[InformationDialogComponent,NotificationDialogComponent,
    ForgetPasswordLinkDialogComponent,ChangePasswordDialogComponent]
})
export class AppModule { }
