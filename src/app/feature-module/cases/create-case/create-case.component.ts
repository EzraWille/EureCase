import { Component, Inject, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Subject, takeUntil } from 'rxjs';
import { CaseInfoComponent } from './case-info/case-info.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PaymentComponent } from './payment/payment.component';
import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { ICase } from 'src/app/core/models/createCase.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';


@Component({
  selector: 'app-create-case',
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.scss'],
})
export class CreateCaseComponent implements OnInit,OnDestroy {
  @ViewChild('caseInfo', { static: false }) caseInfoComp!: CaseInfoComponent;
  @ViewChild('paymentComp', { static: false }) paymentComp!: PaymentComponent;

  private readonly destroy$ = new Subject<void>();

  isLinear = false;
  isPaymentStepActivated: boolean = false;
  isPublishStepActivated: boolean = false;
  loading:boolean=false;
  newCaseUid: string = '';
  isOptional = false;
  caseUUID:string = '';
  ownerCase: ICase[] = [];
  currentCase!: any;
  DialogTitle:string = 'Create Case';
constructor(
    public dialogRef: MatDialogRef<CreateCaseComponent>,
    private _getCases : GetCasesService,
    private _alert:AlertsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.caseUUID=this.data;
    if(this.caseUUID){this.loading=true}
    // Assign the data to the data source for the table to render
  }

ngOnInit(): void {
  if(this.caseUUID){
    this.getCaseByID()
    this.DialogTitle='Edit Case';
  }else{
    this.newCaseUid = uuidv4();
  }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog';
    this.dialogRef.updateSize('90vw', '90%');
  }

getCaseByID(){
  this.loading=true
    this._getCases.getCaseByID(this.caseUUID).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res:any) => {
        if (res.status.code === '0' && res['result']) {
          this.currentCase = res['result'];
          this.loading=false
        } else {
          this._alert.error('', `${res.status.message}`);
          this.loading=false
        }
      },
      error: (error:any) => {
        this._alert.error('', 'An error occurred.');
      }
    });
  }

closeDialog() {
    this.dialogRef.close();
  }

onStepChange(event: StepperSelectionEvent) {
  if (event.selectedIndex === 3) {
    this.paymentComp.getData()
  }
  this.isPaymentStepActivated = event.selectedIndex === 3;
  this.isPublishStepActivated = event.selectedIndex === 4;
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}


}
