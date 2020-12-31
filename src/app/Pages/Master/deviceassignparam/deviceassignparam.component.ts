import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { AbstractControl, FormArray, FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MasterService } from 'src/app/Services/master.service';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-deviceassignparam',
  templateUrl: './deviceassignparam.component.html',
  styleUrls: ['./deviceassignparam.component.css']
})
export class DeviceassignparamComponent implements OnInit {
  devices=[];isCreate=false;assignmentID=null;deviceID=null;equipmentID=null;locationID=null;
  assignments=[];
  selectID;
  paramExist=0;
  deviceparamassignments=[];paramassigns=[];deviceparams=[];
  //"soft_1_Exception_Threshold", 'soft_2_Exception_Threshold','hard_2_Exception_Threshold','hard_2_Exception_Threshold'
  displayedColumns: string[] = ['pramID', 'title', 'unit','longText','min','max',"icon",'activityGraphTitle','delete'];
  row:FormGroup;
  dataSource=new BehaviorSubject<AbstractControl[]>([]);
  paramAssignForms:FormArray=this.fb.array([]);
  deletearray=[];
  searchText="";

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  constructor(public service:VsenseapiService,
    public notification:NotificationService,
    private fb:FormBuilder,
    private _masterService:MasterService) { }

  addparamassignment(){
    if(this.paramAssignForms.length < this.deviceparams.length){
      this.paramAssignForms.push(this.fb.group({
        assignmentID:[this.mform.get('assignmentID').value],
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
        isEnabled:[true],
        createdOn:[new Date()],
        createdBy:[this.currentUserName],
        modifiedOn:[null],
        modifiedBy:[null]
      }));
      this.dataSource.next(this.paramAssignForms.controls);
    }
    else{
      this.notification.success("all parameters assigned");
    }
  }
  mform=this.fb.group({
    assignmentID:[null,Validators.required],
    parameters:this.paramAssignForms
  })
  reset_form(){
    this.paramAssignForms.clear();
    this.dataSource.next(this.paramAssignForms.controls);
    this.mform.setValue({
      assignmentID:null,
      parameters:this.paramAssignForms
    });
  }
  ngOnInit(): void {
    this.service.emitChange("PAssign");
    this.getdeviceassignparams();
    this.service.getalldevices().subscribe((data:any[])=>{
      this.devices=data;
    })
    this.service.getalldeviceassigns().subscribe((data:any[])=>{
      this.assignments=data;
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
  appUsage.AppName = 'PAssign';
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
  getdeviceassignparams(){
    let parameter:{
      assignmentID:number,
      parameters:any
    }
    this.service.getalldeviceassignparams().subscribe((data: any[])=>{
      if(data[0]==undefined){
        this.isCreate=true;
      }
      this.deviceparamassignments=data;
      this.deviceparamassignments.forEach(param => {
        const params:typeof parameter={
          assignmentID:param.assignmentID,
          parameters:[]
        }
        let flag=true;
        for(var x in this.paramassigns){
          if(this.paramassigns[x].assignmentID==param.assignmentID){
            flag=false;
            break;
          }
        }
        if(this.paramassigns.length>0){
          if(flag){
            for(var i in this.deviceparamassignments){
              if(param.assignmentID==this.deviceparamassignments[i].assignmentID){
                params.parameters.push(this.deviceparamassignments[i]);
              }
            }
            this.paramassigns.push(params);
          }
        }
        else{
          for(var i in this.deviceparamassignments){
            if(param.assignmentID==this.deviceparamassignments[i].assignmentID){
              params.parameters.push(this.deviceparamassignments[i]);
            }
          }
          this.paramassigns.push(params);
        }
      });
      // console.log(this.paramassigns);
      this.getselected(this.paramassigns[0]);
    }) 
  }
  getselected(element){
    this.selectID=element.assignmentID;
        this.mform.controls.assignmentID.setValue(element.assignmentID);
        this.assignmentID=element.assignmentID;
        this.deviceID=element.parameters[0].device_assign.deviceID;
        this.equipmentID=element.parameters[0].device_assign.equipmentID;
        this.locationID=element.parameters[0].device_assign.locID;
        this.deviceparams=element.parameters[0].device_assign.device.deviceParams;
        this.paramAssignForms.clear();
        for(var i in element.parameters){
          this.row=this.fb.group({
            assignmentID:[element.assignmentID],
            pramID:[element.parameters[i].pramID],
            title:[element.parameters[i].title],
            unit:[element.parameters[i].unit],
            longText:[element.parameters[i].longText],
            max:[element.parameters[i].max],
            min:[element.parameters[i].min],
            icon:[element.parameters[i].icon],
            soft_1_Exception_Threshold:[element.parameters[i].soft_1_Exception_Threshold],
            soft_2_Exception_Threshold:[element.parameters[i].soft_2_Exception_Threshold],
            hard_1_Exception_Threshold:[element.parameters[i].hard_1_Exception_Threshold],
            hard_2_Exception_Threshold:[element.parameters[i].hard_2_Exception_Threshold],
            activityGraphTitle:[element.parameters[i].activityGraphTitle],
            isEnabled:[element.parameters[i].isEnabled],
            createdOn:[element.parameters[i].createdOn],
            createdBy:[element.parameters[i].createdBy],
            modifiedOn:[element.parameters[i].modifiedOn],
            modifiedBy:[this.currentUserName]
          })
          this.paramAssignForms.push(this.row);
          this.dataSource.next(this.paramAssignForms.controls);
        }
    this.isCreate=false;
  }
  handle_delete(pramid:string,assignmentid:number,index:any){
    this.service.deletedeviceassignparam(pramid,assignmentid).subscribe((data:any[])=>{
      this.notification.success("Parameter Deleted");
      this.paramAssignForms.removeAt(index);
      this.dataSource.next(this.paramAssignForms.controls);
      if(this.paramAssignForms.length==0){
        this.paramassigns=[];
        this.getdeviceassignparams();
      }
    },
    (error)=>{
      this.notification.success("something went wrong");
    })
  }
  handle_update(){
    if(this.paramAssignForms.length!=0){
      const paramarray=this.mform.get("parameters") as FormArray;
      console.log(paramarray.value);
      this.service.updatedeviceassignparam(paramarray.value).subscribe((data:any[])=>{
        this.notification.success("Updated Successfully");
        this.paramassigns=[];
        this.getdeviceassignparams();
        // this.deviceparamassignment=this.empty;
        // this.deviceID=null;
      },
      (error)=>{
        this.notification.success("something went wrong");
      })
    } 
    else{
      this.paramassigns=[];
      this.getdeviceassignparams();
    }
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
      const paramarray=this.mform.get("parameters") as FormArray;
      this.service.createdeviceassignparam(paramarray.value).subscribe((data:any[])=>{
       // console.log(data);
       this.notification.success("Created Successfully");
       this.paramassigns=[];
       this.getdeviceassignparams();
       this.isCreate=false;
       // this.deviceID=null;
     },
     (error)=>{
       this.notification.success("something went wrong");
     })
    }
    else{
      this.ShowValidationErrors();
    }

  }
  paramselect(param:string,index:any){
    // console.log(this.mform.get("parameters").value);
    this.paramExist=0;
    const arr=this.mform.get("parameters") as FormArray;
    arr.value.forEach(element => {
      if(element.pramID==param && element.pramID!=null){
        this.paramExist+=1;
      }
    });
    if(this.paramExist>1){
      this.notification.success("param already exists");
      const paramarray=this.mform.get("parameters") as FormArray;
      const control=paramarray.controls[index] as FormControl;
      control.patchValue({pramID:null});
    }
    else{
      const paramarray=this.mform.get("parameters") as FormArray;
      const control=paramarray.controls[index] as FormControl;
      for(var i in this.deviceparams){ 
        if(this.deviceparams[i].paramID==param){
          control.patchValue({
            title:this.deviceparams[i].title,
            unit:this.deviceparams[i].unit,
            longText:this.deviceparams[i].longText,
            max:this.deviceparams[i].max,
            min:this.deviceparams[i].min,
            icon:this.deviceparams[i].icon
          });
          // console.log(this.mform.value);
          break;
        }
      }
    }
  }
  assignselect(id:number){
    this.assignments.forEach(element => {
      if(element.assignmentID==id){
        this.deviceparams=element.device.deviceParams;
      }
    });
    // console.log(this.deviceparams);
  }
  removeparam(index){
    let data=this.mform.value;
    var assignmentid=data.assignmentID;
    var pramid=data.parameters[index].pramID;
    if(pramid==null){
      this.paramAssignForms.removeAt(index);
      this.dataSource.next(this.paramAssignForms.controls);
    }
    else{
      this.handle_delete(pramid,assignmentid,index);
    }
  }
  ShowValidationErrors(): void {
    Object.keys(this.mform.controls).forEach(key => {
      this.mform.get(key).markAsTouched();
      this.mform.get(key).markAsDirty();
    });
  }
}
