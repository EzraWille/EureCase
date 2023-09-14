import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance/finance.component';
import { FinanceMainComponent } from './finance-main/finance-main.component';


@NgModule({
  declarations: [
    FinanceComponent,
    FinanceMainComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule
  ]
})
export class FinanceModule { }
