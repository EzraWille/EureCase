import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureModuleComponent } from './feature-module.component';
import { authGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FeatureModuleComponent,
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'welcome',
        loadChildren: () =>
          import('./splash-screen/splash-screen.module').then(
            (m) => m.SplashScreenModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'cases-main',
        loadChildren: () =>
          import('./cases/cases.module').then((m) => m.CasesModule),
      },
      {
        path: 'offers-main',
        loadChildren: () =>
          import('./offers/offers.module').then((m) => m.OffersModule),
      },
      {
        path: 'contracts-main',
        loadChildren: () =>
          import('./contracts/contracts.module').then((m) => m.ContractsModule),
      },
      {
        path: 'cases-management',
        loadChildren: () =>
          import('./cases-management/cases-management.module').then(
            (m) => m.CasesManagementModule
          ),
      },
      {
        path: 'prizes',
        loadChildren: () =>
          import('./prizes/prizes.module').then((m) => m.PrizesModule),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then((m) => m.FinanceModule),
      },
      {
        path: 'summary',
        loadChildren: () =>
          import('./summary/summary.module').then((m) => m.SummaryModule),
      },
    ],
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureModuleRoutingModule {}
