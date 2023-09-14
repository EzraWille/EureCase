import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary/summary.component';
import { SummaryHeaderComponent } from './summary-header/summary-header.component';


@NgModule({
  declarations: [
    SummaryComponent,
    SummaryHeaderComponent
  ],
  imports: [
    CommonModule,
    SummaryRoutingModule
  ],
  exports:[SummaryComponent]
})
export class SummaryModule { }
