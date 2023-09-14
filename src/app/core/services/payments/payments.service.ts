import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertsService } from '../alert/alerts.service';
import { IPerodicPayment } from '../../models/perodicPayments';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IDelivarblePayment } from '../../models/deliverablePayments';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private apiURL = 'http://localhost:8081';
  constructor(private http: HttpClient, private _alert: AlertsService) {}

  postPeriodicPayment(perodicPayment:IPerodicPayment):Observable<any>{
    return this.http.post<any>(`${this.apiURL}/api/save-periodic-payments`,perodicPayment).pipe(
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

  postDeliverablePayment(delivarblePayment:IDelivarblePayment):Observable<any>{
    return this.http.post<any>(`${this.apiURL}/api/save-deliverable-payments`,delivarblePayment).pipe(
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
