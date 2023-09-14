import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementMainComponent } from './management-main/management-main.component';
import { CasesManagementComponent } from './cases-management/cases-management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementMainComponent,
    children: [{ path: 'case-managment', component: CasesManagementComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasesManagementRoutingModule {}
