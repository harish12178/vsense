import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';
import { MasterService } from 'src/app/Services/master.service';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-deviceparam',
  templateUrl: './deviceparam.component.html',
  styleUrls: ['./deviceparam.component.css']
})
export class DeviceparamComponent implements OnInit {
  devices=[];isCreate=false;
  deviceparams=[];
  searchText="";
  selectID1;
  selectID2;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service:VsenseapiService,
    public notification:NotificationService,
    private fb:FormBuilder,private _masterService:MasterService) { }

  mform=this.fb.group({
    deviceID:[null,Validators.required],
    paramID:[null,Validators.required],
    title:[null,Validators.required],
    unit:[null,Validators.required],
    longText:[null],
    max:[null,Validators.required],
    min:[null,Validators.required],
    icon:[null],
    isPercentage:[null],
    color:[null],
    isEnabled:[null],
    createdOn:[null],
    createdBy:[null],
    modifiedOn:[null],
    modifiedBy:[null]
  })
  reset_form(){
    this.mform.setValue({
      deviceID:null,
      paramID:null,
      title:null,
      unit:null,
      longText:null,
      max:null,
      min:null,
      icon:null,
      isPercentage:null,
      color:null,
      isEnabled:null,
      createdOn:null,
      createdBy:null,
      modifiedOn:null,
      modifiedBy:null
    })}
  ngOnInit(): void {
    this.service.emitChange("DParam");
    this.getdeviceparams();
    this.service.getalldevices().subscribe((data:any[])=>{
      this.devices=data;
    })
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
  appUsage.AppName = 'DParam';
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
  getdeviceparams(){
    this.service.getalldeviceparams().subscribe((data: any[])=>{
      this.deviceparams=data;
      this.getselected(this.deviceparams[0]);
    }) 
  }
  getselected(item){
    this.selectID1=item.deviceID;
    this.selectID2=item.paramID;
        this.mform.controls.deviceID.setValue(item.deviceID);
        this.mform.controls.paramID.setValue(item.paramID);
        this.mform.controls.title.setValue(item.title);
        this.mform.controls.unit.setValue(item.unit);
        this.mform.controls.longText.setValue(item.longText);
        this.mform.controls.max.setValue(item.max);
        this.mform.controls.min.setValue(item.min);
        this.mform.controls.icon.setValue(item.icon);
        this.mform.controls.isPercentage.setValue(item.isPercentage);
        this.mform.controls.color.setValue(item.color);
        this.mform.controls.isEnabled.setValue(item.isEnabled);
        this.mform.controls.createdOn.setValue(item.createdOn);
        this.mform.controls.createdBy.setValue(item.createdBy);
        this.mform.controls.modifiedOn.setValue(item.modifiedOn);
        this.mform.controls.modifiedBy.setValue(item.modifiedBy);
        this.isCreate=false;
  }
  handle_delete(){
    this.service.deletedeviceparam(this.selectID1,this.selectID2).subscribe((data:any[])=>{
      console.log(data);
      this.notification.success("Parameter Deleted");
      this.getdeviceparams();
      this.mform.reset();
      this.reset_form();
    })
  }
  handle_update(){
    this.mform.controls.modifiedBy.setValue(this.currentUserName);
    // console.log(this.mform.value);
    this.service.updatedeviceparam(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Updated Successfully");
      this.getdeviceparams();
      // this.deviceparam=this.empty;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
  }
  create(){
    this.selectID1=null;
    this.selectID2=null;
    this.isCreate=true;
    this.mform.reset();
    this.reset_form();
  }
  handle_clear(){
    this.mform.reset();
    this.reset_form();
  }
  handle_create(){
    if(this.mform.valid){
      let d=this.mform.value;
      let isexist=false;
      for(var i in this.deviceparams){
        if(this.deviceparams[i].deviceID==d.deviceID && this.deviceparams[i].paramID==d.paramID){
          isexist=true;
          break;
        }
      }
      if(!isexist){
        this.mform.controls.isEnabled.setValue(true);
      this.mform.controls.createdOn.setValue(new Date());
      this.mform.controls.createdBy.setValue(this.currentUserName);
      this.service.createdeviceparam(this.mform.value).subscribe((data:any[])=>{
        // console.log(data);
        this.notification.success("Created Successfully");
        this.getdeviceparams();
        this.isCreate=false;
      },
      (error)=>{
        this.notification.success("something went wrong");
      })
      }
      else{
        this.notification.success("parameter already exists for the device");
      }
    }
    else{
      this.ShowValidationErrors();
    }

  }
  ShowValidationErrors(): void {
    Object.keys(this.mform.controls).forEach(key => {
      this.mform.get(key).markAsTouched();
      this.mform.get(key).markAsDirty();
    });
  }
}
