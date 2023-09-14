import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  @ViewChild('backgroundVideo', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;
  showPlayButton: boolean = true;

  constructor() {}
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
}
