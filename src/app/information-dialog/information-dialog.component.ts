import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InformationDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public message: string,
    public dialogRef: MatDialogRef<InformationDialogComponent>,
  ) { }

  ngOnInit(): void {

  }
  YesClicked(): void {
    this.dialogRef.close(true);
  }
  CloseClicked(): void {
    this.dialogRef.close(false);
  }

}
