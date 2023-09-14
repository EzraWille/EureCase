import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICaseDataRequirements, ICaseInfo } from '../../models/createCase.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AlertsService } from '../alert/alerts.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CreateCaseService {
  private apiURL = 'http://localhost:8081';
  constructor(private http: HttpClient, private _alert: AlertsService,private router:Router) {}

  createCaseInfo(caseInfo: ICaseInfo): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/api/save-case-info`, caseInfo).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        this._alert.error(
          '',
          `Unexpected error occurred. Please try again later`
        ).then(()=>{

          this.router.navigate(['/auth'])
          window.location.reload()
        })
        console.log('error in RegistrationService', error);
        return throwError(() => new Error(error));
      })
    );
  }

  createCaseRequirements(caseReq: ICaseDataRequirements): Observable<any>{
    return this.http.post<any>(`${this.apiURL}/api/save-case-requirements`, caseReq).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        this._alert.error(
          '',
          `Unexpected error occurred. Please try again later`
        ).then(()=>{

          this.router.navigate(['/auth'])
          window.location.reload()
        })
        console.log('error in RegistrationService', error);
        return throwError(() => new Error(error));
      })
    );
  }

  publishCaese(caseUUID: string): Observable<any>{
    return this.http.post<any>(`${this.apiURL}/api/publish-case`, {caseUUID:caseUUID}).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        this._alert.error(
          '',
          `Unexpected error occurred. Please try again later`
        ).then(()=>{

          this.router.navigate(['/cases-main/my-cases'])
          window.location.reload()
        })
        console.log('error in RegistrationService', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
