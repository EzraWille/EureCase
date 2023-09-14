import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertsService } from '../alert/alerts.service';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCasesService {

  private apiURL = 'http://localhost:8081';
  constructor(private http: HttpClient, private _alert: AlertsService,private router:Router) {}

  getOwnerCases():Observable<any>{
    return this.http.get<any>(`${this.apiURL}/api/get-owner-cases`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        this._alert.error(
          '',
          `Unexpected error occurred. Please try again later`
        ).then(()=>{

        })
        console.log('error in RegistrationService', error);
        return throwError(() => new Error(error));
      })
    );

  }

  getCaseByID(caseUUID:string):Observable<any>{

    return this.http.get(`${this.apiURL}/api/get-business-case`,{
      params:{
        uuid:caseUUID
      }
    }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        this._alert.error(
          '',
          `Unexpected error occurred. Please try again later`
        ).then(()=>{

        })
        console.log('error in RegistrationService', error);
        return throwError(() => new Error(error));
      })
    );

  }

    getAvailableCases():Observable<any>{
        return this.http.get(`${this.apiURL}/api/get-available-cases`).pipe(
          map((response)=>{
            return  response ;
          }),
          catchError((error) => {
            this._alert.error(
              '',
              `Unexpected error occurred. Please try again later`
            ).then(()=>{

            })
            console.log('error in RegistrationService', error);
            return throwError(() => new Error(error));
          })
        )
  }
  getAvailableCaseByID(caseUUID:string):Observable<any>{

    return this.http.get(`${this.apiURL}/api/get-available-case`,{
      params:{
        uuid:caseUUID
      }
    }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        this._alert.error(
          '',
          `Unexpected error occurred. Please try again later`
        ).then(()=>{

        })
        console.log('error in RegistrationService', error);
        return throwError(() => new Error(error));
      })
    );

  }
  }


