import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { MasterService } from 'src/app/Services/master.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {
  subscription:Subscription;
  exceptions=[];
  dataSource=new BehaviorSubject<AbstractControl[]>([]);
  displayedColumns:string[]=["deviceid","location","exception","datetime"];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service:VsenseapiService,private _masterService:MasterService) { }

  ngOnInit(): void {
    this.service.emitChange("Exceptions");
    this.exceptions=JSON.parse(localStorage.getItem("exceptions"));
    this.dataSource.next(this.exceptions);
    this.subscription = interval(60000).subscribe((func => {
      this.exceptionpuller();
    }))
    //console.log(this.exceptions);
    const retrievedObject = localStorage.getItem('authorizationData');
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
    this.CreateAppUsage();
  }

  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'Exceptions';
    appUsage.UsageCount = 1;
    appUsage.CreatedBy = this.currentUserName;
    appUsage.ModifiedBy = this.currentUserName;
    this._masterService.CreateAppUsage(appUsage).subscribe(
      (data) => {
      },
      (err) => {
        console.error(err);
      }
    );
  }
  exceptionpuller(){
    this.exceptions=JSON.parse(localStorage.getItem("exceptions"));
    this.dataSource.next(this.exceptions);
  }

}
