import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../services/auth/auth.service';
import { BaseComponent } from '../../../../shared/components/BaseComponent';
import { ClaimsComponent } from '../../../../shared/components/claims/claims.component';
import { RoleClaimService } from '../../../../services/role_claim.service';

@Component({
  selector: 'app-role-claims',
  templateUrl: './role-claims.component.html',
  styleUrls: ['./role-claims.component.scss']
})
export class RoleClaimsComponent extends BaseComponent implements OnInit {
  @ViewChild(ClaimsComponent) claimsComponent!: ClaimsComponent;

  forbidden: boolean = false;
  roleName: any;
  roleClaims: any = [];

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private roleClaimService: RoleClaimService,
    private authService: AuthService,
  ) {
    super(toastr);
    this.forbidden = !this.authService.hasAccess([{ type: 'Roles', value: 'Manage' }]);
  }

  async ngOnInit(): Promise<void> {
    if (this.forbidden)
      return;

    this.roleName = this.route.snapshot.params['id'];
    this.spinner.show();

    var roleClaims = await this.GetApiCallResponse(this.roleClaimService.getByRoleName(this.roleName));

    if (roleClaims.length > 0) {
      this.claimsComponent.setSelectedClaims(roleClaims);
    }
    this.spinner.hide();
  }

  async save() {
    this.spinner.show();
    var selectedClaims = this.claimsComponent.getSelectedClaims();

    var response = await this.GetApiCallResponse(this.roleClaimService.put(this.roleName, selectedClaims));
    if (response != null) {
      this.toastr.success("Updated");
      this.spinner.hide();
      this.router.navigateByUrl('/settings/roles');
    }
  }
}
