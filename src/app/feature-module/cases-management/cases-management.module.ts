import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasesManagementRoutingModule } from './cases-management-routing.module';
import { CasesManagementComponent } from './cases-management/cases-management.component';
import { ManagementMainComponent } from './management-main/management-main.component';


@NgModule({
  declarations: [
    CasesManagementComponent,
    ManagementMainComponent
  ],
  imports: [
    CommonModule,
    CasesManagementRoutingModule
  ]
})
export class CasesManagementModule { }
