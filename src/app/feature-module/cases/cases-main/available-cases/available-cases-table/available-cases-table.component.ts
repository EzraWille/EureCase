import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IAvailableCases } from 'src/app/core/models/availableCases';
import { IParticipantData } from 'src/app/core/models/participants.interface';
import { AlertsService } from 'src/app/core/services/alert/alerts.service';
import { GetCasesService } from 'src/app/core/services/cases/get-cases.service';
import { ParticipantsService } from 'src/app/core/services/participants/participants.service';
interface CombinedCase {
  budget: number;
  expiryDate: string;
  name: string;
  nickname: string;
  offerStatus: string;
  profilePicBase64: string;
  instituteName:string;
}
@Component({
  selector: 'app-available-cases-table',
  templateUrl: './available-cases-table.component.html',
  styleUrls: ['./available-cases-table.component.scss']
})
export class AvailableCasesTableComponent implements OnInit {
  availableCases:IAvailableCases[]=[];
  participantsList:IParticipantData[]=[];
  combinedResults:CombinedCase[]=[]
constructor(private _getCases:GetCasesService,private _alert:AlertsService,private _participants :ParticipantsService){

}
  ngOnInit(): void {

    this.getAvailableCase();


  }

  getAvailableCase(){
    this._getCases.getAvailableCases().subscribe(
      (res)=>{
        if (res.status.code === '0' && res['result']) {
         this.availableCases=res['result'];
         this.sortCaseByDate()
        } else {
          this._alert.error('', `${res.status.description}`);
          return
        }
      }
     )
  }
  sortCaseByDate(){
    this.availableCases.sort((a:any,b:any)=>{
      let dateA = new Date(a.expiryDate).getTime();
      let dateB = new Date(b.expiryDate).getTime();
      return dateA - dateB
    })
  }

  view(caseUUID:string){
    window.open(`/summary/summary/${caseUUID}?available=true`, '_blank');
  }



}
