import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cases-main',
  templateUrl: './cases-main.component.html',
  styleUrls: ['./cases-main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CasesMainComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'My Cases',
        link: './my-cases',
        index: 0,
      },
      {
        label: 'Available Cases',
        link: './available-Cases',
        index: 1,
      },
      {
        label: 'Participated-In Cases ',
        link: './participated-in-cases',
        index: 2,
      },
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });
  }

 
}
