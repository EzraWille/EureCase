import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrizesMainComponent } from './prizes-main/prizes-main.component';
import { PrizesComponent } from './prizes/prizes.component';

const routes: Routes = [
  {
    path: '',
    component: PrizesMainComponent,
    children: [{ path: 'userProfile', component: PrizesComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrizesRoutingModule {}
