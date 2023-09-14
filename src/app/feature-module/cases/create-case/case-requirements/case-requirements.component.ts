import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CreateCaseService } from 'src/app/core/services/cases/create-case.service';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { ICase, ICaseRequirement } from 'src/app/core/models/createCase.interface';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
class Requirements {
  uuid!: string;
  caseRequirements!: ICaseRequirement[];
}

@Component({
  selector: 'app-case-requirements',
  templateUrl: './case-requirements.component.html',
  styleUrls: ['./case-requirements.component.scss']
})
export class CaseRequirementsComponent  implements OnInit , OnDestroy {
  @Input() caseById!:ICase;
  @Input() newCaseUUID!:string;

  private readonly destroy$ = new Subject<void>();


  requirements: any[] = [];
  requirementForm!: FormGroup;
  loading:boolean=false;
  ownerCase: ICase[] = [];
  currentCase!: any;

  constructor(
    private fb: FormBuilder,
    private _caseService: CreateCaseService,
    private _alert: AlertsService,
    private snackBar: MatSnackBar,
    private _getCases: GetCasesService,
    private stepper: MatStepper
    ) {}

  ngOnInit() {
    this.reqForm();
    if (this.caseById) {
      this.currentCase = this.caseById;
     if(this.caseById.caseRequirements){
      this.requirements = this.caseById.caseRequirements
     }
    }
    this.loading=true;
    setTimeout(()=>{
      this.loading=false;
    },1000);


  }

  reqForm(){
    this.requirementForm = this.fb.group({
      name: ['', [Validators.required, this.uniqueRequirementNameValidator(this.requirements)]],
      type: ['', Validators.required],
      responsibility: ['', Validators.required],
      owner: ['', Validators.required],
      description: ['', [Validators.required, this.minAbstractLength(10)]],
    });
  }

  uniqueRequirementNameValidator(requirements: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (requirements.some(req => req.name === value)) {
        return { duplicateName: true };
      }
      return null;
    };
  }

  minAbstractLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.trim().length < minLength) {
        return { minAbstractLength: true };
      }
      return null;
    };
  }



  createCaseReq(isDraft: boolean) {
    if (this.requirements.length === 0) {
      Swal.fire({
        title: 'No Requirements Added',
        text: 'Do you want to proceed ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bebebe',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Next Step',
      }).then((result) => {
        if (result.isConfirmed) {
          this.caseCreateAPI(isDraft);
        }
      });
    }else{
      this.caseCreateAPI(isDraft);
    }
  }

  caseCreateAPI(isDraft: boolean) {
    const caseReq = new Requirements();
    if (this.caseById) {
      caseReq.uuid = this.caseById.uuid;
    } else {
      caseReq.uuid = this.newCaseUUID;
    }
    caseReq.caseRequirements = this.requirements;
    this._caseService.createCaseRequirements(caseReq).subscribe((res) => {
      if (res.status.code === '0') {
        if (isDraft) {
          this.snackBar.open('Draft saved successfully', '', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['green-snackbar'],
          });
        }
      this.stepper.next()
      } else {
        this._alert.error('', `${res.status.description}`);
        return;
      }
    });
  }


  addRequirement() {
    if (this.requirementForm.valid) {
      const requirement = this.requirementForm.value;
      this.requirements.push(requirement);
      this.requirementForm.reset();
    }
  }

  deleteRequirement(index: number) {
    this.requirements.splice(index, 1);
  }


  get name() {
    return this.requirementForm.get('name') as FormControl;
  }
  get type() {
    return this.requirementForm.get('type') as FormControl;
  }
  get responsibility() {
    return this.requirementForm.get('responsibility') as FormControl;
  }

  get owner() {
    return this.requirementForm.get('owner') as FormControl;
  }
  get description() {
    return this.requirementForm.get('description') as FormControl;
  }
  get requirementsLength(): number {
    return this.requirements.length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
