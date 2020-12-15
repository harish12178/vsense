import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/Services/master.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MenuApp, AuthenticationDetails } from 'src/app/Models/master';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { NotificationDialogComponent } from 'src/app/Notifications/notification-dialog/notification-dialog.component';
import { NotificationSnackBarComponent } from 'src/app/Notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'src/app/Notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'menu-app',
  templateUrl: './menu-app.component.html',
  styleUrls: ['./menu-app.component.scss'],
})
export class MenuAppComponent implements OnInit {
  menuItems: string[];
  selectedMenuApp: MenuApp;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  selectID: number;
  menuAppMainFormGroup: FormGroup;
  searchText = '';
  AllMenuApps: MenuApp[] = [];
  constructor(
    private _masterService: MasterService,
    public service:VsenseapiService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder) {
    this.selectedMenuApp = new MenuApp();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = true;
  }

  ngOnInit(): void {
    this.service.emitChange("App");
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.menuItems.indexOf('User') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['login']);
      }
      this.menuAppMainFormGroup = this._formBuilder.group({
        appName: ['', Validators.required]
      });
      this.GetAllMenuApps();
    } else {
      this._router.navigate(['login']);
    }

  }
  ResetControl(): void {
    this.selectedMenuApp = new MenuApp();
    this.selectID = 0;
    this.menuAppMainFormGroup.reset();
    Object.keys(this.menuAppMainFormGroup.controls).forEach(key => {
      this.menuAppMainFormGroup.get(key).markAsUntouched();
    });
    // this.fileToUpload = null;
  }
  GetAllMenuApps(): void {
    this.isProgressBarVisibile = true;
    this._masterService.GetAllMenuApp().subscribe(
      (data) => {
        this.isProgressBarVisibile = false;
        this.AllMenuApps = <MenuApp[]>data;
        if (this.AllMenuApps && this.AllMenuApps.length) {
          this.loadSelectedMenuApp(this.AllMenuApps[0]);
        }
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedMenuApp(selectedMenuApp: MenuApp): void {
    this.selectID = selectedMenuApp.AppID;
    this.selectedMenuApp = selectedMenuApp;
    this.SetMenuAppValues();
  }

  SetMenuAppValues(): void {
    this.menuAppMainFormGroup.get('appName').patchValue(this.selectedMenuApp.AppName);
  }

  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Create') {
            this.CreateMenuApp();
          } else if (Actiontype === 'Update') {
            this.UpdateMenuApp();
          } else if (Actiontype === 'Delete') {
            this.DeleteMenuApp();
          }
        }
      });
  }

  GetMenuAppValues(): void {
    this.selectedMenuApp.AppName = this.menuAppMainFormGroup.get('appName').value;
  }

  CreateMenuApp(): void {
    this.GetMenuAppValues();
    this.selectedMenuApp.CreatedBy = this.authenticationDetails.UserID.toString();
    this.isProgressBarVisibile = true;
    this._masterService.CreateMenuApp(this.selectedMenuApp).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('MenuApp created successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetAllMenuApps();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );

  }

  UpdateMenuApp(): void {
    this.GetMenuAppValues();
    this.selectedMenuApp.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.isProgressBarVisibile = true;
    this._masterService.UpdateMenuApp(this.selectedMenuApp).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('MenuApp updated successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetAllMenuApps();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  DeleteMenuApp(): void {
    this.GetMenuAppValues();
    this.selectedMenuApp.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.isProgressBarVisibile = true;
    this._masterService.DeleteMenuApp(this.selectedMenuApp).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('MenuApp deleted successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetAllMenuApps();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  ShowValidationErrors(): void {
    Object.keys(this.menuAppMainFormGroup.controls).forEach(key => {
      this.menuAppMainFormGroup.get(key).markAsTouched();
      this.menuAppMainFormGroup.get(key).markAsDirty();
    });

  }

  SaveClicked(): void {
    if (this.menuAppMainFormGroup.valid) {
      // const file: File = this.fileToUpload;
      if (this.selectedMenuApp.AppID) {
        const Actiontype = 'Update';
        const Catagory = 'MenuApp';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'MenuApp';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      }
    } else {
      this.ShowValidationErrors();
    }
  }

  DeleteClicked(): void {
    if (this.menuAppMainFormGroup.valid) {
      if (this.selectedMenuApp.AppID) {
        const Actiontype = 'Delete';
        const Catagory = 'MenuApp';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      }
    } else {
      this.ShowValidationErrors();
    }
  }
}

