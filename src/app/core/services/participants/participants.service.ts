import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertsService } from '../alert/alerts.service';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IParticipantVisiblity } from '../../models/saveParticipants';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  private apiURL = 'http://localhost:8081';
  constructor(private http: HttpClient, private _alert: AlertsService,private router:Router) {}
  getParticipants():Observable<any>{
    return this.http.get<any>(`${this.apiURL}/api/get-participants`).pipe(
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
  choosenParticipants(participantsUsernames:IParticipantVisiblity):Observable<any>{
    return this.http.post<any>(`${this.apiURL}/api/save-case-participants-visibility`,participantsUsernames).pipe(
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
