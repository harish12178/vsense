import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NavItem } from '../nav-item';

@Injectable({
    providedIn: 'root'
})
export class MenuUpdataionService {
    MenuUpdationEvent: Subject<any>;
    constructor() {
        this.MenuUpdationEvent = new Subject();
    }
    GetAndUpdateMenus(): Observable<NavItem[]> {
        return this.MenuUpdationEvent.asObservable();
    }

    PushNewMenus(menus: NavItem[]): void {
        this.MenuUpdationEvent.next(menus);
    }
}
