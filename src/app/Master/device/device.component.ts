import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  devices=[];
  isCreate=false;
  searchText="";

  constructor(public service:VsenseapiService,public notification:NotificationService,private fb:FormBuilder) { }

  mform=this.fb.group({
    deviceID:[null,Validators.required],
    name:[null,Validators.required],
    purpose:[null],
    puttoUse:[null,Validators.required],
    battery:[null,Validators.required],
    healthy:[null,Validators.required],
    softwareVersion:[null],
    vcc:[null,Validators.required],
    lifespan:[null,Validators.required],
    isEnabled:[null],
    createdOn:[null],
    createdBy:[null],
    modifiedOn:[null],
    modifiedBy:[null]
  })
  ngOnInit(): void {
    this.service.emitChange("Device");
    this.getdevices();
  }
  getdevices(){
    this.service.getalldevices().subscribe((data: any[])=>{
      this.devices=data;
      this.getselected(this.devices[0].deviceID);
    }) 
  }
  handle_delete(){
    this.service.deletedevice(this.mform.controls.deviceID.value).subscribe((data:any[])=>{
       console.log(data);
      this.notification.success("Device Deleted");
      this.getdevices();
      this.mform.reset();
      this.reset_form();
   })
  }
  handle_update(){
    this.service.updatedevice(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Updated Successfully");
      this.getdevices();
      // this.device=this.empty;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
  }
  getselected(name:string){
    for(var i in this.devices){
      if(this.devices[i].deviceID==name){
        this.isCreate=false;
        this.mform.controls.deviceID.setValue(this.devices[i].deviceID);
        this.mform.controls.name.setValue(this.devices[i].name);
        this.mform.controls.purpose.setValue(this.devices[i].purpose);
        this.mform.controls.puttoUse.setValue(this.devices[i].puttoUse);
        this.mform.controls.battery.setValue(this.devices[i].battery);
        this.mform.controls.healthy.setValue(this.devices[i].healthy);
        this.mform.controls.softwareVersion.setValue(this.devices[i].softwareVersion);
        this.mform.controls.vcc.setValue(this.devices[i].vcc);
        this.mform.controls.lifespan.setValue(this.devices[i].lifespan);
        this.mform.controls.isEnabled.setValue(this.devices[i].isEnabled);
        this.mform.controls.createdOn.setValue(this.devices[i].createdOn);
        this.mform.controls.createdBy.setValue(this.devices[i].createdBy);
        this.mform.controls.modifiedOn.setValue(this.devices[i].modifiedOn);
        this.mform.controls.modifiedBy.setValue(this.devices[i].modifiedBy);
        break;
      }
    }
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
    for(var i in this.devices){
      if(this.devices[i].deviceID==d.deviceID){
        isexist=true;
        break;
      }
    }
    if(!isexist){
      this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
    // console.log(this.mform.value);
    this.service.createdevice(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Created Successfully");
      this.getdevices();
      this.isCreate=false;
    },
    (error)=>{
      this.notification.success("Something went wrong");
    })
    }
    else{
      this.notification.success("device already exists");
    }
  }
  reset_form(){
    this.mform.setValue({
      deviceID:null,
      name:null,
      purpose:null,
      puttoUse:null,
      battery:null,
      healthy:null,
      softwareVersion:null,
      vcc:null,
      lifespan:null,
      isEnabled:null,
    createdOn:null,
    createdBy:null,
    modifiedOn:null,
    modifiedBy:null
    })
  }

}
