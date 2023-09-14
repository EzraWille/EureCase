import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { TopCasesComponent } from './dashboard-main/top-cases/top-cases.component';
import { NotificationsComponent } from './dashboard-main/notifications/notifications.component';
import { WidgetsComponent } from './dashboard-main/widgets/widgets.component';
import { PastCasesComponent } from './dashboard-main/past-cases/past-cases.component';
import { SpinnerModule } from 'src/app/core/loader/spinner/spinner.module';
import { DashboardHeaderComponent } from './dashboard-main/dashboard-header/dashboard-header.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardMainComponent,
    TopCasesComponent,
    NotificationsComponent,
    WidgetsComponent,
    PastCasesComponent,
    DashboardHeaderComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    InlineSVGModule,
    SpinnerModule,
  ],
})
export class DashboardModule {}
