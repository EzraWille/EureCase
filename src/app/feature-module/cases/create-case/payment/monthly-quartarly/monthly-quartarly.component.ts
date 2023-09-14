import { IPerodicPayment } from './../../../../../core/models/perodicPayments';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from 'src/app/core/services/payments/payments.service';
import { CountUp } from 'countup.js';
import { CaseDataSharingService } from 'src/app/core/services/cases/case-data-sharing.service';
import { Subject, takeUntil } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICase } from 'src/app/core/models/createCase.interface';
interface IPaymentData {
  paymentNo: number;
  percentage: number;
  amount: number;
  isValid: boolean;
}
interface Ipay {
  paymentNo: number;
  percentage: number;
  amount: number;
}
class PerodicPaymentGenerate {
  caseUUID!: string;
  planningMethod!: string;
  payments!: Ipay[];
}
@Component({
  selector: 'app-monthly-quartarly',
  templateUrl: './monthly-quartarly.component.html',
  styleUrls: ['./monthly-quartarly.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(250)]),
      transition(':leave', [animate(250, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MonthlyQuartarlyComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @ViewChild('BudgetTotalCounter', { static: true })
  BudgetTotalCounter!: ElementRef;
  @ViewChild('budgetSpentCounter', { static: true })
  budgetSpentCounter!: ElementRef;


  @Input() monthlyPayments!: number;
  @Input() quarterlyPayments!: number;
  @Input() caseById!: ICase;
  @Input() newCaseUUID!: string;

  months: string[] = ['Month 1', 'Month 2', 'Month 3'];
  dataSource!: MatTableDataSource<IPaymentData>;
  displayedColumns: string[] = ['payment', 'percentage', 'amount'];
  payments: IPaymentData[] = [];
  noOfPaymentsDisplayed!:number;
  totalBudget!: number;
  totalBudgetDisplayed!: number;
  selectedMonths = new FormControl([]);
  amount: number | undefined;
  showAlert: boolean = false;
  budgetSpent!: number;
  emptyField: boolean = false;
  remainBudget: boolean = false;
  displayedPercentage: number = 0;
  paymentPlanning: any[] = [];
  showPopup: boolean = false;
  percentagePreview: any;
  previousPercentage: string | null = null;
  paymentDates: Date[] = [];
    previousBudget!:number;
  firstChange:boolean=true;
  loading: boolean=false;

  constructor(
    private _payment: PaymentsService,
    private dataShare: CaseDataSharingService,
    private snackBar: MatSnackBar,
    private _alert: AlertsService,
    private stepper: MatStepper
  ) {
    this.dataSource = new MatTableDataSource<IPaymentData>(this.payments);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.loader()
    if (this.caseById && this.caseById.paymentPlanning.length !== 0) {
      this.previousBudget = this.caseById.budget;
      this.handleEditMode()
  } else {
    this.initializePayments();
  }
  this.getData();
  }
  loader(){
    this.loading=true;
    setTimeout(()=>this.loading=false,2000);
  }
  handleEditMode(){
    if(this.caseById.paymentPlanningMethod==='QUARTERLY'){
      if (this.monthlyPayments !== undefined) {
        // means we are on tab 1 which we need to reset
        this.resetMonthlyPayments()
      } else if(this.quarterlyPayments !== undefined && this.quarterlyPayments === this.caseById.paymentPlanning.length){
        //means we are on tab 2 and noOfpayments is not changed
        this.handleQuarterlyEditMode()
      } else if(this.quarterlyPayments !== undefined && this.quarterlyPayments !== this.caseById.paymentPlanning.length){
        // we are on Tab 2 and noOfpayments is changed
        this.resetQuartetlyPayments()
      }
    } else if (this.caseById.paymentPlanningMethod==='MONTHLY'){
      if(this.quarterlyPayments !== undefined){
        // we are on tab 2 we need to reset
        this.resetQuartetlyPayments()
      } else if(this.monthlyPayments !== undefined && this.monthlyPayments === this.caseById.paymentPlanning.length ){
        // means we are on tab 1 and noOfpayments is not changed
        this.handleMonthlyEditMode()
      } else if(this.monthlyPayments !== undefined && this.monthlyPayments !== this.caseById.paymentPlanning.length){
        // we are on Tab 1 and noOfpayments is changed
        this.resetMonthlyPayments()
      }

    }else {
      this.initializePayments()
    }
  }
  handleMonthlyEditMode(){
    for (
      let paymentNo = 1;
      paymentNo <= this.monthlyPayments;
      paymentNo++
    ) {
      this.payments.push({
        paymentNo: paymentNo,
        percentage: this.caseById.paymentPlanning[paymentNo-1].percentage,
        amount: this.caseById.paymentPlanning[paymentNo-1].amount,
        isValid: true,
      });
    }
    this.noOfPaymentsDisplayed = 0;
    this.totalBudgetDisplayed=0;
    this.startCounter(
      this.BudgetTotalCounter.nativeElement,
      0,
      this.totalBudgetDisplayed
    );
    this.budgetSpent=this.caseById.budget;
    this.displayedPercentage=100;
  }
  resetMonthlyPayments(){


    this.getLastestBudget()
    this.payments=[]
    for (let paymentNo = 1; paymentNo <= this.monthlyPayments; paymentNo++) {
      this.payments.push({
        paymentNo: paymentNo,
        percentage: 0,
        amount: 0,
        isValid: true,
      });
    }
    console.log(this.payments)
    this.dataSource.data=this.payments
    this.noOfPaymentsDisplayed = this.monthlyPayments;
  }
  resetQuartetlyPayments(){
    this.loading=true
    this.getLastestBudget()
    this.payments=[]
    for (
      let paymentNo = 1;
      paymentNo <= this.quarterlyPayments;
      paymentNo++
    ) {
      this.payments.push({
        paymentNo: paymentNo,
        percentage: 0,
        amount: 0,
        isValid: true,
      });
    }
    this.dataSource.data=this.payments
    this.noOfPaymentsDisplayed = this.quarterlyPayments;
  }
  handleQuarterlyEditMode(){
    for (
      let paymentNo = 1;
      paymentNo <= this.quarterlyPayments;
      paymentNo++
    ) {
      this.payments.push({
        paymentNo: paymentNo,
        percentage: this.caseById.paymentPlanning[paymentNo-1].percentage,
        amount: this.caseById.paymentPlanning[paymentNo-1].amount,
        isValid: true,
      });
    }
    this.noOfPaymentsDisplayed = 0;
  this.totalBudgetDisplayed=0;
  this.startCounter(
    this.BudgetTotalCounter.nativeElement,
   0,
    this.totalBudgetDisplayed
  );
  this.budgetSpent=this.caseById.budget;
  this.displayedPercentage=100;
  }
  
  getData() {
    this.dataShare.totalOriginalBudge$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if(this.caseById){
          this.totalBudget = this.caseById.budget;
          if(  data === this.caseById.budget && this.caseById.paymentPlanning.length !==0){
            this.totalBudgetDisplayed = 0
            this.startCounter(
              this.BudgetTotalCounter.nativeElement,
              0,
              this.totalBudgetDisplayed
            );
          } else if(  data === this.caseById.budget && this.caseById.paymentPlanning.length ===0){
            this.totalBudgetDisplayed = data
            this.startCounter(
              this.BudgetTotalCounter.nativeElement,
              0,
              this.totalBudgetDisplayed
            );
          } else{
            this.totalBudgetDisplayed = data
          console.log('data',data)
          console.log('totalBudgetDisplayed',this.totalBudgetDisplayed)
          this.startCounter(
            this.BudgetTotalCounter.nativeElement,
            this.totalBudget,
            this.totalBudgetDisplayed
          );
          if(this.totalBudgetDisplayed !== 0) {
            this.totalBudget = data;
            this.totalBudgetDisplayed = data;
            console.log('totalBudgetDisplayed',this.totalBudgetDisplayed)
            this.startCounter(
              this.BudgetTotalCounter.nativeElement,
              this.totalBudget,
              this.totalBudgetDisplayed
            );
            this.resetMonthlyPayments();
             this.resetQuartetlyPayments();
             }
        }


      } else {
        this.totalBudget = data;
        this.totalBudgetDisplayed = data;
        this.startCounter(
          this.BudgetTotalCounter.nativeElement,
          this.totalBudget,
          this.totalBudgetDisplayed
        );
      }
    });
  }
  initializePayments(): void {
    if (this.monthlyPayments !== undefined) {
      for (let paymentNo = 1; paymentNo <= this.monthlyPayments; paymentNo++) {
        this.payments.push({
          paymentNo: paymentNo,
          percentage: 0,
          amount: 0,
          isValid: true,
        });
      }

      this.noOfPaymentsDisplayed = this.monthlyPayments;
    } else {
      for (
        let paymentNo = 1;
        paymentNo <= this.quarterlyPayments;
        paymentNo++
      ) {
        this.payments.push({
          paymentNo: paymentNo,
          percentage: 0,
          amount: 0,
          isValid: true,
        });
      }
      this.noOfPaymentsDisplayed = this.quarterlyPayments;
    }
  }
  onPercentageInput(payment: IPaymentData): void {
    this.emptyField = false;
    this.remainBudget = false;
    this.showAlert = false;
    this.percentagePreview = payment.percentage;
    let currentPercentage = payment.percentage
      ? payment.percentage.toString()
      : '';

    if (
      !payment.percentage ||
      (this.previousPercentage &&
        this.previousPercentage.length > currentPercentage.length)
    ) {
      this.percentagePreview =
        Number(this.previousPercentage) - Number(currentPercentage);
      this.showPopup = false;
    }
    if (!payment.percentage) {
      this.clearPayment(payment);
    } else {
      this.calculateAmount(payment, payment.percentage);
      this.showPopup = true;
      setTimeout(() => {
        this.showPopup = false;
      }, 1100);
    }

    this.previousPercentage = currentPercentage;
  }
  calculateAmount(payment: IPaymentData, parsedPercentage: number): void {
    if (
      isNaN(parsedPercentage) ||
      parsedPercentage < 0 ||
      parsedPercentage > 100
    ) {
      payment.isValid = false;
      payment.percentage = 100;
    } else {
      payment.amount = (parsedPercentage / 100) * this.totalBudget;
      payment.isValid = true;
      this.validateBudget();
    }
  }
  getLastestBudget(){
    this.dataShare.totalOriginalBudge$
    .pipe(takeUntil(this.destroy$)).subscribe((data)=> {
      this.totalBudget=data
      this.totalBudgetDisplayed =data;
      console.log('latestData',data);
      this.startCounter(
        this.BudgetTotalCounter.nativeElement,
       0,
        this.totalBudgetDisplayed
      );
    })
  }
  clearPayment(payment: IPaymentData): void {
    payment.amount = 0;
    payment.isValid = true;
    this.validateBudget();
  }
  validateBudget(): void {
    let allocatedAmount = 0;
    let paymentsWithZeroValue = 0;
    let allocatedPercentage = 0;

    this.showAlert = false;

    this.payments.forEach((payment) => {
      allocatedAmount += payment.amount;
      if (payment.amount === 0) {
        paymentsWithZeroValue++;
      }
    });

    this.noOfPaymentsDisplayed = paymentsWithZeroValue;
    this.totalBudgetDisplayed = this.totalBudget - allocatedAmount;
    this.startCounter(
      this.BudgetTotalCounter.nativeElement,
      this.totalBudget,
      this.totalBudgetDisplayed
    );
    this.budgetSpent = allocatedAmount;
    this.startCounter(
      this.budgetSpentCounter.nativeElement,
      0,
      this.budgetSpent
    );

    this.payments.forEach((payment) => {
      allocatedPercentage += Number(payment.percentage);
    });
    this.displayedPercentage = allocatedPercentage;

    if (this.totalBudgetDisplayed < 0) {
      this.showAlert = true;
    }
  }
  apply(isDraft: boolean) {
    this.emptyField = false;
    this.remainBudget = false;

    for (let payment of this.payments) {
      if (payment.percentage === null || payment.percentage === 0) {
        this.emptyField = true;
        break;
      }
    }




    if (!this.remainBudget && !this.emptyField) {
      const perodicPayment = new PerodicPaymentGenerate() as IPerodicPayment;

      const uuid = this.caseById ? this.caseById.uuid : this.newCaseUUID;

      perodicPayment.caseUUID = uuid;
      perodicPayment.planningMethod = this.quarterlyPayments
        ? 'QUARTERLY'
        : 'MONTHLY';

      perodicPayment.payments = this.payments.map((payment) => {
        const { isValid, ...paymentWithoutIsValid } = payment;
        return paymentWithoutIsValid;
      });

      this._payment.postPeriodicPayment(perodicPayment).subscribe({
        next: (res: any) => {
          if (res.status.code === '0') {
            if (isDraft) {
              this.snackBar.open('Draft saved successfully', '', {
                duration: 3000, // Duration in milliseconds
                panelClass: ['green-snackbar'],
              });
            } else {
              this.stepper.next();
            }
          } else {
            this._alert.error('', `${res.status.description}`);
            return;
          }
        },
        error: (error: any) => {
          this._alert.error('', 'An error occurred.');
        },
      });
    }
  }
  startCounter(element: HTMLElement, startValue: number, endValue: number) {
    const options = {
      startVal: startValue,
      duration: 2, // this sets the duration for 2 seconds. Adjust as needed.
    };

    const countDown = new CountUp(element, endValue, options);
    if (!countDown.error) {
      countDown.start();
    } else {
      console.error(countDown.error);
    }
  }
}
