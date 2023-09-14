import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ICase } from 'src/app/core/models/createCase.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { CreateCaseService } from 'src/app/core/services/cases/create-case.service';
import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-timeline/standalone';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/core/services/shared/shared.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit ,OnDestroy  {
  private readonly destroy$ = new Subject<void>();
  @ViewChild('timeline', { static: true }) timelineContainer!: ElementRef;
  @Input() caseById!:ICase;
  @Input() newCaseUUID!:string;

  isPublished = false;
  isProcessing = false;
  buttonText = 'Publish';
  ownerCase: ICase[] = [];
  caseUUID: string = '';
  currentCase!: any;
  timeline!: Timeline;
  viewSumamry:boolean=false;
  data: any;
  options:any;
  constructor(
    private _caseService: GetCasesService,
    private _alert: AlertsService,
    private _createCase:CreateCaseService,
    private router:Router,
    private dialog: MatDialog,
    private _sharedServic:SharedService
  ) {}

  ngOnInit(): void {
      this.caseUUID = this.caseById ? this.caseById.uuid : this.newCaseUUID;
      this.getCase()
  }
  private initializeTimeline(): void {
    this.getTimelineData();
    this.getOptions();
    this.timeline = new Timeline(
      this.timelineContainer.nativeElement,
      this.data,
      this.options
    );
  }
  togglePublish(event: Event): void {
    event.preventDefault();
    Swal.fire({
      title: 'Ready to Publish?',
      text: 'Once you publish, there is no way to edit the case. Are you sure you want to proceed?',
      showCancelButton: true,
      confirmButtonColor: '#009042',
      cancelButtonColor: '#d6d6d6',
      confirmButtonText: 'Publish',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProcessing = true;
    // Simulate an asynchronous action (like an API call)
    this._createCase.publishCaese(this.caseUUID).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          if (res.status.code === '0') {
            this.isProcessing = false;
            this.isPublished = true;
            this.buttonText = 'Publised';
            this._sharedServic.notifyMyCasesTable()
         this.dialog.closeAll()
          } else {
            this._alert.error('', `${res.status.description}`);
            this.isProcessing = false;
            this.isPublished = false;
            this.buttonText = 'Publish';
            return;
          }
        },
        error: (error: any) => {
          this._alert.error('', 'An error occurred.');
          this.isProcessing = false;
        },
      }
    )
      }
    });


}
  getTimelineData() {
    const timelineData = this.currentCase.paymentPlanning.map((task:any) => ({
      id: task.id,
      content: task.name,
      start: task.startDate,
      end: task.endDate,
    }));
    this.data = new DataSet(timelineData);

  }
  getOptions() {
    this.options = {
      stack: true,
      editable: false,
      selectable: false,
      height: '350px',
      timeAxis: {
        step: 2,
        scale: 'day',
      },

    };
  }

  getCase() {
    this._caseService.getCaseByID(this.caseUUID).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.status.code === '0' && res['result']) {
         this.currentCase = res['result']
         if(this.currentCase.paymentPlanningMethod === 'DELIVERABLES'){
          this.initializeTimeline();
         }
        } else {
          this._alert.error('', `${res.status.message}`);
        }
      },
      error: (error) => {
        this._alert.error('', 'An error occurred.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  printPage(){
    const newWindow = window.open(`/summary/summary/${this.caseUUID}?print=true`, '_blank');
    if (!newWindow) {
        console.error('Failed to open new window');
    }

  }
}
