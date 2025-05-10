import { Component } from '@angular/core';
import { NavService } from '../../../../shared/services/nav/nav.service';

import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/localStorage.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  providers: [TranslateService],
})

export class LanguageComponent {
  public language: boolean = false;

  public selectedLanguage: any;
  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },
    {
      language: 'Arabic',
      code: 'ar',
      type: 'AR',
      icon: 'sa',
    },
  ];


  constructor(
    public navServices: NavService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) { }
  //
  ngOnInit() {
    var lang = this.localStorageService.getItem('lang');
    if (lang == null || lang == undefined || lang == "") {
      lang = 'en';
      this.localStorageService.setItem('lang', 'en');
    }

    this.translate.use(lang);
    this.selectedLanguage = this.languages.filter(e => e.code == lang);
  }

  changeLanguage(lang: { code: string }) {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    this.localStorageService.setItem('lang', lang.code);
  }
}
