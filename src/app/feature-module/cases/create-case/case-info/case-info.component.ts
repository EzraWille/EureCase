import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { ICase } from 'src/app/core/models/createCase.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { CreateCaseService } from 'src/app/core/services/cases/create-case.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillViewComponent } from 'ngx-quill';
import { CaseDataSharingService } from 'src/app/core/services/cases/case-data-sharing.service';
import Swal from 'sweetalert2';

export class CaseInfoGenerate {
  uuid!: string;
  name!: string;
  caseAbstract!: string;
  budget!: number;
  startDate!: string;
  expiryDate!: string;
  duration!: number;
  durationType!: DurationType;
  caseType!: CaseType;
  nickname!: string;


}
export enum DurationType {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}
export enum CaseType {
  DESCRIPTIVE = 'DESCRIPTIVE',
  ILLUSTRATIVE = 'ILLUSTRATIVE',
  CUMULATIVE = 'CUMULATIVE',
  CRITICAL_INSTANCE = 'CRITICAL_INSTANCE',
}
@Component({
  selector: 'app-case-info',
  templateUrl: './case-info.component.html',
  styleUrls: ['./case-info.component.scss']
})
export class CaseInfoComponent implements OnInit {
  @Input() caseById!:ICase;
  @Input() newCaseUUID!:string;

  public quillconfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'size': ['xsmall', 'small', 'medium', 'large', 'xlarge'] }],
        [{ 'align': [] }],
        ['clean'],
        ['link']
      ]
    }
  };


  private readonly destroy$ = new Subject<void>();
  @ViewChild('editor') editor!:QuillViewComponent;
  ownerCase: ICase[] = [];
  formBasics!:FormGroup;
  loading:boolean=false;
  caseAbs:any;
  resetPaymentForm:boolean=false;
  warningFlags:any = {
    publishDate: false,
    caseBudget: false,
    researchDuration: false,
    durationType: false
  };
  constructor(
    private _getCases: GetCasesService,
    private fb: FormBuilder,
    private _alert:AlertsService,
    private _caseService:CreateCaseService,
    private snackBar: MatSnackBar,
    private dataShare:CaseDataSharingService,
    ){
  }

  ngOnInit(): void {
    this.formBasicInfo(this.caseById);
    this.publishDate.valueChanges.subscribe(()=>this.dataShare.notifyChange());
    this.caseBudget.valueChanges.subscribe(()=>this.dataShare.notifyChange());
     this.durationType.valueChanges.subscribe(()=>this.dataShare.notifyChange());
     this.researchDuration.valueChanges.subscribe(()=>this.dataShare.notifyChange());
    this.loading=true;
    setTimeout(()=>{
      this.loading=false;
    },1000);

  }
 warnUser(control: AbstractControl,flagKey: string) {
if(this.caseById){
  if (this.warningFlags[flagKey]) {
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'Any change in Publish Date, Budget , or Research Duaration will cause the payment plan to reset.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Yes, change it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isDismissed) {
      // Reset the value to its original state if the user decides not to change
      control.setValue(control.value);
    } else {
      this.warningFlags[flagKey] = true;
    }
  });
  this.warningFlags[flagKey] = true;
}
}


  formBasicInfo(caseById:ICase){
    this.formBasics = this.fb.group(
      {
        caseType: [caseById? caseById.caseType:'', Validators.required],
        caseName: [caseById? caseById.name:'', Validators.required],
        caseNickname: [caseById? caseById.nickname:'', Validators.required],
        caseBudget: [caseById? caseById.budget:0, [Validators.required, Validators.min(0)]], // Adding the caseBudget field
        caseAbstract: [caseById? caseById.caseAbstract:'', [Validators.required,this.minAbstractLength(20)]],
        publishDate: [caseById? caseById.startDate:'', [Validators.required]],
        expiryDate: [caseById? caseById.expiryDate:'', [Validators.required]],
        researchDuration: [caseById? caseById.duration:'', [Validators.required]],
        durationType: [caseById? caseById.durationType:'MONTH', [Validators.required]],
      },
      { validators: this.dateValidator }
    );
  }
  minAbstractLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.trim().length < minLength) {
        return { minAbstractLength: true };
      }
      return null;
    };
  }
  dateValidator(group: FormGroup): ValidationErrors | null {
    const fromCtrl = group.get('publishDate');
    const toCtrl = group.get('expiryDate');

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

  createCaseInfo(isDraft:boolean){
    this.loading=true
     setTimeout(()=>{
      this.loading=false;
    },1000);
    const caseInfo = new CaseInfoGenerate();
    if(this.caseById){
      caseInfo.uuid = this.caseById.uuid;

    } else{
      caseInfo.uuid = this.newCaseUUID;
    }

    caseInfo.name = this.formBasics.get('caseName')?.value;
    caseInfo.budget = this.formBasics.get('caseBudget')?.value;
    caseInfo.startDate = this.formBasics.get('publishDate')?.value;
    caseInfo.nickname = this.formBasics.get('caseNickname')?.value;
    caseInfo.expiryDate = this.formBasics.get('expiryDate')?.value;
    caseInfo.durationType = this.formBasics.get('durationType')?.value;
    caseInfo.duration = this.formBasics.get('researchDuration')?.value;
    caseInfo.caseType = this.formBasics.get('caseType')?.value;
    caseInfo.caseAbstract = this.formBasics.get('caseAbstract')?.value;
    this.dataShare.setPublishDate(this.formBasics.get('publishDate')?.value)
    this.dataShare.setresearchDuration(this.formBasics.get('researchDuration')?.value)
    this.dataShare.setdurationType(this.formBasics.get('durationType')?.value)
    this.dataShare.setBudget(this.formBasics.get('caseBudget')?.value)
    this._caseService.createCaseInfo(caseInfo).subscribe((res) => {
      if (res.status.code === '0') {
        if (isDraft) {
          this.snackBar.open('Draft saved successfully', '', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['green-snackbar'],
          });
        }
      } else {
        this._alert.error('', `${res.status.description}`);
        return;
      }
    });

  }

  get caseType() {
    return this.formBasics.get('caseType') as FormControl;
  }
  get caseNickname() {
    return this.formBasics.get('caseNickname') as FormControl;
  }
  get caseAbstract() {
    return this.formBasics.get('caseAbstract') as FormControl;
  }
  get caseBudget() {
    return this.formBasics.get('caseBudget') as FormControl;
  }
  get caseName() {
    return this.formBasics.get('caseName') as FormControl;
  }
  get publishDate() {
    return this.formBasics.get('publishDate') as FormControl;
  }
  get expiryDate() {
    return this.formBasics.get('expiryDate') as FormControl;
  }
  get researchDuration() {
    return this.formBasics.get('researchDuration') as FormControl;
  }
  get durationType() {
    return this.formBasics.get('durationType') as FormControl;
  }

  resetPayment(){
    this.resetPaymentForm=true
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}





