import { Component, OnInit } from '@angular/core';
import { VsenseapiService } from 'src/app/Services/vsenseapi.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {

  constructor(public service:VsenseapiService) { }

  ngOnInit(): void {
    this.service.emitChange("Exceptions");
  }

}
