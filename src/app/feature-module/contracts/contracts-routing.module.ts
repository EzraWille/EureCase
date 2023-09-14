import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsMainComponent } from './contracts-main/contracts-main.component';
import { ContractsComponent } from './contracts/contracts.component';

const routes: Routes = [
  {
    path: '',
    component: ContractsMainComponent,
    children: [{ path: 'userProfile', component: ContractsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractsRoutingModule {}
