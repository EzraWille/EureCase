import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
interface Account {
  name: string;
  id: number;
  icon: string;
  iconUnchecked: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private router: Router) {}

  accountType!: string;
  selectedAccountId!: number | undefined;
  accounts: Account[] = [
    {
      name: 'Business Owner',
      id: 1,
      icon: '../../../../assets/img/icons/register/business_owner.svg',
      iconUnchecked:
        '../../../../assets/img/icons/register/business_owner_unchecked.svg',
    },
    {
      name: 'Researcher',
      icon: '../../../../assets/img/icons/register/researcher.svg',
      id: 2,
      iconUnchecked:
        '../../../../assets/img/icons/register/researcher_unchecked.svg',
    },
    {
      name: 'Individual',
      id: 3,
      icon: '../../../../assets/img/icons/register/individual.svg',
      iconUnchecked:
        '../../../../assets/img/icons/register/individual_unchecked.svg',
    },
  ];

  selectAccount(account: Account) {
    this.accountType = account.name;
    this.selectedAccountId = account.id;
  }
  createAccountType() {
    let type;
    switch (this.selectedAccountId) {
      case 1:
        type = 'BUSINESS';
        break;
      case 2:
        type = 'RESEARCHER';
        break;
      case 3:
        type = 'INDIVIDUAL';
        break;
      default:
        type = '';
        break;
    }

    if (type) {
      this.router.navigate(['auth/register-form'], {
        queryParams: { accountType: type },
      });
    }
  }
}
