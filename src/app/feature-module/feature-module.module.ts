import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureModuleRoutingModule } from './feature-module-routing.module';
import { FeatureModuleComponent } from './feature-module.component';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';


@NgModule({
  declarations: [FeatureModuleComponent,SidebarComponent,HeaderComponent],
  imports: [CommonModule, FeatureModuleRoutingModule],
})
export class FeatureModuleModule {}
