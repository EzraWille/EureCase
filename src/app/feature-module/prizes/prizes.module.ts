import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrizesRoutingModule } from './prizes-routing.module';
import { PrizesComponent } from './prizes/prizes.component';
import { PrizesMainComponent } from './prizes-main/prizes-main.component';


@NgModule({
  declarations: [
    PrizesComponent,
    PrizesMainComponent
  ],
  imports: [
    CommonModule,
    PrizesRoutingModule
  ]
})
export class PrizesModule { }
