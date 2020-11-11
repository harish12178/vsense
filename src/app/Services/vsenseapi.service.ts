import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import {  throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class VsenseapiService {
  private server_address = "http://192.168.0.28:7051/vsenseapi";
 // private server_address = "http://localhost:5501/vsenseapi";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient:HttpClient) { }

   // Observable string sources
   private emitChangeSource = new Subject<any>();
   // Observable string streams
   changeEmitted$ = this.emitChangeSource.asObservable();
   // Service message commands
   emitChange(change: any) {
       this.emitChangeSource.next(change);
   }

  getdevicelog(id:string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/DeviceLog/getlog?deviceid="+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalllogs(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/devicelog/getalllogs")
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getrecentlogs(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/devicelog/getrecentlogs")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalldevices(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/master/getalldevices")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getallactivedevices(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/master/getallactivedevices")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getallinactivedevices(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/master/getallinactivedevices")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalldeviceparams(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/master/getalldeviceparams")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getallequipments(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/master/getallequipments")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalllocs(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/master/getalllocs")
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createdevice(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/device',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  createdeviceparam(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/deviceparam',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  createequipment(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/equipment',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  createloc(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/location',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  updatedevice(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/deviceupdate',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  updatedeviceparam(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/deviceparamupdate',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  updateequipment(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/equipmentupdate',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  updateloc(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/master/locationupdate',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  deletedevice(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/master/deletedevice?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  deletedeviceparam(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/master/deletedeviceparam?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  deleteequipment(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/master/deleteequipment?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  deletelocation(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/master/deletelocation?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  deletetrkdo(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/master/deletetrkdo?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getdevicesbyequipment(id:any):Observable<any[]>{
    return this.httpClient.get<any[]>(this.server_address+'/assignment/getdevices?equipmentid='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalldeviceids():Observable<any[]>{
    return this.httpClient.get<any[]>(this.server_address+'/master/getalldeviceid')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //not created..
  //assignment..Completed
  getalldeviceassigns(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/assignment/getalldeviceassigns")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalldeviceassignparams(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.server_address+"/assignment/getalldeviceassignparams")
    .pipe(
      catchError(this.errorHandler)
    )
  }
  createdeviceassign(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/assignment/deviceassign',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  createdeviceassignparam(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/assignment/deviceassignparam',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  updatedeviceassign(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/assignment/updatedeviceassign',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  updatedeviceassignparam(data: any): Observable<any[]> {
    return this.httpClient.post<any>(this.server_address + '/assignment/updatedeviceassignparam',JSON.stringify(data),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  deletedeviceassign(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/assignment/deletedeviceassign?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  deletedeviceassignparam(id:any):Observable<any[]>{
    return this.httpClient.delete<any[]>(this.server_address + '/assignment/deletedeviceassignparam?id='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  //master..completed
  getallequipmentids():Observable<any[]>{
    return this.httpClient.get<any[]>(this.server_address+'/master/getallequipmentid')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getalllocationids():Observable<any[]>{
    return this.httpClient.get<any[]>(this.server_address+'/master/getalllocationid')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getassingidbydeviceid(id:any):Observable<any[]>{
    return this.httpClient.get<any[]>(this.server_address+'/assignment/getassingidbydeviceid?assignmentid='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getdevicebyid(id:any):Observable<any[]>{
    return this.httpClient.get<any[]>(this.server_address+'/master/getdevice?deviceid='+id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  
  errorHandler(error:HttpErrorResponse) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}
