import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './input-list.component.html',
  styleUrl: './input-list.component.scss'
})
export class InputListComponent {
  protected inputList: InputModel[] = [];

  set(list: InputModel[]) {
    this.inputList = list;
  }

  get(): InputModel[] {
    return this.inputList;
  }
}


export class InputModel {
  key: string;
  name: string;
  value: string;
}