import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasesMainComponent } from './cases-main/cases-main.component';

import { MyCasesComponent } from './cases-main/my-cases/my-cases.component';
import { AvailableCasesComponent } from './cases-main/available-cases/available-cases.component';
import { ParticipatedInCasesComponent } from './cases-main/participated-in-cases/participated-in-cases.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CasesMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'my-cases',
        pathMatch: 'full',
      },
      {
        path: 'my-cases',
        component: MyCasesComponent,
      },
      {
        path: 'available-Cases',
        component: AvailableCasesComponent,
      },
      {
        path: 'participated-in-cases',
        component: ParticipatedInCasesComponent,
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasesRoutingModule {}
