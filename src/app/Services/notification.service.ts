import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public snackbar:MatSnackBar) { }
  config:MatSnackBarConfig={
    duration:3000
  }
  config1:MatSnackBarConfig={
    duration:3000
  }
  success(msg){
    this.snackbar.open(msg,'',this.config);
  }
  update(msg){
    this.snackbar.open(msg,'',this.config1);
  }
}
