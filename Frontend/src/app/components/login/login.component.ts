import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { BaseComponent } from '../../shared/components/BaseComponent';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../shared/services/localStorage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {
  public show: boolean = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private spinner: NgxSpinnerService, private toastr: ToastrService, private localStorageService: LocalStorageService
  ) {
    super(toastr);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;
    var response = await this.GetApiCallResponse(this.authService.login(loginData.username, loginData.password));
    if (response != null) {
      const { claims, userName, userId } = response;

      this.localStorageService.setItem('userId', userId);
      this.localStorageService.setItem('userName', userName);
      this.localStorageService.setItem('claims', claims);

      this.router.navigate(['/']);
    }
  }

  showPassword() {
    this.show = !this.show;
  }
}
