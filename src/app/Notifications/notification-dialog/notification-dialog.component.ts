import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from './dialog-data';

@Component({
  selector: 'notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationDialogComponent implements OnInit {
  // public dialogData: DialogData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
  ) {

  }

  ngOnInit(): void {

  }
  YesClicked(): void {
    this.dialogRef.close(true);
  }

  CloseClicked(): void {
    this.dialogRef.close(false);
  }

}
