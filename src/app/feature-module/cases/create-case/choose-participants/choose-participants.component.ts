import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { IParticipantData } from 'src/app/core/models/participants.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { ParticipantsService } from 'src/app/core/services/participants/participants.service';
import { Router } from '@angular/router';
import { ICase } from 'src/app/core/models/createCase.interface';
import { MatStepper } from '@angular/material/stepper';
export interface UserData {
  id: string;
  participants: string;
  type: string;
  country: string;
  rating: string;
  details: string;
}


@Component({
  selector: 'app-choose-participants',
  templateUrl: './choose-participants.component.html',
  styleUrls: ['./choose-participants.component.scss']
})
export class ChooseParticipantsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() caseById!:ICase;
  @Input() newCaseUUID!:string;

  private readonly destroy$ = new Subject<void>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['select', 'participants', 'type', 'country','rating','details'];
  selection = new SelectionModel<IParticipantData | []>(true, []);
  dataSource!: MatTableDataSource<IParticipantData>;
  countries: string[] = [];
  types: string[] = [];
  continent:any[]=[];
  participantsList:IParticipantData[]=[];
  selectedCountries: string[] = [];
  selectedTypes: string[] = [];
  selectedContinents: string[] = [];
  searchInput: any = null;
  filteredDataSource!: MatTableDataSource<IParticipantData>;
  loading:boolean = false;
  showError: boolean=false;

  constructor(
     private _alert: AlertsService,
    private _participants:ParticipantsService,
    private router:Router,
    private stepper:MatStepper
    ){
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getParticipants();

    this.loading=true;
    setTimeout(()=>{
      this.loading=false;
    },1000);

  }

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

applyFilterMulti(): void {
  let filteredData = this.participantsList;

  if (this.selectedTypes.length > 0) {
      filteredData = filteredData.filter(row => row.participantType && this.selectedTypes.includes(row.participantType));
  }

  if (this.selectedCountries.length > 0) {
      filteredData = filteredData.filter(row => row.country && this.selectedCountries.includes(row.country));
  }

  if (this.selectedContinents.length > 0) {
      filteredData = filteredData.filter(row => row.continent && this.selectedContinents.includes(row.continent));
  }

  this.updateDataSource(filteredData);
}

onCheckboxChange(event: any, value: string, type: 'continent' | 'country' | 'type') {
  if (event.target.checked) {
      if (type === 'continent') {
          this.selectedContinents.push(value);
      } else if (type === 'country') {
          this.selectedCountries.push(value);
      } else if (type === 'type') {
          this.selectedTypes.push(value);
      }
  } else {
      if (type === 'continent') {
          const index = this.selectedContinents.indexOf(value);
          this.selectedContinents.splice(index, 1);
      } else if (type === 'country') {
          const index = this.selectedCountries.indexOf(value);
          this.selectedCountries.splice(index, 1);
      } else if (type === 'type') {
          const index = this.selectedTypes.indexOf(value);
          this.selectedTypes.splice(index, 1);
      }
  }
  this.applyFilterMulti();
}


updateDataSource(data: IParticipantData[]): void {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.filter = ''; // Clear the current filter
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSource.data);
}

checkboxLabel(row?: UserData): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}

applyFilters(
  country: string,
  type: string,
  search: string
): MatTableDataSource<IParticipantData> {
  let filteredData = this.dataSource.data; // Start with the complete data

  // Apply country filter if a country is selected
  if (country) {
    filteredData = filteredData.filter(item => item.country === country);
  }

  // Apply type filter if a type is selected
  if (type) {
    filteredData = filteredData.filter(item => item.participantType === type);
  }

  // Apply search filter if search input is provided
  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredData = filteredData.filter(item =>
      item.fullName?.toLowerCase().includes(lowerSearch)
    );
  }

  // Create and return a new MatTableDataSource with filtered data
  return new MatTableDataSource(filteredData);
}

getParticipants(){
  this._participants.getParticipants().subscribe({
    next: (res:any) => {
      if (res.status.code === '0' && res['result']) {
        this.participantsList = res['result'];
        this.dataSource = new MatTableDataSource(this.participantsList);
        this.dataSource.paginator = this.paginator;

        //perSelect if Edit
        if (this.caseById && this.caseById.allowedParticipants) {
          this.participantsList.forEach((participant:any) => {
            if (this.caseById.allowedParticipants?.includes(participant.username)) {
              this.selection.select(participant);
            }
          });
        }

          // Unique countries
        this.dataSource.data.forEach((row:any) => {
          if (!this.countries.includes(row.country)) {
            this.countries.push(row.country);
          }
        });
          // Unique continent
        this.dataSource.data.forEach((row:any) => {
          if (!this.continent.includes(row.continent)) {
            this.continent.push(row.continent);
          }
        });

        // Unique types
        this.dataSource.data.forEach((row:any) => {
          if (!this.types.includes(row.participantType)) {
            this.types.push(row.participantType);
          }
        });

      } else {
        this._alert.error('', `${res.status.description}`);
        return;
      }
    },
    error: (error:any) => {
      this._alert.error('', 'An error occurred.');
    }
  })
}

saveParticipants() {
  this.showError=false
  // Extract selected usernames from the participants
  const selectedUsernames = this.selection.selected.map((participant: any) => participant.username);

  // Determine the case UUID to use based on whether caseUUIDEdit is available
  const caseUUID = this.caseById ? this.caseById.uuid : this.newCaseUUID;

  if(selectedUsernames.length ===0){
    this.showError=true;
  } else{
    this._participants.choosenParticipants({ caseUUID, usernames: selectedUsernames }).subscribe({
      next: (res:any) => {
        if (res.status.code === '0') {
          this.stepper.next()
        } else {
          this._alert.error('', `${res.status.description}`);
          return;
        }
      },
      error: (error:any) => {
        this._alert.error('', 'An error occurred.');
      }
    })
  }
  // Invoke service to save chosen participants
  
}


viewProfile(event:Event){
  window.open('/user-profile/up-overview', '_blank');
  event.stopPropagation();
}
 ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
