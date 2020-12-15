import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Guid } from 'guid-typescript';
import {  interval,Subscription  } from 'rxjs';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { ExcelService } from 'src/app/Services/excel.service';
import { MasterService } from 'src/app/Services/master.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
  deviceparams = []; temperature=30;device;
  equipment; equipmentid;
  subscription:Subscription
  data = [];
  dummy;dummy1;
  alert_count=[];
  batteryCondition:string;
  healthCondition:string;
  currentdassign;

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service: VsenseapiService,private excelservice:ExcelService,
    private datepipe:DatePipe,private _masterService:MasterService) {}

  datapuller(){
    this.data.forEach(passign => {
        this.service.getdevicelog(this.device.deviceID,passign.pramID).subscribe(res => {
          var current_log;
          current_log=res;
          if((current_log.value>passign.max || current_log.value<passign.min) && passign.log.logID!=current_log.logID){
            passign.alert_count+=1;
          }
          passign.log=current_log;
        });
    });
    
  }
  ngOnInit(): void {
    this.service.emitChange("Device Details");
    this.currentdassign=JSON.parse(localStorage.getItem('assignment'));
    this.equipment=this.currentdassign.equipment;
    this.getcurrentdevice();
    this.getallparamdetails();
    
    this.subscription = interval(15000).subscribe((func => {
      this.datapuller();
    }))
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
    appUsage.AppName = 'Device Details';
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

  getallparamdetails(){
      this.service.getalldeviceassignparams().subscribe(res => {
        this.deviceparams = res;
        for (var i in this.deviceparams) {
          if(this.deviceparams[i].assignmentID==this.currentdassign.assignmentID){
            let passign=this.deviceparams[i];
            this.service.getdevicelog(this.device.deviceID,passign.pramID).subscribe(res => {
              passign.log=res;
              passign.alert_count=0;
              if(passign.log.value>passign.max || passign.log.value<passign.min){
                passign.alert_count+=1;
              }
            },
            (err)=>{
              const emptylog={value:0};
              passign.alert_count=0;
              passign.log=emptylog;
            });
            console.log(passign);
            this.data.push(passign);
          }   
        }
      }); 
  }

  getcurrentdevice(){
    this.device=this.currentdassign.device;
      if(this.device.battery>=70){
        this.batteryCondition="Good";
      }
      else if(this.device.battery<70 && this.device.battery>=30){
        this.batteryCondition="Okay";
      }
      else if(this.device.battery<30 && this.device.battery>=10){
        this.batteryCondition="Bad";
      }
      else{
        this.batteryCondition="Worse";
      }
      if(this.device.healthy>=70){
        this.healthCondition="Good";
      }
      else if(this.device.healthy<70 && this.device.healthy>=30){
        this.healthCondition="Okay";
      }
      else if(this.device.healthy<30 && this.device.healthy>=10){
        this.healthCondition="Bad";
      }
      else{
        this.healthCondition="Worse";
      }
  }
  downloadToExcel(){
    var array=[];
    this.data.forEach(x => {
      let device={
        deviceID:this.device.deviceID,
        deviceName:this.device.name,
        paramName:x.device_Assign_Param.title,
        equipmentID:this.equipment.equipmentID,
        equipmentName:this.equipment.text,
        locationID:x.device_Assign_Param.device_assign.locID,
        locationName:x.device_Assign_Param.device_assign.location.lcoationText,
        softwareVersion:this.device.softwareVersion,
        Vcc:this.device.vcc,
        Battery:this.device.battery,
        Healthy:this.device.healthy,
        PutToUseDate:this.datepipe.transform(this.device.puttoUse, 'dd-MM-yyyy')
      }
      array.push(device);
    });
    this.excelservice.exportAsExcelFile(array,this.device.deviceID);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
