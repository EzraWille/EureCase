import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
const apiURL = 'http://localhost:8081';

export function emailAvailabilityValidator(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;

    if (!email) {
      return of(null);
    }

    return http
      .post<any>(`${apiURL}/public/check-username`, { username: email })
      .pipe(
        map((response) => {
          if (response.status.code === '0') {
            return null; // Email is valid and available
          } else {
            return { emailNotAvailable: true }; // Email is not valid or already in use
          }
        }),
        catchError(() => of(null)) // Handle API errors gracefully
      );
  };
}
