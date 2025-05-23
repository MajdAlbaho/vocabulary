import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NavService } from '../../../services/nav/nav.service';

@Component({
    selector: 'app-maximise',
    templateUrl: './maximise.component.html',
    styleUrls: ['./maximise.component.scss'],
    standalone: true,
})
export class MaximiseComponent {
  public elem: any;

  constructor(
    private navServices: NavService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.elem = document.documentElement;
  }
  toggleFullScreen() {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
