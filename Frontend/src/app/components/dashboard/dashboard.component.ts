import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '../../shared/components/BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StartAssessmentComponent } from '../assessment/start-assessment/start-assessment.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {


  textToRead: string = 'Hello, this is some text that will be read aloud.';
  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;

  // Selected language (default is English)
  selectedLanguage: string = 'en-US'; // 'en-US' for English, 'ar-SA' for Arabic

  // Function to change the language
  changeLanguage(language: string) {
    this.selectedLanguage = language;

    // Change the text to read depending on the language
    if (language === 'en-US') {
      this.textToRead = 'Hello, this is some text that will be read aloud.';
    } else if (language === 'ar-SA') {
      this.textToRead = 'مرحبًا! هذا هو النص الذي سيتم قراءته بصوت عالٍ.';
    }
  }

  loadVoices() {
    const allVoices = window.speechSynthesis.getVoices();
    this.voices = allVoices.filter(voice => voice.lang === this.selectedLanguage);
    this.selectedVoice = this.voices.length ? this.voices[0] : null;
    console.log(this.voices);

  }


  










  constructor(private toastr: ToastrService,
    private router: Router,
    public modalService: NgbModal,
  ) {
    super(toastr);
  }


  ngOnInit(): void {
    this.loadVoices();
  }

  startTest() {
    var modal = this.modalService.open(StartAssessmentComponent);
    modal.result.then(
      (result) => {
        this.router.navigateByUrl(`assessment/${result.id}`);
      }
    );
  }
}
