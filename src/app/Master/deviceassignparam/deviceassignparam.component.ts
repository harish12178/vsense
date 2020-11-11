import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-deviceassignparam',
  templateUrl: './deviceassignparam.component.html',
  styleUrls: ['./deviceassignparam.component.css']
})
export class DeviceassignparamComponent implements OnInit {
  devices=[];isCreate=false;
  assignments=[];
  assignmentid=null;
  deviceID;
  deviceparamassignments=[];
  


  constructor(public service:VsenseapiService,public notification:NotificationService,private fb:FormBuilder) { }

  mform=this.fb.group({
    assignmentID:[null],
    pramID:[null],
    title:[null],
    unit:[null],
    longText:[null],
    max:[null],
    min:[null],
    icon:[null],
    soft_1_Exception_Threshold:[null],
    soft_2_Exception_Threshold:[null],
    hard_1_Exception_Threshold:[null],
    hard_2_Exception_Threshold:[null],
    activityGraphTitle:[null],
    isEnabled:[null],
    createdOn:[null],
    createdBy:[null],
    modifiedOn:[null],
    modifiedBy:[null]
  })
  reset_form(){
    this.mform.setValue({
      assignmentID:null,
      pramID:null,
      title:null,
      unit:null,
      longText:null,
      max:null,
      min:null,
      icon:null,
      soft_1_Exception_Threshold:null,
      soft_2_Exception_Threshold:null,
      hard_1_Exception_Threshold:null,
      hard_2_Exception_Threshold:null,
      activityGraphTitle:null,
      isEnabled:null,
      createdOn:null,
      createdBy:null,
      modifiedOn:null,
      modifiedBy:null
    })}
  ngOnInit(): void {
    this.service.emitChange("PAssign");
    this.getdeviceassignparams();
    this.service.getalldevices().subscribe((data:any[])=>{
      this.devices=data;
    })
    this.service.getalldeviceassigns().subscribe((data:any[])=>{
      this.assignments=data;
    })
  }
  getdeviceassignparams(){
    this.service.getalldeviceassignparams().subscribe((data: any[])=>{
      this.deviceparamassignments=data;
      this.getselected(this.deviceparamassignments[0].assignmentID);
    }) 
  }
  getselected(name:string){
    for(var i in this.deviceparamassignments){
      if(this.deviceparamassignments[i].assignmentID==name){
        this.deviceID=this.deviceparamassignments[i].device_assign.deviceID;
        this.assignmentid=name;
        this.mform.controls.assignmentID.setValue(this.deviceparamassignments[i].assignmentID);
        this.mform.controls.pramID.setValue(this.deviceparamassignments[i].pramID);
        this.mform.controls.title.setValue(this.deviceparamassignments[i].title);
        this.mform.controls.unit.setValue(this.deviceparamassignments[i].unit);
        this.mform.controls.longText.setValue(this.deviceparamassignments[i].longText);
        this.mform.controls.max.setValue(this.deviceparamassignments[i].max);
        this.mform.controls.min.setValue(this.deviceparamassignments[i].min);
        this.mform.controls.icon.setValue(this.deviceparamassignments[i].icon);
        this.mform.controls.soft_1_Exception_Threshold.setValue(this.deviceparamassignments[i].soft_1_Exception_Threshold);
        this.mform.controls.soft_2_Exception_Threshold.setValue(this.deviceparamassignments[i].soft_2_Exception_Threshold);
        this.mform.controls.hard_1_Exception_Threshold.setValue(this.deviceparamassignments[i].hard_1_Exception_Threshold);
        this.mform.controls.hard_2_Exception_Threshold.setValue(this.deviceparamassignments[i].hard_2_Exception_Threshold);
        this.mform.controls.activityGraphTitle.setValue(this.deviceparamassignments[i].activityGraphTitle);
        this.mform.controls.isEnabled.setValue(this.deviceparamassignments[i].isEnabled);
        this.mform.controls.createdOn.setValue(this.deviceparamassignments[i].createdOn);
        this.mform.controls.createdBy.setValue(this.deviceparamassignments[i].createdBy);
        this.mform.controls.modifiedOn.setValue(this.deviceparamassignments[i].modifiedOn);
        this.mform.controls.modifiedBy.setValue(this.deviceparamassignments[i].modifiedBy);
        this.isCreate=false;
        // console.log(this.mform.value);
        break;
        
      }
    }
    
  }
  handle_delete(){
    this.service.deletedeviceassignparam(this.mform.controls.pramID.value).subscribe((data:any[])=>{
      console.log(data);
     this.notification.success("Param Assignment Deleted");
     this.getdeviceassignparams();
     this.mform.reset();
     this.reset_form();
     this.deviceID=null;
    })
  }
  handle_update(){
    // this.service.createdeviceparam(this.deviceparamassignment).subscribe((data:any[])=>{
    //   console.log(data);
    //   this.notification.success("Updated");
    //   this.getdeviceassignparams();
    //   this.deviceparamassignment=this.empty;
    // })
    for(var i in this.assignments){
      if(this.assignments[i].deviceID==this.deviceID){
        this.assignmentid=this.assignments[i].assignmentID;
        break;
      }
    }
    // console.log(this.assignmentid);
    this.mform.controls.assignmentID.setValue(this.assignmentid);
     this.service.updatedeviceassignparam(this.mform.value).subscribe((data:any[])=>{
      this.notification.success("Updated Successfully");
      this.getdeviceassignparams();
      // this.deviceparamassignment=this.empty;
      // this.deviceID=null;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
    
  }
  create(){
    this.isCreate=true;
    this.mform.reset();
    this.reset_form();
    this.deviceID=null;
  }
  handle_clear(){
    this.mform.reset();
    this.reset_form();
    this.deviceID=null;
  }
  handle_create(){
    for(var i in this.assignments){
      if(this.assignments[i].deviceID==this.deviceID){
        this.assignmentid=this.assignments[i].assignmentID;
        break;
      }
    }
    // console.log(this.assignmentid);
    this.mform.controls.assignmentID.setValue(this.assignmentid);
    this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
     this.service.createdeviceassignparam(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Created Successfully");
      this.getdeviceassignparams();
      this.isCreate=false;
      // this.deviceID=null;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
  }

}
