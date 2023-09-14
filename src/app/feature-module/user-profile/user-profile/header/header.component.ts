import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountUp } from 'countup.js';
@Component({
  selector: 'profile-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('prizesCounter',{static: true}) prizesCounter!:ElementRef
  @ViewChild('casesCounter',{static: true}) casesCounter!:ElementRef

  ngOnInit(): void {
   this.startCounter(this.prizesCounter.nativeElement,25);
   this.startCounter(this.casesCounter.nativeElement,230);
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
