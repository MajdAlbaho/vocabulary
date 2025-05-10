import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { BaseDataTableComponent } from '../../../shared/components/BaseComponent';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationMessageComponent } from '../../../shared/components/confirmation-message/confirmation-message.component';
import { KeywordEditorComponent } from './keyword-editor/keyword-editor.component';
import { KeywordService } from '../../../services/keyword.service';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent extends BaseDataTableComponent implements OnInit {

  forbidden: boolean = false;
  dtOptions: any = {};

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private authService: AuthService,
    private toastr: ToastrService,
    private keywordService: KeywordService,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    private translate: TranslateService
  ) {
    super(toastr, 'keywordsTable');

    this.forbidden = !this.authService.hasAccess([{ type: 'Keywords', value: 'Manage' }]);

    renderer.listen(elementRef.nativeElement, 'click', (event) => {
      const action = event.target.getAttribute('data-action');

      if (action == null)
        return;

      const keywordId = event.target.getAttribute('data-keywordId');
      const keywordCode = event.target.getAttribute('data-keywordCode');

      if (action === 'edit') {
        this.editKeyword(keywordId, keywordCode);
      } else if (action === 'delete') {
        this.deleteKeyword(keywordId, keywordCode);
      }
    })
  }

  ngOnInit(): void {
    if (this.forbidden)
      return;

    this.spinner.show();
    this.initializeDataTable();
  }

  initializeDataTable() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 25,
      serverSide: true,
      processing: true,
      ordering: true,
      search: { return: true },
      lengthMenu: [10, 25, 50, 100],
      columnDefs: [{ orderable: false, targets: 2 }],
      ajax: async (dataTablesParameters: any, callback: any) => {
        this.spinner.show();
        var response = await this.GetApiCallResponse(this.keywordService.getKeywords(dataTablesParameters));
        callback({
          recordsTotal: response?.recordsTotal,
          recordsFiltered: response?.recordsFiltered,
          data: response?.data,
        });
      },
      columns: [
        {
          title: this.translate.instant('Code'),
          data: "code",
        },
        {
          title: this.translate.instant('Display Name'),
          data: "displayName",
        },
        {
          title: this.translate.instant('Action'),
          width: '150px',
          data: 'id',
          render: (data: any, type: any, row: any) => {
            return `
            <ul class="action">
              <li class="m-1">
                  <i class="icon-pencil-alt cursor-hand secondary-color" data-action="edit" data-keywordId="${row.id}" data-keywordCode="${row.code}"></i>
              </li>
              <li class="m-1">
                  <i class="icon-trash danger-color cursor-hand info-color" data-action="delete" data-keywordId="${row.id}" data-keywordCode="${row.code}"></i>
              <li>
            </ul>
            `;
          },
        }],
    };
  }

  addKeyword() {
    var modal = this.modalService.open(KeywordEditorComponent);
    modal.result.then((result) => { this.AddRow(result) });
  }

  editKeyword(keywordId: any, keywordCode: string) {
    var modal = this.modalService.open(KeywordEditorComponent);
    modal.componentInstance.inputKeywordId = keywordId;
    modal.result.then(
      (result) => {
        var rowId = this.GetRowId(keywordCode);
        this.EditRow(rowId, result);
      }
    );
  }

  deleteKeyword(keywordId: any, keywordCode: string) {
    var modal = this.modalService.open(ConfirmationMessageComponent);
    modal.result.then(
      async (result) => {
        if (result) {
          await this.GetApiCallResponse(this.keywordService.delete(keywordId));
          var rowId = this.GetRowId(keywordCode);
          this.DeleteRow(rowId);
        }
      }
    );
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'b') {
      this.addKeyword();
    }
  }
}

