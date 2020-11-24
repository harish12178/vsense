import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { NavItem } from "./nav-item";
import { NavService } from "./nav.service";
import { Router } from '@angular/router';
import { AuthenticationService } from './Services/authentication.service';
import { User } from './Models/user';
import { BnNgIdleService } from 'bn-ng-idle';
import { InformationDialogComponent } from './information-dialog/information-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit,OnInit {
  @ViewChild("appDrawer") appDrawer: ElementRef;

  currentUser: User;
  islogin:boolean=true;

  navItems: NavItem[] = [
    {
      displayName: "Home",
      iconName: "home",
      route: "dashboard"
    },
    {
      displayName: "Exceptions",
      iconName: "error",
      route: "exceptions"
    },
    {
      displayName: "Masters",
      iconName: "school",
      route: "masters",
      children: [
        {
          displayName: "Device",
          iconName: "",
          route: "masters/device"
        },
        {
          displayName: "DParam",
          iconName: "",
          route: "masters/deviceparam"
        },
        {
          displayName: "Equipment",
          iconName: "",
          route: "masters/equipment"
        },
        {
          displayName: "Location",
          iconName: "",
          route: "masters/location"
        },
        {
          displayName: "DAssign",
          iconName: "",
          route: "masters/deviceassign"
        },
        {
          displayName: "PAssign",
          iconName: "",
          route: "masters/deviceassignparam"
        }
      ]
    }
  ];

  constructor(
    private navService: NavService,
    public router: Router,
    private authenticationService: AuthenticationService,
    private bnIdle: BnNgIdleService,
    private dialog: MatDialog
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.authenticationService.changeEmitted$.subscribe(
      value => {
        this.islogin = value;
      });
  }

  OpenInformationDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: 'Your session has expired! Please login again',
      panelClass: 'information-dialog'
    };
    const dialogRef = this.dialog.open(InformationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        this.authenticationService.logout();
      },
      err => {
        this.authenticationService.logout();
      });
  }
  logout() {
    this.authenticationService.logout();
  }
  ngOnInit() {
    this.bnIdle.startWatching(600).subscribe((res) => {
      if (res) {
        if (this.authenticationService.currentUserValue) {
          console.log('session expired');
          this.bnIdle.stopTimer();
          this.OpenInformationDialog();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

}

