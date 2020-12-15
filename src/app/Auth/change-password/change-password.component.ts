import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangePassword, AuthenticationDetails } from 'src/app/Models/master';
import { NotificationSnackBarComponent } from 'src/app/Notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'src/app/Notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthService } from 'src/app/Services/auth.service';
import { CustomValidator } from 'src/app/Services/custom-validator';
import {fuseAnimations} from 'src/app/animations';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChangePasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  changePassword: ChangePassword;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    // Set the private defaults
  }

  ngOnInit(): void {
    this._authService.islogin(true);
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    } else {
      this._router.navigate(['login']);
    }

    this.resetPasswordForm = this._formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required,
      Validators.pattern('(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', [Validators.required, CustomValidator.confirmPasswordValidator]]
    });


  }

  ResetControl(): void {
    this.resetPasswordForm.get('currentPassword').patchValue('');
    this.resetPasswordForm.get('newPassword').patchValue('');
    this.resetPasswordForm.get('confirmPassword').patchValue('');
    this.changePassword = null;
    this.resetPasswordForm.reset();
    this.resetPasswordForm.markAsUntouched();
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      // control.setErrors(null);
      // this.menuAppMainFormGroup.get(key).markAsUntouched();
      // this.menuAppMainFormGroup.get(key).updateValueAndValidity();
      // console.log(this.menuAppMainFormGroup.get(key).setErrors(Validators.required)
    });

  }

  ChangePasswordClick(): void {
    if (this.resetPasswordForm.valid) {
      this.IsProgressBarVisibile = true;
      this.changePassword = new ChangePassword();
      this.changePassword.UserID = this.authenticationDetails.UserID;
      this.changePassword.UserName = this.authenticationDetails.UserName;
      this.changePassword.CurrentPassword = this.resetPasswordForm.get('currentPassword').value;
      this.changePassword.NewPassword = this.resetPasswordForm.get('newPassword').value;
      this._authService.ChangePassword(this.changePassword).subscribe(
        (data) => {
          this.ResetControl();
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Password changed successfully', SnackBarStatus.success);
          this._router.navigate(['/login']);
        },
        (err) => {
          this.IsProgressBarVisibile = false;
          console.error(err);
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
    }
    else {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.get(key).markAsDirty();
      });
    }
  }

}

