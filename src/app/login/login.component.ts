import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../Services/authentication.service';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';
import{SnackBarStatus} from '../notification-snack-bar/notification-snackbar-status-enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VsenseapiService } from '../Services/vsenseapi.service';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
notificationSnackBarComponent: NotificationSnackBarComponent;
  loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private snackBar:MatSnackBar,
        private service:VsenseapiService
        
    ) { 
        
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

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from route parameters or default to '/'
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
                    this.notificationSnackBarComponent.openSnackBar(
                        "Logged in successfully",
                        SnackBarStatus.success
                    );
                    
                    this.router.navigate([returnUrl]);
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        error instanceof Object
                            ? "Something went wrong"
                            : error,
                        SnackBarStatus.danger
                    );
                }
            });
    }

}


