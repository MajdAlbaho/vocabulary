import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input-step',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './input-step.component.html',
  styleUrl: './input-step.component.scss'
})
export class InputStepComponent {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.nextQuestion();
    }
  }

  protected _inputList: InputModel[] = [];
  protected _current: InputModel;
  protected currentIndex: number = 0;
  private assessmentCompleted: boolean = false;

  protected set current(value: InputModel) {
    this._current = value;
    this.onCurrentChanged(value);
  }

  protected get current(): InputModel {
    return this._current;
  }

  onCurrentChanged(value: InputModel) {
    var lan = value.nameDesc == 'English' ? 'en-US' : 'ar-SA';
    this.readText(value.name, lan);
  }

  public set inputList(value: InputModel[]) {
    this._inputList = value;
    this.current = this.inputList[this.currentIndex];
  }

  public get inputList(): InputModel[] {
    return this._inputList;
  }

  nextQuestion(): void {
    if (!this.current.value)
      return;

    if (this.currentIndex < this.inputList.length - 1 && !this.assessmentCompleted) {
      this.currentIndex++;
      this.current = this.inputList[this.currentIndex];
      return;
    }

    this.assessmentCompleted = true;
    this.currentIndex = this.inputList.findIndex(e => e.skipped === true);
    if (this.currentIndex > -1) {
      this.current = this.inputList[this.currentIndex];
      this.current.skipped = false;
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.current = this.inputList[this.currentIndex];
    }
  }

  isCompleted(): boolean {
    return !this.inputList.some(input => input.value.trim() === '');
  }

  skip(): void {
    if (this.currentIndex < this.inputList.length - 1) {
      this.current.skipped = true;
      this.currentIndex++;
      this.current = this.inputList[this.currentIndex];
    }
  }

  readText(text: string, lan: string) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = lan;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }
}


export class InputModel {
  id: number;
  name: string;
  value: string;
  nameDesc: string;
  valueDesc: string;
  skipped: boolean;
}