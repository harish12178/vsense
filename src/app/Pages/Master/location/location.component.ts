import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { FormBuilder,Validators } from '@angular/forms';
import { MasterService } from 'src/app/Services/master.service';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locs=[];isCreate=false;
  searchText="";
  selectID;

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service:VsenseapiService,public notification:NotificationService,
    private fb:FormBuilder,private _masterService:MasterService) { }

  mform=this.fb.group({
    locationID:[null,Validators.required],
    lcoationText:[null,Validators.required],
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
  appUsage.AppName = 'Location';
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
  getlocs(){
    this.service.getalllocs().subscribe((data: any[])=>{
      this.locs=data;
      this.getselected(this.locs[0]);
      // console.log(this.locs);
    }) 
  }
  getselected(item){
    this.selectID=item.locationID;
        this.mform.controls.locationID.setValue(item.locationID);
        this.mform.controls.lcoationText.setValue(item.lcoationText);
        this.mform.controls.workCenter.setValue(item.workCenter);
        this.mform.controls.plant.setValue(item.plant);
        this.mform.controls.geo.setValue(item.geo);
        this.mform.controls.parantLocationID.setValue(item.parantLocationID);
        this.mform.controls.isEnabled.setValue(item.isEnabled);
        this.mform.controls.createdOn.setValue(item.createdOn);
        this.mform.controls.createdBy.setValue(item.createdBy);
        this.mform.controls.modifiedOn.setValue(item.modifiedOn);
        this.mform.controls.modifiedBy.setValue(item.modifiedBy);
        this.isCreate=false;
  }
  handle_delete(){
    this.service.deletelocation(this.mform.controls.locationID.value).subscribe((data:any[])=>{
      console.log(data);
      this.notification.success("Location Deleted");
      this.getlocs();
    })
  }
  handle_update(){
    this.mform.controls.modifiedBy.setValue(this.currentUserName);
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
      for(var i in this.locs){
        if(this.locs[i].locationID==d.locationID){
          isexist=true;
          break;
        }
      }
      if(!isexist){
        this.mform.controls.isEnabled.setValue(true);
      this.mform.controls.createdOn.setValue(new Date());
      this.mform.controls.createdBy.setValue(this.currentUserName);
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
      else{
        this.notification.success("location already exists");
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
