import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';
import { MasterService } from 'src/app/Services/master.service';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-deviceassign',
  templateUrl: './deviceassign.component.html',
  styleUrls: ['./deviceassign.component.css']
})
export class DeviceassignComponent implements OnInit {
  devices=[];isCreate=false;
  equipments=[];
  locations=[];
  deviceassignments=[];
  searchText="";
  selectID;

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service:VsenseapiService,public notification:NotificationService,
    private fb:FormBuilder,
    private _masterService:MasterService) { }

  mform=this.fb.group({
    assignmentID:[null],
    deviceID:[null,Validators.required],
    equipmentID:[null,Validators.required],
    stDateTime:[null,Validators.required],
    enDateTime:[new Date("12/31/9999")],
    frequency:[null,Validators.required],
    locID:[null,Validators.required],
    isEnabled:[null],
    createdOn:[null],
    createdBy:[null],
    modifiedOn:[null],
    modifiedBy:[null]
  })
  reset_form(){
    this.mform.setValue({
      assignmentID:null,
      deviceID:null,
      equipmentID:null,
      stDateTime:null,
      enDateTime: new Date("12/31/9999"),
      frequency:null,
      locID:null,
      isEnabled:null,
      createdOn:null,
      createdBy:null,
      modifiedOn:null,
      modifiedBy:null
    })}
  ngOnInit(): void {
    this.service.emitChange("DAssign");
    this.getdeviceassigns();
    this.service.getalldevices().subscribe((data:any[])=>{
      this.devices=data;
    })
    this.service.getallequipments().subscribe((data:any[])=>{
      this.equipments=data;
      // console.log(this.equipments);
    })
    this.service.getalllocs().subscribe((data:any[])=>{
      this.locations=data;
      // console.log(this.locations);
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
  appUsage.AppName = 'DAssign';
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
  getdeviceassigns(){
    this.service.getalldeviceassigns().subscribe((data: any[])=>{
      this.deviceassignments=data;
      this.getselected(this.deviceassignments[0]);
    }) 
  }
  getselected(item){
    this.selectID=item.assignmentID;
        this.isCreate=false;
        this.mform.controls.assignmentID.setValue(item.assignmentID);
        this.mform.controls.deviceID.setValue(item.deviceID);
        this.mform.controls.equipmentID.setValue(item.equipmentID);
        this.mform.controls.stDateTime.setValue(item.stDateTime);
        this.mform.controls.enDateTime.setValue(item.enDateTime);
        this.mform.controls.frequency.setValue(item.frequency);
        this.mform.controls.locID.setValue(item.locID);
        this.mform.controls.isEnabled.setValue(item.isEnabled);
        this.mform.controls.createdOn.setValue(item.createdOn);
        this.mform.controls.createdBy.setValue(item.createdBy);
        this.mform.controls.modifiedOn.setValue(item.modifiedOn);
        this.mform.controls.modifiedBy.setValue(item.modifiedBy);
  }
  handle_delete(){
    this.service.deletedeviceassign(this.mform.controls.assignmentID.value).subscribe((data:any[])=>{
      console.log(data);
     this.notification.success("Device Assignment Deleted");
     this.getdeviceassigns();
     this.mform.reset();
     this.reset_form();
    })
  }
  handle_update(){
    this.mform.controls.modifiedBy.setValue(this.currentUserName);
    this.service.updatedeviceassign(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Updated Successfully");
      this.getdeviceassigns();
      // this.deviceassignment=this.empty;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
  }
  create(){
    this.isCreate=true;
    this.selectID=null;
    this.mform.reset();
    this.reset_form();
  }
  handle_clear(){
    this.mform.reset();
    this.reset_form();
  }
  handle_create(){
    if(this.mform.valid){
      this.mform.controls.assignmentID.setValue(undefined);
    this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
    this.mform.controls.createdBy.setValue(this.currentUserName);
    console.log(this.mform.value);
    this.service.createdeviceassign(this.mform.value).subscribe((data:any[])=>{
      this.notification.success("Created Successfully");
      this.getdeviceassigns();
      this.isCreate=false;
    },
    (error)=>{
      this.notification.success("Something went wrong");
    })
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
