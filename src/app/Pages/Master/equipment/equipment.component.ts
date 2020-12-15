import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';
import { MasterService } from 'src/app/Services/master.service';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  equipments=[];isCreate=false;
  searchText="";
  selectID;

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service:VsenseapiService,
    public notification:NotificationService,
    private fb:FormBuilder,private _masterService:MasterService) { }

  mform=this.fb.group({
    equipmentID:[null,Validators.required],
    text:[null,Validators.required],
    geoLoc:[null],
    plant:[null],
    workcenter:[null],
    isEnabled:[null],
    createdOn:[null],
    createdBy:[null],
    modifiedOn:[null],
    modifiedBy:[null]
  })
  reset_form(){
    this.mform.setValue({
      equipmentID:null,
      text:null,
      geoLoc:null,
      plant:null,
      workcenter:null,
      isEnabled:null,
      createdOn:null,
      createdBy:null,
      modifiedOn:null,
      modifiedBy:null
    })}
  ngOnInit(): void {
    this.service.emitChange("Equipment");
    this.getequipments();
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
  appUsage.AppName = 'Equipment';
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
  getequipments(){
    this.service.getallequipments().subscribe((data: any[])=>{
      this.equipments=data;
      this.getselected(this.equipments[0]);
    }) 
  }
  getselected(item){
    this.selectID=item.equipmentID;
        this.mform.controls.equipmentID.setValue(item.equipmentID);
        this.mform.controls.text.setValue(item.text);
        this.mform.controls.geoLoc.setValue(item.geoLoc);
        this.mform.controls.plant.setValue(item.plant);
        this.mform.controls.workcenter.setValue(item.workcenter);
        this.mform.controls.isEnabled.setValue(item.isEnabled);
        this.mform.controls.createdOn.setValue(item.createdOn);
        this.mform.controls.createdBy.setValue(item.createdBy);
        this.mform.controls.modifiedOn.setValue(item.modifiedOn);
        this.mform.controls.modifiedBy.setValue(item.modifiedBy);
        this.isCreate=false;
  }
  handle_delete(){
    this.service.deleteequipment(this.mform.controls.equipmentID.value).subscribe((data:any[])=>{
      console.log(data);
      this.notification.success("Equipment Deleted");
      this.getequipments();
      this.mform.reset();
      this.reset_form();
    })
  }
  handle_update(){
    this.mform.controls.modifiedBy.setValue(this.currentUserName);
    this.service.updateequipment(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Updated Successfully");
      this.getequipments();
      // this.equipment=this.empty;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
  }
  create(){
    this.selectID=null;
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
    for(var i in this.equipments){
      if(this.equipments[i].equipmentID==d.equipmentID){
        isexist=true;
        break;
      }
    }
    if(!isexist){
      this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
    this.mform.controls.createdBy.setValue(this.currentUserName);
    this.service.createequipment(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Created Successfully");
      this.getequipments();
      this.isCreate=false;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
    }
    else{
      this.notification.success("equipment already exists");
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
