
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from "@angular/common/http";
import { Guid } from "guid-typescript";
import {
    ChangePassword,
    ForgotPassword,
    EMailModel,
    LoginModel,
    SessionMaster,
    UserPreference,
} from "src/app/Models/master";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    baseAddress: string;
    clientId: string;
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    constructor(private _httpClient: HttpClient) {
        this.baseAddress = environment.baseAddress;
        this.clientId = environment.clientId;
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('authorizationData')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }
    private emitChangeSource = new Subject<any>();
   // Observable string streams
   changeEmitted$ = this.emitChangeSource.asObservable();
   // Service message commands
   islogin(change: boolean) {
       this.emitChangeSource.next(change);
   }
    // Error Handler

    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(
            error.error.error_description ||
                error.error ||
                error.message ||
                "Server Error"
        );
    }

    errorHandler1(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || "Server Error");
    }

    login(userName: string, password: string): Observable<any> {
        // tslint:disable-next-line:prefer-const
        // let data = `grant_type=password&username=${userName}&password=${password}&client_id=${this.clientId}`;
        const loginModel: LoginModel = {
            UserName: userName,
            Password: password,
            clientId: this.clientId
        };
        return this._httpClient
            .post<any>(
                `${this.baseAddress}/api/Auth/token`,
                JSON.stringify(loginModel),
                {
                  headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                  })
                }
            )
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.currentUserSubject.next(user);
                return user;
            }),catchError(this.errorHandler));
    }

    GetIPAddress(): Observable<any> {
        return this._httpClient
            .get<any>("https://freegeoip.net/json/?callback")
            .pipe(
                map((response) => response || {}),
                catchError(this.errorHandler1)
            );
    }

    SignOut(UserID: Guid): Observable<any> {
        return this._httpClient
            .get<any>(
                `${this.baseAddress}/api/Master/SignOut?UserID=${UserID}`
            )
            .pipe(catchError(this.errorHandler1));
    }

    GetSessionMasterByProject(
        ProjectName: string
    ): Observable<SessionMaster | string> {
        return this._httpClient
            .get<SessionMaster>(
                `${this.baseAddress}/api/Master/GetSessionMasterByProject?ProjectName=${ProjectName}`
            )
            .pipe(catchError(this.errorHandler1));
    }

    ChangePassword(changePassword: ChangePassword): Observable<any> {
        return this._httpClient
            .post<any>(
                `${this.baseAddress}/api/Master/ChangePassword`,
                JSON.stringify(changePassword),
                {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                    }),
                }
            )
            .pipe(catchError(this.errorHandler1));
    }

    GetUserPreferenceByUserID(
        UserID: Guid
    ): Observable<UserPreference | string> {
        return this._httpClient
            .get<UserPreference>(
                `${this.baseAddress}/api/Master/GetUserPreferenceByUserID?UserID=${UserID}`
            )
            .pipe(catchError(this.errorHandler));
    }

    ForgotPassword(forgotPassword: ForgotPassword): Observable<any> {
        return this._httpClient
            .post<any>(
                `${this.baseAddress}/api/Master/ForgotPassword`,
                JSON.stringify(forgotPassword),
                {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                    }),
                }
            )
            .pipe(catchError(this.errorHandler1));
    }

    SendResetLinkToMail(eMailModelmail: EMailModel): Observable<any> {
        return this._httpClient
            .post<any>(
                `${this.baseAddress}/api/Master/SendResetLinkToMail`,
                JSON.stringify(eMailModelmail),
                {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                    }),
                }
            )
            .pipe(catchError(this.errorHandler1));
    }

    // SetApplicationTourDisabled(tourStatus: TourStatusModel): Observable<any> {
    //     return this._httpClient
    //         .post<any>(
    //             `${this.baseAddress}authenticationapi/Master/SetApplicationTourDisabled`,
    //             tourStatus,
    //             {
    //                 headers: new HttpHeaders({
    //                     "Content-Type": "application/json",
    //                 }),
    //             }
    //         )
    //         .pipe(catchError(this.errorHandler1));
    // }
}
