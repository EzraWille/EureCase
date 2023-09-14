import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements AfterViewInit {
  @ViewChild('backgroundVideo', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;

  showPlayButton: boolean = true;
  constructor(private router: Router) {}

  onVideoEnded() {
    // Video has ended, navigate to the '/dashboard' route
    this.router.navigate(['/dashboard']);
  }
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
