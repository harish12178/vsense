import { Compiler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../Models/user';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    constructor(private http: HttpClient,private router:Router,private _compiler:Compiler) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    private emitChangeSource = new Subject<any>();
   // Observable string streams
   changeEmitted$ = this.emitChangeSource.asObservable();
   // Service message commands
   islogin(change: boolean) {
       this.emitChangeSource.next(change);
   }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.clear();
        this._compiler.clearCache();
        this.currentUserSubject.next(null);
        this.islogin(true);
        this.router.navigate(['/login']);
    }
}