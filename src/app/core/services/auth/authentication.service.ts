import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs';
import { AlertsService } from '../alert/alerts.service';
import { IParticipantData } from '../../models/participants.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiURL = 'http://localhost:8081';
  constructor(private http: HttpClient, private _alert: AlertsService) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/public/authenticate`, {
        username: username,
        password: password,
      })
      .pipe(
        map((response) => {
          if (response.status.code === '0' && response.result) {
            localStorage.setItem('token', response.result.token);
          } else {
            this._alert.error('', `${response.status.description}`);
          }

          return response;
        }),
        catchError((error) => {
          this._alert.error(
            '',
            `Unexpected error occured. Please try again later`
          );
          console.log('errorinAuthService', error);
          return throwError(() => new Error(error));
        })
      );
  }
  getHealthCheck(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/isAlive`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/forgotPassword`);
  }
  registerParticipant(formData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/public/register-participant`, formData)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          this._alert.error(
            '',
            `Unexpected error occurred. Please try again later`
          );
          console.log('error in RegistrationService', error);
          return throwError(() => new Error(error));
        })
      );
  }
  sendVerificationEmail(username: string, fullName: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/public/send-verification-email`, {
        username: username,
        fullName: fullName,
      })
      .pipe(
        catchError((error) => {
          this._alert.error(
            '',
            `Unexpected error occured. Please try again later`
          );
          console.log('errorinAuthService', error);
          return throwError(() => new Error(error));
        })
      );
  }
  sendVerificationCode(
    username: string,
    code: string | number
  ): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/public/verify-code`, {
        username: username,
        verificationCode: code.toString(),
      })
      .pipe(
        catchError((error) => {
          this._alert.error(
            '',
            `Unexpected error occured. Please try again later`
          );
          console.log('errorinAuthService', error);
          return throwError(() => new Error(error));
        })
      );
  }
}
