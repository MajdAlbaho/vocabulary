import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) { }

  @Input() userId: string = "";
  @Input() userName: string = "";
  resetPasswordForm: FormGroup;

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6)]]
    })
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  save() {
    if (!this.resetPasswordForm.valid) {
      this.toastr.error("Invalid inputs, make sure you follow the instructions")
      return;
    }

    this.spinner.show();
    this.userService.resetPassword(this.userId, this.resetPasswordForm.get('password')?.value).subscribe({
      next: () => {
        this.toastr.warning('Password changed');
        this.spinner.hide();
        this.activeModal.dismiss();
      },
      error: (error) => {
        if (error?.status == 403) {
          this.toastr.error('Forbidden', 'Oops :(');
          this.spinner.hide();
          return;
        }
        var message = error.error.message;
        if (!message)
          message = "Unknown error occurred, Contact The System Administrator";

        this.toastr.error(message, 'Oops :(');
        this.spinner.hide();
      }
    });
  }
}
