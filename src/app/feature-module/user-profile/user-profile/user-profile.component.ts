import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'Overview',
        link: './up-overview',
        index: 0,
      },
      {
        label: 'Documents',
        link: './up-documents',
        index: 1,
      },
      {
        label: 'Account Details',
        link: './account-details',
        index: 2,
      },
      {
        label: 'Edit Profile',
        link: './account-settings',
        index: 3,
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
