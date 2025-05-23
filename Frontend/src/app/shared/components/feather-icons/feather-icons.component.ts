import { Component, Input } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
    selector: 'app-feather-icons',
    templateUrl: './feather-icons.component.html',
    styleUrls: ['./feather-icons.component.scss'],
    standalone: true,
})
export class FeatherIconsComponent {
  @Input('icon') public icon: any;
  constructor() {}

  ngAfterViewInit() {
    feather.replace();
  }

  ngOnInit(): void {
    setTimeout(() => {
      feather.replace();
    });
  }
}
