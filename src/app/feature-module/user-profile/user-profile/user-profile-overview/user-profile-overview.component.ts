import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountUp } from 'countup.js';

@Component({
  selector: 'app-user-profile-overview',
  templateUrl: './user-profile-overview.component.html',
  styleUrls: ['./user-profile-overview.component.scss']
})
export class UserProfileOverviewComponent implements OnInit {
  @ViewChild('publishedCases',{static: true}) publishedCasesCounter!:ElementRef
  @ViewChild('activeCases',{static: true}) activeCasesCounter!:ElementRef
  @ViewChild('pendingCases',{static: true}) pendingCasesCounter!:ElementRef

  ngOnInit(): void {
   this.startCounter(this.publishedCasesCounter.nativeElement,200);
   this.startCounter(this.activeCasesCounter.nativeElement,43);
   this.startCounter(this.pendingCasesCounter.nativeElement,55);
  }

  startCounter(element:HTMLElement,targetValue:number){
    const countUp = new CountUp(element,targetValue);
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  }
}
