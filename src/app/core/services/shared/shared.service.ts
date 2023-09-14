import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private refreshMyCases = new Subject<void>();
  refreshMyCases$ = this.refreshMyCases.asObservable();

  constructor() { }

  notifyMyCasesTable(){
    this.refreshMyCases.next()
  }
}
