import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-deviceparam',
  templateUrl: './deviceparam.component.html',
  styleUrls: ['./deviceparam.component.css']
})
export class DeviceparamComponent implements OnInit {
  devices=[];isCreate=false;
  deviceparams=[];

  constructor(public service:VsenseapiService,public notification:NotificationService,private fb:FormBuilder) { }

  mform=this.fb.group({
    deviceID:[null],
    paramID:[null],
    title:[null],
    unit:[null],
    longText:[null],
    max:[null],
    min:[null],
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
  }
  getdeviceparams(){
    this.service.getalldeviceparams().subscribe((data: any[])=>{
      this.deviceparams=data;
      this.getselected(this.deviceparams[0].deviceID);
    }) 
  }
  getselected(name:string){
    for(var i in this.deviceparams){
      if(this.deviceparams[i].deviceID==name){
        this.mform.controls.deviceID.setValue(this.deviceparams[i].deviceID);
        this.mform.controls.paramID.setValue(this.deviceparams[i].paramID);
        this.mform.controls.title.setValue(this.deviceparams[i].title);
        this.mform.controls.unit.setValue(this.deviceparams[i].unit);
        this.mform.controls.longText.setValue(this.deviceparams[i].longText);
        this.mform.controls.max.setValue(this.deviceparams[i].max);
        this.mform.controls.min.setValue(this.deviceparams[i].min);
        this.mform.controls.icon.setValue(this.deviceparams[i].icon);
        this.mform.controls.isPercentage.setValue(this.deviceparams[i].isPercentage);
        this.mform.controls.color.setValue(this.deviceparams[i].color);
        this.mform.controls.isEnabled.setValue(this.deviceparams[i].isEnabled);
        this.mform.controls.createdOn.setValue(this.deviceparams[i].createdOn);
        this.mform.controls.createdBy.setValue(this.deviceparams[i].createdBy);
        this.mform.controls.modifiedOn.setValue(this.deviceparams[i].modifiedOn);
        this.mform.controls.modifiedBy.setValue(this.deviceparams[i].modifiedBy);
        this.isCreate=false;
        break;
      }
    }
  }
  handle_delete(){
    this.service.deletedeviceparam(this.mform.controls.paramID.value).subscribe((data:any[])=>{
      console.log(data);
      this.notification.success("Parameter Deleted");
      this.getdeviceparams();
      this.mform.reset();
      this.reset_form();
    })
  }
  handle_update(){
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
    this.isCreate=true;
    this.mform.reset();
    this.reset_form();
  }
  handle_clear(){
    this.mform.reset();
    this.reset_form();
  }
  handle_create(){
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
    this.notification.success("parameter already exists for the device");
  }
}
