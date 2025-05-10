import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../shared/components/BaseComponent';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent extends BaseComponent implements OnInit {
  @Input() inputUserId: string = "";
  userForm!: FormGroup;

  forbidden: boolean = false;

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    super(toastr);
  }

  ngOnInit(): void {
    if (this.forbidden)
      return;

    this.userForm = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null]
    });

    if (this.inputUserId != "") {
      this.CallApi(this.userService.get(this.inputUserId), (response: any) => {
        this.userForm.patchValue(response);
        this.spinner.hide();
      });
    }
  }

  async save() {
    if (!this.userForm.valid) {
      this.toastr.error("Invalid inputs, make sure you follow the instructions")
      return;
    }

    this.spinner.show();
    const request = {
      id: this.inputUserId,
      userName: this.userForm.get('userName')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
    }

    if (this.inputUserId == "") {
      var response = await this.GetApiCallResponse(this.userService.register(request));
      if (response != null) {
        this.toastr.warning('User registered');
        this.spinner.hide();
        this.activeModal.close(response);
      }
      return;
    }

    var response = await this.GetApiCallResponse(this.userService.put(request));
    if (response != null) {
      this.toastr.warning('User updated');
      this.spinner.hide();
      this.activeModal.close(response);
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
