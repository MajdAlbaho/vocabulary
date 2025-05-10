import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../shared/components/BaseComponent';
import { KeywordService } from '../../../../services/keyword.service';
import { InputListComponent } from '../../../../shared/components/input-list/input-list.component';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-keyword-editor',
  templateUrl: './keyword-editor.component.html',
  styleUrls: ['./keyword-editor.component.scss']
})
export class KeywordEditorComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(InputListComponent) inputListComponent!: InputListComponent;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.save();
    } else if (event.key === 'Escape') {
      this.dismiss();
    }
  }


  @Input() inputKeywordId: string = "";
  languageKeywords: any[];
  keywordForm!: FormGroup;

  forbidden: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private keywordService: KeywordService,
    private languageService: LanguageService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    super(toastr);
  }
  async ngAfterViewInit(): Promise<void> {
    var languages = await this.GetApiCallResponse(this.languageService.getAll());
    if (languages.length == 0) {
      console.log("No languages defined");
      return;
    }


    var list: any = [];

    if (this.inputKeywordId != "") {
      var keyword = await this.GetApiCallResponse(this.keywordService.get(this.inputKeywordId));
      this.keywordForm.patchValue(keyword);
      this.languageKeywords = keyword.languageKeywords;

      if (this.languageKeywords.length == 0)
        return;

      list = this.languageKeywords.map((e: any) => ({
        key: e.languageId,
        name: languages.find((lan: any) => lan.id === e.languageId).displayName,
        value: e.displayValue
      }));

    } else {
      list = languages.map((e: any) => ({
        key: e.id,
        name: e.displayName,
        value: ''
      }));
    }

    this.inputListComponent.set(list);
  }

  ngOnInit(): void {
    if (this.forbidden)
      return;


    this.keywordForm = this.fb.group({
      code: [null, [Validators.required]],
      displayName: [null, [Validators.required, Validators.minLength(3)]],
    });



  }

  async save() {
    if (!this.keywordForm.valid) {
      this.toastr.error("Invalid inputs, make sure you follow the instructions")
      return;
    }

    this.spinner.show();
    const request = {
      id: this.inputKeywordId,
      code: this.keywordForm.get('code')?.value,
      displayName: this.keywordForm.get('displayName')?.value,
      languageKeywords: this.inputListComponent.get().map(e => ({
        languageId: e.key,
        displayValue: e.value
      }))
    }

    console.log(request);
    

    if (this.inputKeywordId == "") {
      var response = await this.GetApiCallResponse(this.keywordService.post(request));
      if (response != null) {
        this.toastr.warning('Keyword registered');
        this.spinner.hide();
        this.activeModal.close(response);
      }
      return;
    }

    var response = await this.GetApiCallResponse(this.keywordService.put(request));
    if (response != null) {
      this.toastr.warning('Keyword updated');
      this.spinner.hide();
      this.activeModal.close(response);
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
