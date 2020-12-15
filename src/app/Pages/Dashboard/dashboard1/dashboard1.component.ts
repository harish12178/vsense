import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';
import {MatTableDataSource} from '@angular/material/table';
import { Color, Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';
import { User } from 'src/app/Models/user' ;
import { interval, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/Services/notification.service';
import { ExcelService } from 'src/app/Services/excel.service';
import { DatePipe } from '@angular/common';
import { AppUsage, AuthenticationDetails } from 'src/app/Models/master';
import { Guid } from 'guid-typescript';
import { MasterService } from 'src/app/Services/master.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit,OnDestroy {
  subscription:Subscription;
  subscription1:Subscription;
  key:string;
  deviceassigns=[];
  chart;active_count;inactive_count;
  data_arr=[];labels=[];
  loading = false;
    users: User[];
    exception=[];
  recentlyUpdated=[];
  allDevices=[];
  isAll=false;

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Active Devices' },
    { data: [40, 56, 73, 92, 37, 25, 50], label: 'Inactive Devices' },
  ];
  public lineChartLabels: Label[] = ['30', '40', '50', '60', '70', '80', '90'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        { gridLines: { display: false } }

      ],
      yAxes: [
        {
          display: true,
          ticks: {
            max: 100,
            min: 0,
            stepSize: 50
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#e46c53',
      backgroundColor: 'transparent',
      pointBorderColor:'transparent',
        borderWidth:3.5
    },
    {
      borderColor: '#3991dc',
      backgroundColor: 'transparent',
      pointBorderColor:'transparent',
        borderWidth:3.5
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  array;
  displayedColumns: string[] = ['equipmentname', 'location', 'equipmentid','device','parameter1','parameter2',"parameter3","parameter4",'isenable', 'action'];
  dataSource ;
  deviceparamassignments;
  paramassigns=[];
  constructor(private router: Router,
    public service:VsenseapiService,
    private notification:NotificationService,
    private excelservice:ExcelService,
    private datepipe:DatePipe,
    private _masterService:MasterService
    ) { }
  
  getalldeviceassigns(){
    this.service.getalldeviceassigns().subscribe((data: any[])=>{
      this.deviceassigns=data;
      this.active_count=0;
      this.inactive_count=0;
      for(var i in this.deviceassigns){
        if(this.deviceassigns[i].device.isEnabled==true){
          this.active_count+=1;
        }
        else{
          this.inactive_count+=1;
        }
      }
      this.data_arr = [this.active_count, this.inactive_count];
      this.labels = ["Active","Inactive"];
      this.chart = new Chart('canvas', {
        type: 'doughnut',
        data: {
          labels: this.labels,
          datasets: [
            {
              borderWidth: 0,
              data: this.data_arr,
              backgroundColor: [
                "#fb863a",
                "#40a8e2"                  
              ],
              fill: true
            }
          ]
        },
        options: {
  
          cutoutPercentage: 78,
          plugins:{
            
            labels: {
              
              fontColor: '#434343',
              fontSize:8,
              fontWeight:500,
              position: 'outside',
              textMargin:6
            }
          },
  
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: false
            }],
          }
        }
      });
    })
   
  }
  deviceselect(selection:string){
    if(selection=="1"){
      this.getactivedevices();
      this.isAll=false;
    }
    else if(selection=="2"){
      this.getinactivedevices();
      this.isAll=false;
    }
    else{
      this.dataSource=new MatTableDataSource(this.allDevices);
      this.isAll=true;
    }
  }
  actionselect(action:string,equipment){
    if(action=="1"){
    localStorage.setItem('assignment',JSON.stringify(equipment));
    //console.log(equipment);
    this.service.emitChange("Device Details");
    this.router.navigate(['/devicedetails']);
    }
    else if(action=="2"){
      if(equipment.device.isEnabled==true){
        this.notification.update("Device already Enabled");
      }
      else{
        equipment.device.isEnabled=true;
        equipment.device.modifiedBy=this.currentUserName;
      //console.log(equipment.device);
      this.service.updatedevice(equipment.device).subscribe((data:any[])=>{
        // console.log(data);
        this.notification.update("Device Enabled");
        // this.device=this.empty;
        if(this.isAll){
          this.dataSource=new MatTableDataSource(this.allDevices);
        }
        else{
          this.getinactivedevices();
        }
        this.getalldeviceassigns();
      })
      }
    }
    else{
      if(equipment.device.isEnabled==false){
        this.notification.update("Device already Disabled");
      }
      else{
        equipment.device.modifiedBy=this.currentUserName;
        equipment.device.isEnabled=false;
      //console.log(equipment.device);
      this.service.updatedevice(equipment.device).subscribe((data:any[])=>{
        // console.log(data);
        this.notification.update("Device Disabled");
        // this.device=this.empty;
        if(this.isAll){
          this.dataSource=new MatTableDataSource(this.allDevices);
        }
        else{
          this.getactivedevices();
        }
        
        this.getalldeviceassigns();
      })
      }
    }
  }

  getResentlyUpdated(){
    let allogs=[];
    this.service.getrecentlogs().subscribe((data: any[])=>{
      allogs=data;
      // console.log(data);
      for (var i in allogs) {
        allogs[i].timeDiff=this.getTimeDiff(allogs[i].device_log.dateTime);
        this.recentlyUpdated.push(allogs[i]);
    }
    //console.log(this.recentlyUpdated);
    });
  }
  datapuller(){
    let allogs=[];
    this.service.getrecentlogs().subscribe((data: any[])=>{
      allogs=data;
      
      for (var i in allogs) {
        allogs[i].timeDiff=this.getTimeDiff(allogs[i].device_log.dateTime);;
        this.recentlyUpdated[i]=(allogs[i]);
    }
    //console.log(this.recentlyUpdated);
    })
  }
  ngOnInit(): void {
    this.service.emitChange("Dashboard");
    this.getalldeviceassigns();
    this.getResentlyUpdated();
    this.getactivedevices();
    this.getalldevices();
    
    let parameter:{
      assignmentID:number,
      parameters:any
    }

    this.service.getalldeviceassignparams().subscribe((data: any[])=>{
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
    });

    

    this.exceptionpuller();
    this.subscription1 = interval(30000).subscribe((func => {
      this.exceptionpuller();
    }));
    this.subscription = interval(30000).subscribe((func => {
      this.datapuller();
    }));


    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
    } else {
      this.router.navigate(['/login']);
    }
    this.CreateAppUsage();
  }

  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'Home';
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
  getTimeDiff(date:string){
    let updatedDate= new Date(date);
    let currentDate = new Date();
    let diffMs = (currentDate.getTime() - updatedDate.getTime()); // milliseconds
    let diffDays = Math.floor(diffMs / 86400000); // days
    let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if(diffDays>0){
      if(diffDays==1){
        return diffDays+" day ago";
      }
      return diffDays+" days ago";
    }
    else if(diffHrs>0){
      if(diffHrs==1 && diffMins==1){
        return diffHrs+" hour "+diffMins+"minute ago"
      }
      else if(diffHrs==1){
        return diffHrs+" hour ago"
      }
      return diffHrs+" hours ago"
    }
    else{
      if(diffMins<1){
        return " just now";
      }
      else if(diffMins==1){
        return diffMins + " minute ago";
      }
      return diffMins + " minutes ago";
    }
  }
  getactivedevices(){
    this.service.getallactivedevices().subscribe((data: any[])=>{
      this.dataSource=new MatTableDataSource(data);
    })
  }
  getinactivedevices(){
    this.service.getallinactivedevices().subscribe((data: any[])=>{
      this.dataSource=new MatTableDataSource(data);
    })
  }
  getalldevices(){
    this.service.getalldeviceassigns().subscribe((data: any[])=>{
      this.allDevices=data;
    })
  }
  handle_devicedetails(equipmentid:string){
    this.router.navigate(['/devicedetails']);
  }
  handlefilter(){
    this.dataSource.filter=this.key.trim().toLowerCase();
  }
  exceptionpuller(){
    this.paramassigns.forEach(paramassign => {
      paramassign.parameters.forEach(param => {
        this.service.getdevicelog(param.device_assign.deviceID,param.pramID).subscribe((data: any)=>{
          var log=data;
          log.device_Assign_Param=param;
          var flag=false;
          for(var k in this.exception){
            if(this.exception[k].logID==log.logID){
              flag=true;
              break;
            }
          }
          if(!flag){
            if(log.value>log.maxValue){
              log.exception=param.pramID+" exceeded";
              this.exception.push(log);
            }
            else if(log.value<log.minValue){
              log.exception=param.pramID+" fell behind";
              this.exception.push(log);
            }
          } 
        })
      });
    });
    //console.log(this.exception);
    localStorage.setItem("exceptions",JSON.stringify(this.exception));
  }
  downloadToExcel(){
    var array=[];
    this.allDevices.forEach(x => {
      let device={
        deviceID:x.deviceID,
        deviceName:x.device.name,
        equipmentID:x.equipmentID,
        equipmentName:x.equipment.text,
        locationID:x.locID,
        locationName:x.location.lcoationText,
        softwareVersion:x.device.softwareVersion,
        Vcc:x.device.vcc,
        Battery:x.device.battery,
        Healthy:x.device.healthy,
        PutToUseDate:this.datepipe.transform(x.device.puttoUse, 'dd-MM-yyyy')
      }
      array.push(device);
    });
    this.excelservice.exportAsExcelFile(array,"device_details");
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
