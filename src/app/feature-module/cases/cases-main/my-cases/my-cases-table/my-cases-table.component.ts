import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICase } from 'src/app/core/models/createCase.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { CreateCaseComponent } from '../../../create-case/create-case.component';
import { SharedService } from 'src/app/core/services/shared/shared.service';

@Component({
  selector: 'app-my-cases-table',
  templateUrl: './my-cases-table.component.html',
  styleUrls: ['./my-cases-table.component.scss']
})
export class MyCasesTableComponent implements OnInit {
  ownerCases:ICase[]=[]
  displayedCases: ICase[] = [];
  itemsPerPage = 10; // Number of items to display per page
  currentPage = 1; // Current page number
  sortByBudgetAscending: boolean = false; // Default to descending
  sortByStatusAscending: boolean = false; // Default to descending
  sortByExpiryDateAscending: boolean = false;
  constructor(private _getCases:GetCasesService,private _alert:AlertsService,private router:Router,private dialog:MatDialog, private _sharedService:SharedService){

  }
  ngOnInit(): void {
   this.getCases();
   this._sharedService.refreshMyCases$.subscribe(()=>{
    this.getCases();
  })
  }
  getCases(){
    this._getCases.getOwnerCases().subscribe(
      (res)=>{
        if (res.status.code === '0' && res['result']) {

         this.ownerCases=res['result'];
         this.sortCaseByDate()
        } else {
          this._alert.error('', `${res.status.description}`);
          return
        }
      }
     )
  }


  sortCaseByDate(){
    this.ownerCases.sort((a,b)=>{
      let dateA = new Date(a.expiryDate).getTime();
      let dateB = new Date(b.expiryDate).getTime();
      return dateA - dateB
    })
  }

  toggleSortCasesByBudget() {
    this.sortByBudgetAscending = !this.sortByBudgetAscending; // Toggle direction
    this.ownerCases.sort((a, b) => {
      if (this.sortByBudgetAscending) {
        return a.budget - b.budget; // Ascending order
      }
      return b.budget - a.budget; // Descending order
    });
  }

  toggleSortCasesByStatus() {
    this.sortByStatusAscending = !this.sortByStatusAscending; // Toggle direction
    this.ownerCases.sort((a, b) => {
      if (a.status === "PUBLISHED" && b.status !== "PUBLISHED") {
        return this.sortByStatusAscending ? 1 : -1;
      }
      if (b.status === "PUBLISHED" && a.status !== "PUBLISHED") {
        return this.sortByStatusAscending ? -1 : 1;
      }
      return 0; // If both have the same status, retain their positions
    });
  }
  toggleSortCasesByExpiryDate() {
    this.sortByExpiryDateAscending = !this.sortByExpiryDateAscending;
    this.ownerCases.sort((a, b) => {
      let dateA = new Date(a.expiryDate).getTime();
      let dateB = new Date(b.expiryDate).getTime();
      if (this.sortByExpiryDateAscending) {
        return dateA - dateB; // Ascending order
      }
      return dateB - dateA; // Descending order
    });
  }

  summary(uuid:string){
    window.open(`/summary/summary/${uuid}`, '_blank');
  }
  editCase(uuid:string){
      const dialogRef = this.dialog.open(CreateCaseComponent,{
        width: '100%',
        height:'90vh',
        panelClass: 'custom-container',
        data:uuid
      })
  }
}
