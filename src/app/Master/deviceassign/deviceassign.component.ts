import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';

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

  constructor(public service:VsenseapiService,public notification:NotificationService,private fb:FormBuilder) { }

  mform=this.fb.group({
    assignmentID:[null],
    deviceID:[null,Validators.required],
    equipmentID:[null,Validators.required],
    stDateTime:[null],
    enDateTime:[new Date("12/31/9999")],
    frequency:[null],
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
  }
  getdeviceassigns(){
    this.service.getalldeviceassigns().subscribe((data: any[])=>{
      this.deviceassignments=data;
      this.getselected(this.deviceassignments[0].assignmentID);
    }) 
  }
  getselected(name:string){
    for(var i in this.deviceassignments){
      if(this.deviceassignments[i].assignmentID==name){
        this.isCreate=false;
        this.mform.controls.assignmentID.setValue(this.deviceassignments[i].assignmentID);
        this.mform.controls.deviceID.setValue(this.deviceassignments[i].deviceID);
        this.mform.controls.equipmentID.setValue(this.deviceassignments[i].equipmentID);
        this.mform.controls.stDateTime.setValue(this.deviceassignments[i].stDateTime);
        this.mform.controls.enDateTime.setValue(this.deviceassignments[i].enDateTime);
        this.mform.controls.frequency.setValue(this.deviceassignments[i].frequency);
        this.mform.controls.locID.setValue(this.deviceassignments[i].locID);
        this.mform.controls.isEnabled.setValue(this.deviceassignments[i].isEnabled);
        this.mform.controls.createdOn.setValue(this.devices[i].createdOn);
        this.mform.controls.createdBy.setValue(this.devices[i].createdBy);
        this.mform.controls.modifiedOn.setValue(this.devices[i].modifiedOn);
        this.mform.controls.modifiedBy.setValue(this.devices[i].modifiedBy);
        break;
      }
    }
  }
  handle_delete(){
    this.service.deletedeviceassign(this.mform.controls.deviceID.value).subscribe((data:any[])=>{
      console.log(data);
     this.notification.success("Device Assignment Deleted");
     this.getdeviceassigns();
     this.mform.reset();
     this.reset_form();
    })
  }
  handle_update(){
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
    this.mform.reset();
    this.reset_form();
  }
  handle_clear(){
    this.mform.reset();
    this.reset_form();
  }
  handle_create(){
    this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
    this.service.createdeviceassign(this.mform.value).subscribe((data:any[])=>{
      this.notification.success("Created Successfully");
      this.getdeviceassigns();
      this.isCreate=false;
    },
    (error)=>{
      this.notification.success("Something went wrong");
    })
  }

}
