import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ICase } from 'src/app/core/models/createCase.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-timeline/standalone';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit ,OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @ViewChild('timeline', { static: true }) timelineContainer!: ElementRef;


  caseUUID: string = '';
  currentCase!: any;
  timeline!: Timeline;
  viewSumamry:boolean=false;
  data: any;
  options:any;

  availableCaseMode: boolean =false;
  isSubmitted = false;
  isProcessing = false;
  buttonText = 'Submit';

  constructor(
    private _caseService: GetCasesService,
    private _alert: AlertsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param:any)=>{
      if(param.get('caseUUID')){
         this.caseUUID= param.get('caseUUID');
        this.viewSumamry=true
        }
    })

  this.activatedRoute.queryParams.subscribe(params => {
    if (params['available'] === 'true') {

       this.getAvailableCase();
    }else{
      this.getCases()
    }

});


    this.activatedRoute.queryParams.subscribe(params => {
      if (params['print'] === 'true') {
          window.print();
      }

  });

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
  getTimelineData() {
    console.log(" this.currentCase.paymentPlanning", this.currentCase.paymentPlanning)
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
  getCases() {
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
getAvailableCase(){
this._caseService.getAvailableCaseByID(this.caseUUID).pipe(takeUntil(this.destroy$)).subscribe({
  next: (res) => {
    if (res.status.code === '0' && res['result']) {
     this.currentCase = res['result']
     this.availableCaseMode=true;
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
  printPage(){
    if(this.timeline !== undefined){
      this.timeline.fit();
    this.timeline.redraw();
    }
    setTimeout(() => {
      window.print();
    }, 500);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  togglePublish(event: Event): void {
    event.preventDefault();
    if(this.isSubmitted===false){
      Swal.fire({
        title: 'Confirm Submission?',
        text: 'Please review all details carefully before proceeding. Do you wish to continue?',
        showCancelButton: true,
        confirmButtonColor: '#009042',
        cancelButtonColor: '#d6d6d6',
        confirmButtonText: 'Publish',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.isProcessing = true;
          setTimeout(()=>{ this.isProcessing = false;
                    this.isSubmitted = true;
                     this.buttonText = 'Submitted';},1000)
      // Simulate an asynchronous action (like an API call)
      // this._createCase.publishCaese(this.caseUUID).pipe(takeUntil(this.destroy$)).subscribe(
      //   {
      //     next: (res: any) => {
      //       if (res.status.code === '0') {
      //         this.isProcessing = false;
      //         this.isSubmitted = true;
      //         this.buttonText = 'Publised';
      //         this._sharedServic.notifyMyCasesTable()
      //      this.dialog.closeAll()
      //       } else {
      //         this._alert.error('', `${res.status.description}`);
      //         this.isProcessing = false;
      //         this.isSubmitted = false;
      //         this.buttonText = 'Publish';
      //         return;
      //       }
      //     },
      //     error: (error: any) => {
      //       this._alert.error('', 'An error occurred.');
      //       this.isProcessing = false;
      //     },
      //   }
      // )
        }
      });

    } else {
       return
    }

}
}
