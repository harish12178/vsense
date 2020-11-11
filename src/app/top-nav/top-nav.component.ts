import { Component, OnInit } from '@angular/core';
import {NavService} from '../nav.service';
import { VsenseapiService } from '../Services/vsenseapi.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  page:string="Dashboard";

  constructor(private service:VsenseapiService) { 
  }

  ngOnInit() {
    this.service.changeEmitted$.subscribe(
      text => {
          this.page=text;
      });
  }

}