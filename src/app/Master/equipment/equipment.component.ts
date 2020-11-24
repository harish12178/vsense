import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  equipments=[];isCreate=false;
  searchText="";

  constructor(public service:VsenseapiService,public notification:NotificationService,private fb:FormBuilder) { }

  mform=this.fb.group({
    equipmentID:[null],
    text:[null],
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
  }
  getequipments(){
    this.service.getallequipments().subscribe((data: any[])=>{
      this.equipments=data;
      this.getselected(this.equipments[0].equipmentID);
    }) 
  }
  getselected(name:string){
    for(var i in this.equipments){
      if(this.equipments[i].equipmentID==name){
        this.mform.controls.equipmentID.setValue(this.equipments[i].equipmentID);
        this.mform.controls.text.setValue(this.equipments[i].text);
        this.mform.controls.geoLoc.setValue(this.equipments[i].geoLoc);
        this.mform.controls.plant.setValue(this.equipments[i].plant);
        this.mform.controls.workcenter.setValue(this.equipments[i].workcenter);
        this.mform.controls.isEnabled.setValue(this.equipments[i].isEnabled);
        this.mform.controls.createdOn.setValue(this.equipments[i].createdOn);
        this.mform.controls.createdBy.setValue(this.equipments[i].createdBy);
        this.mform.controls.modifiedOn.setValue(this.equipments[i].modifiedOn);
        this.mform.controls.modifiedBy.setValue(this.equipments[i].modifiedBy);
        this.isCreate=false;
        break;
      }
    }
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
    for(var i in this.equipments){
      if(this.equipments[i].equipmentID==d.equipmentID){
        isexist=true;
        break;
      }
    }
    if(!isexist){
      this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
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
    this.notification.success("equipment already exists");
  }

}
