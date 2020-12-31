import { Compiler, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    AuthenticationDetails,
    ChangePassword,
    EMailModel
} from "src/app/Models/master";
import { NavItem } from 'src/app/nav-item';
import { NotificationSnackBarComponent } from 'src/app/Notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'src/app/Notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthService } from 'src/app/Services/auth.service';
import { MenuUpdataionService } from 'src/app/services/menu-update.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { ForgetPasswordLinkDialogComponent } from '../forget-password-link-dialog/forget-password-link-dialog.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    children: NavItem[] = [];
    authenticationDetails: AuthenticationDetails;
    menuItems: string[] = [];
notificationSnackBarComponent: NotificationSnackBarComponent;
  loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    isProgressBarVisibile:boolean;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar:MatSnackBar,
        private service:VsenseapiService,
        private _authService:AuthService,
        private _menuUpdationService:MenuUpdataionService,
        public dialog: MatDialog,
        private _compiler:Compiler
        
    ) { 
        this._authService.islogin(true);
        this._compiler.clearCache();
        // redirect to home if already logged in
        localStorage.clear();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(
            this.snackBar
        );
    }

    ngOnInit() {
        this.service.emitChange("login");
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    loginClicked(): void {
        if (this.loginForm.valid) {
            this.loading = true;
            this._authService
                .login(
                    this.loginForm.get("username").value,
                    this.loginForm.get("password").value
                )
                .subscribe(
                    (data) => {
                        console.log(data);
                        const dat = data as AuthenticationDetails;
                        if (data.isChangePasswordRequired === "Yes") {
                            this.openChangePasswordDialog(dat);
                        } 
                        else {
                            this.saveUserDetails(dat);
                        }
                        this.loading = false;
                        // this._cookieService.put("key", this.Username);
                    },
                    (err) => {
                        this.loading = false;
                        console.error(err);
                        this.notificationSnackBarComponent.openSnackBar(
                            err instanceof Object
                                ? "Something went wrong"
                                : err,
                            SnackBarStatus.danger
                        );
                    }
                );
        } else {
            Object.keys(this.loginForm.controls).forEach((key) => {
                const abstractControl = this.loginForm.get(key);
                abstractControl.markAsDirty();
            });
        }
    }
    openChangePasswordDialog(data: AuthenticationDetails): void {
        const dialogConfig: MatDialogConfig = {
            data: null,
            panelClass: "change-password-dialog",
        };
        const dialogRef = this.dialog.open(
            ChangePasswordDialogComponent,
            dialogConfig
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const changePassword = result as ChangePassword;
                changePassword.UserID = data.UserID;
                changePassword.UserName = data.UserName;
                this._authService.ChangePassword(changePassword).subscribe(
                    (res) => {
                        // console.log(res);
                        // this.notificationSnackBarComponent.openSnackBar('Password updated successfully', SnackBarStatus.success);
                        this.notificationSnackBarComponent.openSnackBar(
                            "Password updated successfully, please log with new password",
                            SnackBarStatus.success
                        );
                        this.router.navigate(["/login"]);
                    },
                    (err) => {
                        this.notificationSnackBarComponent.openSnackBar(
                            err instanceof Object
                                ? "Something went wrong"
                                : err,
                            SnackBarStatus.danger
                        );
                        this.router.navigate(["/login"]);
                        console.error(err);
                    }
                );
            }
        });
    }

    openForgetPasswordLinkDialog(): void {
        const dialogConfig: MatDialogConfig = {
            data: null,
            panelClass: "forget-password-link-dialog",
        };
        const dialogRef = this.dialog.open(
            ForgetPasswordLinkDialogComponent,
            dialogConfig
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const emailModel = result as EMailModel;
                this.isProgressBarVisibile = true;
                this._authService.SendResetLinkToMail(emailModel).subscribe(
                    (data) => {
                        console.log(data);
                        this.notificationSnackBarComponent.openSnackBar(`Reset password link sent to ${emailModel.EmailAddress}`, SnackBarStatus.success);
                        // this.ResetControl();
                        this.isProgressBarVisibile = false;
                        // this._router.navigate(['auth/login']);
                    },
                    (err) => {
                        console.error(err);
                        this.isProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(
                            err instanceof Object
                                ? "Something went wrong"
                                : err,
                            SnackBarStatus.danger
                        );
                        console.error(err);
                    }
                );
            }
        });
    }
    saveUserDetails(data: AuthenticationDetails): void {
        localStorage.setItem("authorizationData", JSON.stringify(data));
        this.updateMenu();
        this.notificationSnackBarComponent.openSnackBar(
            "Logged in successfully",
            SnackBarStatus.success
        );
        if (data.UserRole === 'Administrator') {
          this.router.navigate(['ume/user']);
        } else {
          this.router.navigate(['dashboard']);
        }   
    }
    updateMenu(): void {
        const retrievedObject = localStorage.getItem("authorizationData");
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(
                retrievedObject
            ) as AuthenticationDetails;
            this.menuItems = this.authenticationDetails.MenuItemNames.split(",");
            // console.log(this.menuItems);
        }
        if (this.menuItems.indexOf("Home") >= 0) {
            this.children.push({
                displayName: "Home",
                iconName: "home",
                route: "dashboard"
            });
        }
        if (this.menuItems.indexOf("Exceptions") >= 0) {
            this.children.push({
                displayName: "Exceptions",
                iconName: "error",
                route: "exceptions"
            });
        }
        this.GetMasterMenus();
        this.GetAdminMenus();
        // Saving local Storage
        localStorage.setItem("menuItemsData", JSON.stringify(this.children));
        // Update the service in order to update menu
        this._menuUpdationService.PushNewMenus(this.children);
    }
    GetAdminMenus(): void {
        var subChildren: NavItem[] = [];
        if (this.menuItems.indexOf("App") >= 0) {
            subChildren.push({
                displayName: "App",
                iconName: "",
                route: "ume/app"
            });
        }
        if (this.menuItems.indexOf("Role") >= 0) {
            subChildren.push({
                displayName: "Role",
                iconName: "",
                route: "ume/role"
            });
        }
        if (this.menuItems.indexOf("User") >= 0) {
            subChildren.push({
                displayName: "User",
                iconName: "",
                route: "ume/user"
            });
        }
        if (
            this.menuItems.indexOf("App") >= 0 ||
            this.menuItems.indexOf("Role") >= 0 ||
            this.menuItems.indexOf("User") >= 0
        ) {
            this.children.push({
                displayName: "UME",
                iconName: "account_circle",
                route: "ume",
                children: subChildren
            });
        }
    }
    GetMasterMenus(): void {
        var subChildren: NavItem[] = [];
        if (this.menuItems.indexOf("Device") >= 0) {
            subChildren.push({
                displayName: "Device",
                iconName: "",
                route: "masters/device"
            });
        }
        if (this.menuItems.indexOf("DParam") >= 0) {
            subChildren.push({
                displayName: "DParam",
                iconName: "",
                route: "masters/deviceparam"
            });
        }
        if (this.menuItems.indexOf("Equipment") >= 0) {
            subChildren.push({
                displayName: "Equipment",
                iconName: "",
                route: "masters/equipment"
            });
        }
        if (this.menuItems.indexOf("Location") >= 0) {
            subChildren.push({
                displayName: "Location",
                iconName: "",
                route: "masters/location"
            });
        }
        if (this.menuItems.indexOf("DAssign") >= 0) {
            subChildren.push({
                displayName: "DAssign",
                iconName: "",
                route: "masters/deviceassign"
            });
        }
        if (this.menuItems.indexOf("DPAssign") >= 0) {
            subChildren.push({
                displayName: "DPAssign",
                iconName: "",
                route: "masters/deviceassignparam"
            });
        }
        if (
            this.menuItems.indexOf("Device") >= 0 ||
            this.menuItems.indexOf("DParam") >= 0 ||
            this.menuItems.indexOf("Equipment") >= 0 ||
            this.menuItems.indexOf("Location") >= 0 ||
            this.menuItems.indexOf("DAssign") >= 0 ||
            this.menuItems.indexOf("DPAssign") >= 0
        ) {
            this.children.push({
                displayName: "Masters",
                iconName: "school",
                route: "masters",
                children: subChildren
            });
        }
    }

}


