import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { interval, Subscription } from 'rxjs';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {
  subscription:Subscription;
  exceptions=[];
  dataSource;
  displayedColumns:string[]=["deviceid","location","exception","datetime"]
  constructor(public service:VsenseapiService) { }

  ngOnInit(): void {
    this.service.emitChange("Exceptions");
    this.exceptions=JSON.parse(localStorage.getItem("exceptions"));
    this.dataSource=new MatTableDataSource(this.exceptions);
    this.subscription = interval(25000).subscribe((func => {
      this.exceptionpuller();
    }))
    //console.log(this.exceptions);
  }
  exceptionpuller(){
    this.exceptions=JSON.parse(localStorage.getItem("exceptions"));
    this.dataSource=new MatTableDataSource(this.exceptions);
  }

}
