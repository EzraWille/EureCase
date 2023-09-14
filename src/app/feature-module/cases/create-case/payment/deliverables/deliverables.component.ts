import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-timeline/standalone';
import { ToDateService } from 'src/app/core/services/date/to-date.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CaseDataSharingService } from 'src/app/core/services/cases/case-data-sharing.service';
import { CountUp } from 'countup.js';
import { IDelivarblePayment } from 'src/app/core/models/deliverablePayments';
import { PaymentsService } from 'src/app/core/services/payments/payments.service';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { MatStepper } from '@angular/material/stepper';
import { ICase } from 'src/app/core/models/createCase.interface';

interface Deliverable {
  name: string;
  percentage: number;
  amount: number;
  startDate: string;
  endDate: string;
  description: string;
  relatedTo: string | null;
  relationType: string | null;
}

export class DeliverableGenerate {
  caseUUID!: string;
  deliverables!: Deliverable[];
}

interface ITask {
  id: number;
  title: string;
  start: string;
  end: string;
  amount: number;
  percentage: number;
  relation?: string; // Add this property
  relatedTo?: number;
  description?: string; // Add this property
}

interface IRelation {
  task: any;
  relation: any;
  relatedTo: any;
}

@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html',
  styleUrls: ['./deliverables.component.scss'],
})

export class DeliverablesComponent implements OnInit, OnDestroy {
  @ViewChild('casesCounter', { static: true }) casesCounter!: ElementRef;
  @ViewChild('budgetSpentCounter', { static: true })
  budgetSpentCounter!: ElementRef;
  @ViewChild('PercentageCounter', { static: true })
  PercentageCounter!: ElementRef;

  private readonly destroy$ = new Subject<void>();
  totalBudget!: number;
  totalBudgetDisplayed!: number;
  budgetSpent: number = 0;
  timeline!: Timeline;
  options!: {};
  relationsList: IRelation[] = [];
  data: any;
  groups: any;
  tasksList: ITask[] = [];
  lastUsedId: number = 0; // Initialize with 0
  percentageCounterDisplay: number = 0;
  @ViewChild('timeline', { static: true }) timelineContainer!: ElementRef;
  dataSource = new MatTableDataSource<ITask>(this.tasksList);

  deliveryForm!: FormGroup;
  loading: boolean = false;
  publishDate!: string;
  relationForm!: FormGroup;

