import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [{ path: '', component: DashboardMainComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}