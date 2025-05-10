import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { BaseDataTableComponent } from '../../../shared/components/BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiKeyService } from '../../../services/api-key.service';
import { ApiKeyEditorComponent } from './api-key-editor/api-key-editor.component';
import { ConfirmationMessageComponent } from '../../../shared/components/confirmation-message/confirmation-message.component';

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrl: './api-key.component.scss'
})
export class ApiKeyComponent extends BaseDataTableComponent implements OnInit {

  forbidden: boolean = false;
  dtOptions: any = {};

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private authService: AuthService,
    private apiKeyService: ApiKeyService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
  ) {
    super(toastr, 'apiKeysTable');

    this.forbidden = !this.authService.hasAccess([{ type: 'ApiKeys', value: 'Manage' }]);

    renderer.listen(elementRef.nativeElement, 'click', (event) => {
      const action = event.target.getAttribute('data-action');
      if (action == null)
        return;

      const apiKeyId = event.target.getAttribute('data-apiKeyId');
      const key = event.target.getAttribute('data-key');
      if (action == 'edit') {
        this.editApiKey(apiKeyId, key)
      } else if (action === 'delete') {
        this.revokeApiKey(apiKeyId, key);
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
      columnDefs: [{ orderable: false, targets: 3 }],
      ajax: async (dataTablesParameters: any, callback: any) => {
        this.spinner.show();
        var response = await this.GetApiCallResponse(this.apiKeyService.getApiKeys(dataTablesParameters));
        callback({
          recordsTotal: response?.recordsTotal,
          recordsFiltered: response?.recordsFiltered,
          data: response?.data,
        });
      },
      columns: [
        {
          title: "Display Name",
          data: "displayName",
        },
        {
          title: "Expiration Date",
          data: "expirationDate",
          render: (data: any, type: any, row: any) => {
            if (data) {
              const date = new Date(data);
              return date.toLocaleString();
            }
            return '';
          }
        },
        {
          title: "Key",
          data: "key",
        },
        {
          title: "Action",
          width: '150px',
          data: 'id',
          render: (data: any, type: any, row: any) => {
            return `
            <ul class="action">
              <li class="m-1">
                  <i class="icon-pencil-alt cursor-hand secondary-color" data-action="edit" data-apiKeyId="${row.id}" data-key="${row.key}"></i>
              </li>
              <li class="m-1">
                  <i class="icon-trash bg-red cursor-hand danger-color" data-action="delete" data-apiKeyId="${row.id}" data-key="${row.key}"></i>
              <li>
            </ul>
            `;
          },
        }],
    };
  }

  generateKey() {
    var modal = this.modalService.open(ApiKeyEditorComponent, { size: 'xl' });
    modal.result.then(
      (result) => { this.AddRow(result) }
    );
  }

  editApiKey(apiKeyId: string, key: string) {
    var modal = this.modalService.open(ApiKeyEditorComponent, { size: 'xl' });
    modal.componentInstance.inputApiKeyId = apiKeyId;
    modal.result.then(
      (result) => {
        var rowId = this.GetRowId(key);
        this.EditRow(rowId, result);
      }
    );
  }

  revokeApiKey(apiKeyId: number, key: string) {
    if (!this.authService.hasAccess([{ type: 'ApiKeys', value: 'Revoke' }])) {
      this.toastr.error('Forbidden', 'Oops :(');
      return;
    }

    var modal = this.modalService.open(ConfirmationMessageComponent);
    modal.result.then(
      async (result) => {
        if (result) {
          await this.GetApiCallResponse(this.apiKeyService.revoke(apiKeyId));
          var rowId = this.GetRowId(key);
          this.DeleteRow(rowId);
        }
      }
    );
  }
}

