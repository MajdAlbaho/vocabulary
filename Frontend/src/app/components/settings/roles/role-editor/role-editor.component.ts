import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../../../services/role.service';
import { BaseComponent } from '../../../../shared/components/BaseComponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-editor',
  templateUrl: './role-editor.component.html',
  styleUrl: './role-editor.component.scss'
})
export class RoleEditorComponent extends BaseComponent implements OnInit {
  @Input() inputRoleName: string = "";
  roleForm!: FormGroup;


  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private roleService: RoleService,
    private activeModal: NgbActiveModal
  ) {
    super(toastr);
  }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: [this.inputRoleName, [Validators.required]],
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  async save() {
    if (!this.roleForm.valid) {
      this.toastr.error("Invalid inputs, make sure you follow the instructions")
      return;
    }

    this.spinner.show();

    if (this.inputRoleName == "") {
      var response = await this.GetApiCallResponse(this.roleService.post(this.roleForm.get('roleName')?.value));
      if (response != null) {
        this.toastr.warning('Role created');
        this.spinner.hide();
        this.activeModal.close(response);
      }
      return;
    }

    const roleModifyRequestModel = {
      roleName: this.inputRoleName,
      updatedRoleName: this.roleForm.get('roleName')?.value
    };
    var response = await this.GetApiCallResponse(this.roleService.put(roleModifyRequestModel));
    if (response != null) {
      this.toastr.warning('Role updated');
      this.spinner.hide();
      this.activeModal.close(response);
    }
  }
}
