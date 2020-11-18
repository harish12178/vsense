import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';
import {MatTableDataSource} from '@angular/material/table';
import { Color, Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

import { User } from 'src/app/Models/user' ;
import { UserService } from 'src/app/Services/user.service';
import { interval, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit,OnDestroy {
  subscription:Subscription;
  key:string;
  deviceassigns=[];
  chart;active_count;inactive_count;
  data_arr=[];labels=[];
  loading = false;
    users: User[];
  recentlyUpdated=[];
  isAll=false;
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
  constructor(private router: Router,public service:VsenseapiService,private userService: UserService,private notification:NotificationService) { }
  
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
      this.getalldevices();
      this.isAll=true;
    }
  }
  actionselect(action:string,equipment){
    if(action=="1"){
    localStorage.setItem('equipment',equipment.equipmentID);
    localStorage.setItem('device',equipment.deviceID);
    localStorage.setItem('assignment',equipment.assignmentID);
    console.log(equipment);
    this.service.emitChange("Device Details");
    this.router.navigate(['/devicedetails']);
    }
    else if(action=="2"){
      if(equipment.device.isEnabled==true){
        this.notification.update("Device already Enabled");
      }
      else{
        equipment.device.isEnabled=true;
      console.log(equipment.device);
      this.service.updatedevice(equipment.device).subscribe((data:any[])=>{
        // console.log(data);
        this.notification.update("Device Enabled");
        // this.device=this.empty;
        if(this.isAll){
          this.getalldevices();
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
        equipment.device.isEnabled=false;
      console.log(equipment.device);
      this.service.updatedevice(equipment.device).subscribe((data:any[])=>{
        // console.log(data);
        this.notification.update("Device Disabled");
        // this.device=this.empty;
        if(this.isAll){
          this.getalldevices();
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
      //console.log(data);
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
    this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    this.getactivedevices();
    this.getalldeviceassigns();
    this.getResentlyUpdated();
    this.subscription = interval(30000).subscribe((func => {
      this.datapuller();
    }))
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
      this.dataSource=new MatTableDataSource(data);
    })
  }
  handle_devicedetails(equipmentid:string){
    this.router.navigate(['/devicedetails']);
  }
  handlefilter(){
    this.dataSource.filter=this.key.trim().toLowerCase();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
