import { Component } from '@angular/core';

@Component({
  selector: 'app-past-cases',
  templateUrl: './past-cases.component.html',
  styleUrls: ['./past-cases.component.scss']
})
export class PastCasesComponent {
onHandCases:any[]=[
{
  img: 'https://cdn.iconscout.com/icon/free/png-256/free-adidas-12-722648.png',
  name:'Addidas',
  domain:'Industrial',
  dueDate:'00/00/0000',
  status:'Approved'
},
{
  img: 'https://cdn.iconscout.com/icon/free/png-256/free-mercedes-8-202855.png',
  name:'Mercedes',
  domain:'Industrial',
  dueDate:'00/00/0000',
  status:'In progress'
},
{
  img: 'https://cdn.iconscout.com/icon/free/png-256/free-nvidia-282591.png',
  name:'Nvidia',
  domain:'Industrial',
  dueDate:'00/00/0000',
  status:'Pending'
},
{
  img: 'https://cdn.iconscout.com/icon/free/png-256/free-ford-1-202767.png',
  name:'Ford',
  domain:'Industrial',
  dueDate:'00/00/0000',
  status:'Rejected'
},
{
  img: 'https://cdn.iconscout.com/icon/free/png-256/free-huawei-3628839-3030116.png',
  name:'Huawei ',
  domain:'Industrial',
  dueDate:'00/00/0000',
  status:'Completed'
},
]
}
