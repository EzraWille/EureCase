import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsMainComponent } from './contracts-main/contracts-main.component';
import { ContractsComponent } from './contracts/contracts.component';


@NgModule({
  declarations: [
    ContractsMainComponent,
    ContractsComponent
  ],
  imports: [
    CommonModule,
    ContractsRoutingModule
  ]
})
export class ContractsModule { }
