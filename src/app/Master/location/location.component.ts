import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locs=[];isCreate=false;
  loc={
    locationID:null,
    lcoationText:null,
    workCenter:null,
    plant:null,
    geo:null,
    parantLocationID:null
  };
  empty={
    locationID:null,
    lcoationText:null,
    workCenter:null,
    plant:null,
    geo:null,
    parantLocationID:null
  };

  constructor(public service:VsenseapiService,public notification:NotificationService,private fb:FormBuilder) { }

  mform=this.fb.group({
    locationID:[null],
    lcoationText:[null],
    workCenter:[null],
    plant:[null],
    geo:[null],
    parantLocationID:[null],
    isEnabled:[null],
    createdOn:[null],
    createdBy:[null],
    modifiedOn:[null],
    modifiedBy:[null]
  })
  reset_form(){
    this.mform.setValue({
      locationID:null,
      lcoationText:null,
      workCenter:null,
      plant:null,
      geo:null,
      parantLocationID:null,
      isEnabled:null,
      createdOn:null,
      createdBy:null,
      modifiedOn:null,
      modifiedBy:null
    })}
  ngOnInit(): void {
    this.service.emitChange("Location");
    this.getlocs();
  }
  getlocs(){
    this.service.getalllocs().subscribe((data: any[])=>{
      this.locs=data;
      this.getselected(this.locs[0].locationID);
      // console.log(this.locs);
    }) 
  }
  getselected(name:string){
    for(var i in this.locs){
      if(this.locs[i].locationID==name){
        this.mform.controls.locationID.setValue(this.locs[i].locationID);
        this.mform.controls.lcoationText.setValue(this.locs[i].lcoationText);
        this.mform.controls.workCenter.setValue(this.locs[i].workCenter);
        this.mform.controls.plant.setValue(this.locs[i].plant);
        this.mform.controls.geo.setValue(this.locs[i].geo);
        this.mform.controls.parantLocationID.setValue(this.locs[i].parantLocationID);
        this.mform.controls.isEnabled.setValue(this.locs[i].isEnabled);
        this.mform.controls.createdOn.setValue(this.locs[i].createdOn);
        this.mform.controls.createdBy.setValue(this.locs[i].createdBy);
        this.mform.controls.modifiedOn.setValue(this.locs[i].modifiedOn);
        this.mform.controls.modifiedBy.setValue(this.locs[i].modifiedBy);
        this.isCreate=false;
        break;
      }
    }
  }
  handle_delete(){
    this.service.deletelocation(this.mform.controls.locationID.value).subscribe((data:any[])=>{
      console.log(data);
      this.notification.success("Location Deleted");
      this.getlocs();
      this.loc=this.empty;
    })
  }
  handle_update(){
    this.service.updateloc(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Updated Successfully");
      this.getlocs();
      // this.loc=this.empty;
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
    for(var i in this.locs){
      if(this.locs[i].locationID==d.locationID){
        isexist=true;
        break;
      }
    }
    if(!isexist){
      this.mform.controls.isEnabled.setValue(true);
    this.mform.controls.createdOn.setValue(new Date());
    this.service.createloc(this.mform.value).subscribe((data:any[])=>{
      // console.log(data);
      this.notification.success("Created Successfully");
      this.getlocs();
      this.isCreate=false;
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
    }
    this.notification.success("location already exists");
  }
    
}