  @Input() caseById!: ICase;
  @Input() newCaseUUID!: string;
  showRelationError: boolean = false;
  validPercentage: boolean = true;
  showAlert: boolean = false;
  amountFromPercentage: any;
  remainBudget = false;
  invalidTaskName!: string;
  invalidRelatiedTaskName!: string;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private toDate: ToDateService,
    private _alert: AlertsService,
    private dataShare: CaseDataSharingService,
    private _payment: PaymentsService,
    private stepper: MatStepper
  ) {
    this.getTimelineData();
    this.getOptions();
  }

  ngOnInit() {
    this.getData();

    if (this.caseById && this.caseById.paymentPlanning.length !== 0){
   this.tasksList= this.caseById.paymentPlanning.map(item => ({
      id: item.id,
      title: item.name,
      start: item.startDate,
      end: item.endDate,
      amount: item.amount,
      percentage: item.percentage,
      relation: item.relationType,
      relatedTo: item.relatedTo,
      description: item.description
    }));
    
    }

    this.initializeLoading();
    this.initializeTimeline();
    this.initializeDeliverableForm();
    this.relationFormGroup();
    // this.getCaseById()
  }

  getData() {
    this.dataShare.publishDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.publishDate = data;
      });
    this.dataShare.totalOriginalBudge$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if(this.caseById){
          this.totalBudget = this.caseById.budget;
          if(  data === this.caseById.budget && this.caseById.paymentPlanning.length !==0){
            this.totalBudgetDisplayed = 0
            this.startCounter(
              this.casesCounter.nativeElement,
              0,
              this.totalBudgetDisplayed
            );
            this.budgetSpent=this.caseById.budget
            this.percentageCounterDisplay=100
          } else if(  data === this.caseById.budget && this.caseById.paymentPlanning.length ===0){
            this.totalBudgetDisplayed = data
            this.startCounter(
              this.casesCounter.nativeElement,
              0,
              this.totalBudgetDisplayed
            );
          } else{
            this.totalBudgetDisplayed = data
          console.log('data',data)
          console.log('totalBudgetDisplayed',this.totalBudgetDisplayed)
          this.startCounter(
            this.casesCounter.nativeElement,
            this.totalBudget,
            this.totalBudgetDisplayed
          );
          if(this.totalBudgetDisplayed !== 0) {
            this.totalBudget = data;
            this.totalBudgetDisplayed = data;
            console.log('totalBudgetDisplayed',this.totalBudgetDisplayed)
            this.startCounter(
              this.casesCounter.nativeElement,
              this.totalBudget,
              this.totalBudgetDisplayed
            );

             }
        }


      } else {
        this.totalBudget = data;
        this.totalBudgetDisplayed = data;
        this.startCounter(
          this.casesCounter.nativeElement,
          this.totalBudget,
          this.totalBudgetDisplayed
        );
      }
      });
    this.startCounter(
      this.casesCounter.nativeElement,
      0,
      this.totalBudgetDisplayed
    );
  }

  private initializeLoading(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  relationFormGroup() {
    this.relationForm = this.fb.group(
      {
        predecessorRelation: [null, Validators.required],
        predecessorTask: ['', Validators.required],
        successorRelation: [null, Validators.required],
        successorTask: [null, Validators.required],
      },

    );
  }



  //realtion form getters

  get task() {
    return this.relationForm.get('task') as FormControl;
  }

  getFilteredTasksForRelatedTo(): any[] {
    const selectedTasks = this.relationForm.get('task')?.value || [];
    return this.tasksList.filter((task) => !selectedTasks.includes(task.id));
  }

  onSubmitRelation() {
    const formData = this.relationForm.value;
    const combinedRelation = `${formData.predecessorRelation}-${formData.successorRelation}`;

    const mainTask = this.tasksList.find(
      (task) => task.title === formData.predecessorTask
    ) as ITask;
    const relatedTask = this.tasksList.find(
      (task) => task.title === formData.successorTask
    ) as ITask;

    if (!this.validateDates(mainTask, relatedTask, combinedRelation)) {
      this.showRelationError = false;
      this.relationsList.push({
        task: formData.predecessorTask,
        relation: combinedRelation,
        relatedTo: formData.successorTask,
      });
      this.relationForm.reset();
    }
  }

  private initializeTimeline(): void {
    this.getTimelineData();
    this.getOptions();
    this.timeline = new Timeline(
      this.timelineContainer.nativeElement,
      this.data,
      this.options
    );
    this.timeline.on('move', this.handleTaskMove.bind(this));
  }
  getTimelineData() {
    const timelineData = this.tasksList.map((task) => ({
      id: task.id,
      content: this.getContent(task.title, ''),
      start: task.start,
      end: task.end,
    }));
    this.data = new DataSet(timelineData);
    // this.timeline.setItems(this.data);
  }
  getContent = (title: any, perecnt: any) => {
    const item = document.createElement('div');
    const name = document.createElement('div');
    const nameClasses = ['fw-bolder', 'mb-2'];

    name.classList.add(...nameClasses);
    name.innerHTML = title;

    const percentage = document.createElement('div');
    const nameClassesPercent = ['fw-bolder', 'mb-2', 'text-gold'];
    percentage.classList.add(...nameClassesPercent);
    percentage.innerHTML = `(${perecnt} %)`;

    item.appendChild(name);
    // item.appendChild(percentage);

    return item;
  };
  getOptions() {
    this.options = {
      stack: true,
      editable: true,
      selectable: true,
      height: '350px',
      timeAxis: {
        step: 2,
        scale: 'day',
      },
      onMove: (item: any, callback: any) => {
        this.showRelationError = false;
        this.updateTaskStartEndDate(item);
        callback(item);
      },

      onRemove: (item: any, callback: any) => {
        // Check if you really want to delete this item
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.isConfirmed) {
            const taskIndex = this.tasksList.findIndex(
              (task) => task.id === item.id
            );

            if (taskIndex !== -1) {
              this.tasksList.splice(taskIndex, 1);
            }

            // Call the callback with true to confirm the item's deletion
            callback(true);
          } else {
            // If not confirmed, call the callback with false to prevent removal
            callback(false);
          }
        });
      },
    };
  }

  handleTaskMove(event: any) {
    this.updateTaskStartEndDate(event);
  }

  private updateTaskStartEndDate(item: any): void {
    const task = this.tasksList.find((t) => t.id === item.id);
    if (task) {
      task.start = this.toDate.transform(item.start, 'yyyy-MM-dd');
      task.end = this.toDate.transform(item.end, 'yyyy-MM-dd');
      this.updateTasksList();
      this.getTimelineData();
      this.validateTaskRelations(task);
    }
  }
  validateTaskRelations(task: ITask): void {
    // For each relation in relationsList involving the updated task, check its validity.
    for (const relation of this.relationsList) {
      if (relation.task === task.title) {

        const relatedTask = this.tasksList.find(
          (t) => t.title === relation.relatedTo
        ) as ITask;
        const currentRelationType = relation.relation;

        this.validateDates(task, relatedTask, currentRelationType);
      }
      if (task.title === relation.relatedTo) {
        const task1 = this.tasksList.find(
          (t) => t.title === relation.task
        ) as ITask;
        const relatedTask = this.tasksList.find(
          (t) => t.title === relation.relatedTo
        ) as ITask;
        const currentRelationType = relation.relation;
        this.validateDates(task1, relatedTask, currentRelationType);
      }
    }
  }

  private updateTasksList() {
    this.tasksList = [...this.tasksList];
  }


  validateDates(task: ITask, relatedTask: ITask, relation: string): boolean {
    this.showRelationError = false;

    if (!relatedTask) return true;
    if (task.title === relatedTask.title) {
      this.showRelationError = true;
      this.invalidTaskName = task.title;
      this.invalidRelatiedTaskName = relatedTask.title;
      return true;
    }

    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
    const relatedTaskStartDate = new Date(relatedTask.start);
    const relatedTaskEndDate = new Date(relatedTask.end);

    let error = false;
    switch (relation) {
      case 'start-finish':
        error = taskStartDate > relatedTaskEndDate;
        break;
      case 'finish-start':
        error = taskEndDate > relatedTaskStartDate;
        break;
      case 'start-start':
        error = taskStartDate > relatedTaskStartDate;
        break;
      case 'finish-finish':
        error = taskEndDate > relatedTaskEndDate;
        break;
    }

    this.invalidTaskName = task.title;
    this.invalidRelatiedTaskName = relatedTask.title;

    this.showRelationError = error;

    return error;
  }

  initializeDeliverableForm() {
    this.deliveryForm = this.fb.group(
      {
        title: [
          '',
          [
            Validators.required,
            this.uniqueRequirementNameValidator(this.tasksList),
          ],
        ],
        startDate: ['', Validators.required],
        endDate: ['', [Validators.required]],
        percentage: [
          null,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(100),
            Validators.pattern('^[0-9]*$'),
          ],
        ],
        amount: [''],
        description: ['', [Validators.required, this.minAbstractLength(10)]],
        relation: [''],
        relatedTo: [null],
      },
      { validators: this.dateValidator }
    );
  }

  dateValidator(group: FormGroup): ValidationErrors | null {
    const fromCtrl = group.get('startDate');
    const toCtrl = group.get('endDate');

    // Check if both dates are selected
    if (!fromCtrl?.value || !toCtrl?.value) {
      return null; // No validation error if either date is not selected
    }

    const fromDate = new Date(fromCtrl.value);
    const toDate = new Date(toCtrl.value);

    return fromDate > toDate
      ? { issueDateGreater: 'Publish date is greater than expiry date' }
      : null;
  }
  // DeliverableForm getters
  get title() {
    return this.deliveryForm.get('title') as FormControl;
  }

  get startDate() {
    return this.deliveryForm.get('startDate') as FormControl;
  }

  get endDate() {
    return this.deliveryForm.get('endDate') as FormControl;
  }

  get percentageDelivery() {
    return this.deliveryForm.get('percentage') as FormControl;
  }

  get amount() {
    return this.deliveryForm.get('amount') as FormControl;
  }

  get description() {
    return this.deliveryForm.get('description') as FormControl;
  }

  get relation() {
    return this.deliveryForm.get('relation') as FormControl;
  }

  get relatedTo() {
    return this.deliveryForm.get('relatedTo') as FormControl;
  }

  uniqueRequirementNameValidator(tasksList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return tasksList.some((req) => req.content === control.value)
        ? { duplicateName: true }
        : null;
    };
  }

  minAbstractLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value && control.value.trim().length < minLength
        ? { minAbstractLength: true }
        : null;
    };
  }

  addRequirement() {
    this.remainBudget = false;
    if (
      this.deliveryForm.valid &&
      !(this.amountFromPercentage > this.totalBudgetDisplayed)
    ) {
      this.amountFromPercentage = 0;
      const task = this.deliveryForm.value;
      this.processAndAddTask(task, parseFloat(task.percentage));
    }
  }

  private processAndAddTask(task: ITask, parsedPercentage: number): void {
    if (this.isValidPercentage(parsedPercentage)) {
      this.setTaskAmount(task, parsedPercentage);
      this.addToTasksList(task);
      this.refreshTimelineData();
      this.validateBudget();
    }
  }

  private isValidPercentage(parsedPercentage: number): boolean {
    if (
      isNaN(parsedPercentage) ||
      parsedPercentage < 0 ||
      parsedPercentage > 100
    ) {
      this.validPercentage = false;
      return false;
    }
    this.validPercentage = true;
    return true;
  }

  private setTaskAmount(task: ITask, parsedPercentage: number): void {
    task.amount = (parsedPercentage / 100) * this.totalBudget;
  }

  private addToTasksList(task: any): void {
    const newId = ++this.lastUsedId;
    const startDate = task.startDate;
    const endDateString = task.endDate;
    this.tasksList.push({
      id: newId,
      title: task.title,
      start: startDate,
      end: endDateString,
      percentage: task.percentage,
      amount: task.amount,
      description: task.description,
      relation: task.relation,
      relatedTo: task.relatedTo,
    });
    let allocatedPercentage = 0;
    this.tasksList.forEach((task) => {
      allocatedPercentage += Number(task.percentage);
    });
    this.percentageCounterDisplay = allocatedPercentage;
    this.deliveryForm.reset();
  }

  private refreshTimelineData(): void {
    this.getTimelineData();
    this.getOptions();
    this.timeline.setItems(this.data);
    this.timeline.setOptions(this.options);
  }

  // ... rest of the methods remain unchanged

  validateBudget(): void {
    let allocatedAmount = 0;
    this.showAlert = false;
    this.tasksList.forEach((task) => {
      allocatedAmount += task.amount;
    });
    let pastBudget = this.totalBudgetDisplayed;
    this.totalBudgetDisplayed = this.totalBudget - allocatedAmount;
    this.startCounter(
      this.casesCounter.nativeElement,
      this.totalBudget,
      this.totalBudgetDisplayed
    );
    this.budgetSpent = allocatedAmount;
    this.startCounter(
      this.budgetSpentCounter.nativeElement,
      0,
      this.budgetSpent
    );
    if (this.totalBudgetDisplayed < 0) {
      this.showAlert = true;
    }
  }

  getAmount(event: any) {
    this.amountFromPercentage =
      (parseFloat(event.target?.value) / 100) * this.totalBudget;
    if (isNaN(this.amountFromPercentage)) {
      this.amountFromPercentage = 0;
    }
  }
  get percentage() {
    return this.deliveryForm.get('percentage') as FormControl;
  }
  get taskTitle() {
    return this.deliveryForm.get('taskTitle') as FormControl;
  }
  deleteRequirement(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let task = this.tasksList[index];
        this.totalBudgetDisplayed += this.totalBudget * (task.percentage / 100);
        this.startCounter(
          this.casesCounter.nativeElement,
          0,
          this.totalBudgetDisplayed
        );
        this.percentageCounterDisplay -= task.percentage;
        this.budgetSpent -= this.totalBudget * (task.percentage / 100);
        this.startCounter(
          this.budgetSpentCounter.nativeElement,
          0,
          this.budgetSpent
        );
        this.relationsList = this.relationsList.filter(
          (relation) =>
            relation.task !== task.title && relation.relatedTo !== task.title
        );
        this.tasksList.splice(index, 1);
        this.getTimelineData(); // Update timeline data
        this.getOptions(); // Update timeline options
        this.timeline.setItems(this.data); // Update timeline data
        this.timeline.setOptions(this.options);
      }
    });
  }
  deleteRelation(index: number) {
    this.relationsList.splice(index, 1);
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

  apply(isDraft: boolean) {
    this.remainBudget = false;
    if (this.totalBudgetDisplayed !== 0) {
      this.remainBudget = true;
    }
    if (
      this.totalBudgetDisplayed === 0 &&
      !this.showRelationError &&
      !this.showAlert &&
      this.validPercentage
    ) {
      const postDeliverable = new DeliverableGenerate() as IDelivarblePayment;
      const uuid = this.caseById ? this.caseById.uuid : this.newCaseUUID;

      const combineArrays = (tasks: ITask[], relations: IRelation[]) => {
        return tasks.map((task) => {
          const relation = relations.find((rel) => rel.task === task.title);

          return {
            name: task.title,
            percentage: task.percentage,
            amount: task.amount,
            startDate: task.start,
            endDate: task.end,
            description: task.description,
            relatedTo: relation ? relation.relatedTo.trim() : null, // Trim to remove extra spaces
            relationType: relation ? relation.relation : null,
          };
        });
      };

      const deliverables = combineArrays(
        this.tasksList,
        this.relationsList
      ) as Deliverable[];

      postDeliverable.caseUUID = uuid;
      postDeliverable.deliverables = deliverables;

      this._payment.postDeliverablePayment(postDeliverable).subscribe({
        next: (res: any) => {
          if (res.status.code === '0') {
            if (isDraft) {
              this.snackBar.open('Draft saved successfully', '', {
                duration: 3000, // Duration in milliseconds
                panelClass: ['green-snackbar'],
              });
            } else {
              this.stepper.next()
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

