import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-cases',
  templateUrl: './top-cases.component.html',
  styleUrls: ['./top-cases.component.scss'],
})
export class TopCasesComponent {
  @Input() items: number = 6;
}
