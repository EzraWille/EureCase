import { Component, ElementRef, ViewChild } from '@angular/core';
import { CreateCaseComponent } from '../create-case/create-case.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/core/services/shared/shared.service';

@Component({
  selector: 'app-cases-header',
  templateUrl: './cases-header.component.html',
  styleUrls: ['./cases-header.component.scss'],
})
export class CasesHeaderComponent {
  @ViewChild('backgroundVideo', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;
  showPlayButton: boolean = true;

  constructor(public dialog: MatDialog, private _sharedServic:SharedService) {}
  ngOnInit(): void {}

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    if (video) {
      video.addEventListener('canplaythrough', () => {
        // Autoplay is now allowed, hide the play button
        this.showPlayButton = false;
        video.muted = true;
        video.play();
      });
    }
  }

  startVideo() {
    const video = this.videoRef.nativeElement;
    if (video) {
      video.play().catch((error) => {
        console.error('Video playback failed:', error);
      });
      this.showPlayButton = false;
    }
  }
  openCreateCaseDialog(): void {
    let dialogRef;
    if (window.innerWidth <= 840) {
      dialogRef = this.dialog.open(CreateCaseComponent, {
        width: '100vw', // Use full viewport width
        height: '100vh', // Use full viewport height
        panelClass: 'custom-container',
      });
    } else {
      dialogRef = this.dialog.open(CreateCaseComponent, {
        width: '100%',
        height: '90vh',
        panelClass: 'custom-container',
      }).afterClosed().subscribe(()=>{
        this._sharedServic.notifyMyCasesTable()
      })
    }
  }

}
