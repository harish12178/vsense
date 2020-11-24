import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {  interval,Subscription  } from 'rxjs';
import { ExcelService } from 'src/app/Services/excel.service';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
  deviceparams = []; temperature=30;device;
  equipment; equipmentid;
  subscription:Subscription
  data = [];
  dummy;dummy1;
  alert_count=[];
  constructor(public service: VsenseapiService,private excelservice:ExcelService,private datepipe:DatePipe) {}

  datapuller(){
    for (var i in this.deviceparams) {
      if(this.deviceparams[i].assignmentID==localStorage.getItem("assignment") && this.deviceparams[i].device_assign.deviceID==this.device.deviceID){
        this.service.getdevicelog(this.deviceparams[i].device_assign.deviceID,this.deviceparams[i].pramID).subscribe(res => {
          this.dummy=res;
          this.service.getdeviceassignparam(localStorage.getItem("assignment"),this.dummy.pramID).subscribe(x=>{
            this.dummy.device_Assign_Param=x;
          
          for(var j in this.deviceparams){
            if(this.data[j].device_Assign_Param.assignmentID==this.dummy.device_Assign_Param.assignmentID && this.data[j].pramID==this.dummy.pramID){
              this.dummy.alert_count=this.data[j].alert_count;
              
              if(this.data[j].logID!=this.dummy.logID && (this.dummy.value>this.dummy.maxValue || this.dummy.value<this.dummy.minValue)){ 
                  this.dummy.alert_count+=1;
              }
              this.data[j]=this.dummy;
              //console.log(this.data[j].alert_count);
              break;
            }
          }
        });
          //console.log(this.dummy);
        });
      }
      
    }
  }
  ngOnInit(): void {
    this.service.emitChange("Device Details");
    this.getcurrentdevice();
    this.getequipmentdetails();
    
    this.subscription = interval(15000).subscribe((func => {
      this.datapuller();
    }))
 
  }

  getequipmentdetails(){
    this.service.getallequipments().subscribe(res => {

        this.equipmentid=localStorage.getItem('equipment');

      for (var i in res) {
        if (res[i].equipmentID == this.equipmentid) {
          this.equipment = res[i];
        }
      }
      // console.log(this.equipmentid);
      this.service.getalldeviceassignparams().subscribe(res => {
        this.deviceparams = res;
        for (var i in this.deviceparams) {
          if(this.deviceparams[i].assignmentID==localStorage.getItem("assignment") && this.deviceparams[i].device_assign.deviceID==this.device.deviceID){
            this.service.getdevicelog(this.deviceparams[i].device_assign.deviceID,this.deviceparams[i].pramID).subscribe(res => {
              this.dummy1=res;
              this.service.getdeviceassignparam(localStorage.getItem("assignment"),this.dummy1.pramID).subscribe(x=>{
                this.dummy1.device_Assign_Param=x;
              })
              this.dummy1.alert_count=0;
              if(this.dummy1.value>this.dummy1.maxValue || this.dummy1.value<this.dummy1.minValue){
                this.dummy1.alert_count+=1;
              }
              this.data.push(this.dummy1);
              console.log(this.dummy1);
            });
          }
          
        }
      })
    })
  
  }

  getcurrentdevice(){
    let id=localStorage.getItem('device');
    this.service.getdevicebyid(id).subscribe(res=>{
      this.device=res;
    })
  }
  downloadToExcel(){
    var array=[];
    this.data.forEach(x => {
      let device={
        deviceID:this.device.deviceID,
        deviceName:this.device.name,
        paramName:x.device_Assign_Param.title,
        equipmentID:this.equipment.equipmentID,
        equipmentName:this.equipment.text,
        locationID:x.device_Assign_Param.device_assign.locID,
        locationName:x.device_Assign_Param.device_assign.location.lcoationText,
        softwareVersion:this.device.softwareVersion,
        Vcc:this.device.vcc,
        Battery:this.device.battery,
        Healthy:this.device.healthy,
        PutToUseDate:this.datepipe.transform(this.device.puttoUse, 'dd-MM-yyyy')
      }
      array.push(device);
    });
    this.excelservice.exportAsExcelFile(array,"deviceDetails");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
