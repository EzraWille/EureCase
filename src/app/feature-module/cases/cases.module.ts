import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CasesRoutingModule } from './cases-routing.module';
import { CasesMainComponent } from './cases-main/cases-main.component';
import { CasesHeaderComponent } from './cases-header/cases-header.component';
import { MyCasesComponent } from './cases-main/my-cases/my-cases.component';
import { AvailableCasesComponent } from './cases-main/available-cases/available-cases.component';
import { ParticipatedInCasesComponent } from './cases-main/participated-in-cases/participated-in-cases.component';
import { MatTabsModule } from '@angular/material/tabs';
import { InlineSVGModule } from 'ng-inline-svg';
import { MyCasesChartComponent } from './cases-main/my-cases/my-cases-chart/my-cases-chart.component';
import { MyCasesChartTwoComponent } from './cases-main/my-cases/my-cases-chart-two/my-cases-chart-two.component';
import { MyCasesTableComponent } from './cases-main/my-cases/my-cases-table/my-cases-table.component';
import { CreateCaseComponent } from './create-case/create-case.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CaseInfoComponent } from './create-case/case-info/case-info.component';
import { CaseRequirementsComponent } from './create-case/case-requirements/case-requirements.component';
import { MatStepperModule } from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChooseParticipantsComponent } from './create-case/choose-participants/choose-participants.component';
import { QuillModule } from 'ngx-quill';
import { PaymentComponent } from './create-case/payment/payment.component';
import { MonthlyQuartarlyComponent } from './create-case/payment/monthly-quartarly/monthly-quartarly.component';
import { DeliverablesComponent } from './create-case/payment/deliverables/deliverables.component';
import { CounterChartComponent } from './create-case/payment/counter-chart/counter-chart.component';
import { PublishComponent } from './create-case/publish/publish.component';
import { AvailableCasesTableComponent } from './cases-main/available-cases/available-cases-table/available-cases-table.component';
import { TruncateWordsModule } from 'src/app/core/pipes/truncate-words/truncate-words.module';


@NgModule({
  declarations: [
    CasesMainComponent,
    CasesHeaderComponent,
    MyCasesComponent,
    AvailableCasesComponent,
    ParticipatedInCasesComponent,
    MyCasesChartComponent,
    MyCasesChartTwoComponent,
    MyCasesTableComponent,
    CreateCaseComponent,
    CaseInfoComponent,
    CaseRequirementsComponent,
    ChooseParticipantsComponent,
    PaymentComponent,
    MonthlyQuartarlyComponent,
    DeliverablesComponent,
    CounterChartComponent,
    PublishComponent,
    AvailableCasesTableComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    InlineSVGModule,
    MatStepperModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    FormsModule,
    QuillModule.forRoot(),
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    NgApexchartsModule,
    CasesRoutingModule,
    ReactiveFormsModule,
    TruncateWordsModule,
  ],
})
export class CasesModule {}
