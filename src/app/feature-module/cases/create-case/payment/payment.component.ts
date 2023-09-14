import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Subject,
  combineLatest,
  distinctUntilChanged,
  take,
  takeUntil,
} from 'rxjs';
import { ICase } from 'src/app/core/models/createCase.interface';
import { CaseDataSharingService } from 'src/app/core/services/cases/case-data-sharing.service';
import { PaymentStateService } from 'src/app/core/services/cases/payment-state.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input() caseById!: ICase;
  @Input() newCaseUUID!: string;

  caseDuration!: number;
  durationType!: string; // Values: 'year', 'month', 'day'
  monthlyPayments!: number;
  quarterlyPayments!: number;
  selectedPaymentOption!: string;
  initialzied:boolean=false;
  constructor(
    private _dateShare: CaseDataSharingService,
    private _paymentState: PaymentStateService
  ) {}

  ngOnInit(): void {
    //keep the opend option open when chaing steps back or next
    //this.handleSelectingOption()
    this.initialzied=true;
    this.getData()
    this.handelEditMode();
  }
  handleSelectingOption(){
    this._paymentState.selectedOption$
    .pipe(take(1))
    .subscribe((option) => (this.selectedPaymentOption = option || ''));
  }
  handelEditMode(){
    if (this.caseById) {
      this.selectedPaymentOption =
          this.caseById.paymentPlanningMethod === 'MONTHLY'
            ? '1'
            : this.caseById.paymentPlanningMethod === 'QUARTERLY'
            ? '2'
            : '3';
    
    }

  }
  getData() {
    //handle case info updates
    this._dateShare.change$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selectedPaymentOption = '';
    });

    //get latest updated duration 
    combineLatest([
      this._dateShare.durationType$,
      this._dateShare.researchDuration$,
    ])
      .pipe(
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([durationType, researchDuartion]) => {
        if(this.caseById) {
          if(this.initialzied){
            this.durationType=this.caseById.durationType ;
            this.caseDuration= this.caseById.duration ;
            this.initialzied=false
          }else{
            this.durationType=  durationType !== this.caseById.durationType ? durationType : this.caseById.durationType
          this.caseDuration=  researchDuartion !== this.caseById.duration ? researchDuartion : this.caseById.duration
          }
        } else{
          this.durationType = durationType;
          this.caseDuration = researchDuartion;
        }
        this.calculatePayments();
      });
  }

  onPaymentOptionChange(event: Event) {
    this.selectedPaymentOption = (event.target as HTMLInputElement).value;
    this._paymentState.setSelectedOption(this.selectedPaymentOption);
  }

  calculatePayments() {
    let totalMonths: number;
    if (this.durationType === 'YEAR') {
      totalMonths = this.caseDuration * 12; // Convert years to months
    } else if (this.durationType === 'MONTH') {
      totalMonths = this.caseDuration; // Already in months
    } else if (this.durationType === 'DAY') {
      totalMonths = Math.ceil(this.caseDuration / 30); // Convert days to months (assuming 30 days per month)
    } else {
      console.error('Invalid duration type');
      return;
    }
    this.monthlyPayments = totalMonths;
    // Calculate quarterly payment (rounded up)
    this.quarterlyPayments = Math.ceil(totalMonths / 3);
  }

  paymentMethods = [
    { id: '1', label: 'Monthly', value: '1' },
    { id: '2', label: 'Quarterly', value: '2' },
    { id: '3', label: 'Deliverables', value: '3' },
  ];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
