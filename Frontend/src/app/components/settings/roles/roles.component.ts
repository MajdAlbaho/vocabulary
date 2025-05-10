import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from '../../../services/role.service';
import { RoleEditorComponent } from './role-editor/role-editor.component';
import { ConfirmationMessageComponent } from '../../../shared/components/confirmation-message/confirmation-message.component';
import { BaseDataTableComponent } from '../../../shared/components/BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-users',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends BaseDataTableComponent implements OnInit {
    forbidden: boolean = false;
    dtOptions: any = {};

    constructor(
        elementRef: ElementRef,
        renderer: Renderer2,
        private roleService: RoleService,
        private toastr: ToastrService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        public modalService: NgbModal,
        private router: Router,
    ) {
        super(toastr, 'rolesDataTable');
        this.forbidden = !this.authService.hasAccess([{ type: 'Roles', value: 'Manage' }]);

        renderer.listen(elementRef.nativeElement, 'click', (event) => {
            const action = event.target.getAttribute('data-action');
            if (action == null)
                return;

            const roleName = event.target.getAttribute('data-roleName');

            if (action === 'edit') {
                this.editRole(roleName);
            } else if (action === 'delete') {
                this.deleteRole(roleName);
            } else if (action === 'claims') {
                this.router.navigate(['/settings/roles/claims', roleName]);
            }
        });
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
            columnDefs: [{ orderable: false, targets: 1 }],
            ajax: async (dataTablesParameters: any, callback: any) => {
                this.spinner.show();
                var response = await this.GetApiCallResponse(this.roleService.getRoles(dataTablesParameters));
                callback({
                    recordsTotal: response?.recordsTotal,
                    recordsFiltered: response?.recordsFiltered,
                    data: response?.data,
                });

                this.spinner.hide();
            },
            columns: [
                {
                    title: "Role Name",
                    data: "name",
                },
                {
                    title: "Action",
                    width: '150px',
                    data: 'name',
                    render: (data: any, type: any, row: any) => {
                        return `
                            <ul class="action">
                                <li class="m-1">
                                    <i class="icon-pencil-alt cursor-hand secondary-color" data-action="edit" data-roleName="${row.name}"></i>
                                </li>
                                <li class="m-1">
                                    <i class="icon-trash bg-red cursor-hand primary-color" data-action="delete" data-roleName="${row.name}" data-userName="${row.userName}"></i>
                                <li>
                                <li class="m-1">
                                    <i class="icon-unlock bg-red cursor-hand info-color" data-action="claims" data-roleName="${row.name}"></i>
                                <li>
                            </ul>
                            `;
                    },
                }
            ],
        };
    }

    addRole() {
        var modal = this.modalService.open(RoleEditorComponent);
        modal.result.then(
            (result) => { this.AddRow(result) }
        );
    }

    editRole(roleName: string) {
        var modal = this.modalService.open(RoleEditorComponent);
        modal.componentInstance.inputRoleName = roleName;
        modal.result.then(
            (result) => {
                var rowId = this.GetRowId(roleName);
                this.EditRow(rowId, result);
            }
        );
    }

    deleteRole(roleName: string) {
        var modal = this.modalService.open(ConfirmationMessageComponent);
        modal.result.then(
            async (result) => {
                if (result) {
                    await this.GetApiCallResponse(this.roleService.delete(roleName));
                    var rowId = this.GetRowId(roleName);
                    this.DeleteRow(rowId);
                }
            }
        );
    }
}


