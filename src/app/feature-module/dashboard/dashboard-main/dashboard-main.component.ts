import { Component } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent {
  constructor(public _loader: LoaderService) {}
}
