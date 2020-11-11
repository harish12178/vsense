import { Component, OnInit, OnDestroy } from '@angular/core';
import {  interval,Subscription  } from 'rxjs';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
  devices = []; temperature=30;device;
  equipment; equipmentid;
  subscription:Subscription
  data = [];
  dummy;dummy1;
  alert_count=[];
  constructor(public service: VsenseapiService) {}

  datapuller(){
    for (var i in this.devices) {
      this.service.getdevicelog(this.devices[i]).subscribe(res => {
        this.dummy=res;
        for(var j in this.devices){
          if(this.data[j].deviceID==this.dummy.deviceID){
            this.dummy.alert_count=this.data[j].alert_count;
            if(this.data[j].logID!=this.dummy.logID && this.dummy.value>this.dummy.maxValue){ 
                this.dummy.alert_count+=1;
            }
            this.data[j]=this.dummy;
            //console.log(this.data[j].alert_count);
            break;
          }
        }
        //console.log(this.dummy);
      });
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
      if(localStorage.getItem('equipment')){
        this.equipmentid=localStorage.getItem('equipment');
      }
      else{
        this.equipmentid=res[0].equipmentID;
      }
      for (var i in res) {
        if (res[i].equipmentID == this.equipmentid) {
          this.equipment = res[i];
        }
      }
      // console.log(this.equipmentid);
      this.service.getdevicesbyequipment(this.equipmentid).subscribe(res => {
        this.devices = res;
        for (var i in this.devices) {
          this.service.getdevicelog(this.devices[i]).subscribe(res => {
            this.dummy1=res;
            this.dummy1.alert_count=0;
            if(this.dummy1.value>this.dummy1.maxValue){
              this.dummy1.alert_count+=1;
            }
            this.data.push(this.dummy1);
            console.log(this.dummy1.alert_count);
          });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
