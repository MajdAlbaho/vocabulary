import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { BaseComponent } from '../../BaseComponent';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
    imports: []
})
export class AccountComponent extends BaseComponent {
    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
        super(toastr);
    }

    logout() {
        this.CallApi(this.authService.logout(), (response: any) => {
            localStorage.clear();
            this.router.navigate(['/']);
        });
    }
}
