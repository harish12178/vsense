import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from 'src/app/animations';
import { EMailModel } from 'src/app/Models/master';
import { NotificationSnackBarComponent } from 'src/app/Notifications/notification-snack-bar/notification-snack-bar.component';
import { WINDOW } from 'src/app/window.providers';

@Component({
  selector: 'app-forget-password-link-dialog',
  templateUrl: './forget-password-link-dialog.component.html',
  styleUrls: ['./forget-password-link-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ForgetPasswordLinkDialogComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  Origin: string;
  emailModel: EMailModel;
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(
    public matDialogRef: MatDialogRef<ForgetPasswordLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    @Inject(WINDOW) private window: Window

  ) {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
      // UserName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // if (isDevMode()) {
    //   this.Origin = this.window.location.origin;
    // } else {
    //   this.Origin = this.window.location.origin;
    // }
    this.Origin = this.window.location.origin;
  }
  YesClicked(): void {
    if (this.forgotPasswordForm.valid) {
      this.emailModel = new EMailModel();
      this.emailModel.EmailAddress = this.forgotPasswordForm.get('email').value;
      // this.emailModel.UserName = this.forgotPasswordForm.get('UserName').value;
      // const Origin = (this._platformLocation as any).location.origin;
      this.emailModel.siteURL = `${this.Origin}/vsense/#/forgotPassword`;
      this.matDialogRef.close(this.emailModel);

    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key).markAsTouched();
        this.forgotPasswordForm.get(key).markAsDirty();
      });

    }
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }

}
