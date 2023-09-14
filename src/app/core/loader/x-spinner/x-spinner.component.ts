import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-x-spinner',
  templateUrl: './x-spinner.component.html',
  styleUrls: ['./x-spinner.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class XSpinnerComponent {
  constructor(public loader: LoaderService) {}

  @ViewChild('backgroundVideo', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;
  showPlayButton: boolean = true;

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
