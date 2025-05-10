import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { BaseDataTableComponent } from '../../../shared/components/BaseComponent';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseDataTableComponent implements OnInit {

  forbidden: boolean = false;
  dtOptions: any = {};

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    private translate: TranslateService
  ) {
    super(toastr, 'usersTable');

    this.forbidden = !this.authService.hasAccess([{ type: 'Users', value: 'Manage' }]);

    renderer.listen(elementRef.nativeElement, 'click', (event) => {
      const action = event.target.getAttribute('data-action');

      if (action == null)
        return;

      const userId = event.target.getAttribute('data-userId');
      const userName = event.target.getAttribute('data-userName');

      if (action === 'resetPassword') {
        this.resetPassword(userId, userName);
      } else if (action === 'edit') {
        this.editUser(userId, userName);
      } else if (action === 'claims') {
        this.router.navigate(['/settings/users/claims', userId]);
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
        var response = await this.GetApiCallResponse(this.userService.getUsers(dataTablesParameters));
        callback({
          recordsTotal: response?.recordsTotal,
          recordsFiltered: response?.recordsFiltered,
          data: response?.data,
        });
      },
      columns: [
        {
          title: this.translate.instant('User Name'),
          data: "userName",
        },
        {
          title: this.translate.instant('Email'),
          data: "email",
        },
        {
          title: this.translate.instant('Role'),
          data: "roleName",
        },
        {
          title: this.translate.instant('Action'),
          width: '150px',
          data: 'id',
          render: (data: any, type: any, row: any) => {
            return `
            <ul class="action">
              <li class="m-1">
                  <i class="icon-reload bg-red cursor-hand primary-color" data-action="resetPassword" data-userId="${row.id}" data-userName="${row.userName}"></i>
              <li>
              <li class="m-1">
                  <i class="icon-pencil-alt cursor-hand secondary-color" data-action="edit" data-userId="${row.id}"></i>
              </li>
              <li class="m-1">
                  <i class="icon-unlock bg-red cursor-hand info-color" data-action="claims" data-userId="${row.id}"></i>
              <li>
            </ul>
            `;
          },
        }],
    };
  }

  addUser() {
    var modal = this.modalService.open(UserEditorComponent);
    modal.result.then(() => { this.ReloadDataTable() });
  }

  editUser(userId: any, userName: string) {
    var modal = this.modalService.open(UserEditorComponent);
    modal.componentInstance.inputUserId = userId;
    modal.result.then(
      (result) => {
        var rowId = this.GetRowId(userName);
        this.EditRow(rowId, result);
      }
    );
  }

  resetPassword(userId: string, userName: string) {
    if (!this.authService.hasAccess([{ type: 'Users', value: 'ResetPassword' }])) {
      this.toastr.error('Forbidden', 'Oops :(');
      return;
    }

    var modal = this.modalService.open(ResetPasswordComponent);
    modal.componentInstance.userId = userId;
    modal.componentInstance.userName = userName;
  }
}

