import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../../../services/role.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { BaseComponent } from '../../../../shared/components/BaseComponent';
import { ClaimsComponent } from '../../../../shared/components/claims/claims.component';
import { UserClaimService } from '../../../../services/user_claim.service';
import { RoleClaimService } from '../../../../services/role_claim.service';

@Component({
  selector: 'app-user-claims',
  templateUrl: './user-claims.component.html',
  styleUrls: ['./user-claims.component.scss']
})
export class UserClaimsComponent extends BaseComponent implements OnInit {
  @ViewChild(ClaimsComponent) claimsComponent!: ClaimsComponent;

  forbidden: boolean = false;
  rolesList: any[] = [];
  selectedRoleName: string;

  userClaims: any = [];
  userClaimValues: any = [];
  userId: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private roleService: RoleService,
    private userClaimService: UserClaimService,
    private roleClaimService: RoleClaimService,
  ) {
    super(toastr);
    this.forbidden = !this.authService.hasAccess([{ type: 'Users', value: 'Manage' }]);
  }

  async ngOnInit(): Promise<void> {
    if (this.forbidden)
      return;

    this.userId = this.route.snapshot.params['id'];
    this.spinner.show();

    this.rolesList = await this.GetApiCallResponse(this.roleService.getAll());
    var userClaims = await this.GetApiCallResponse(this.userClaimService.getByUserId(this.userId));

    if (userClaims.length > 0) {
      this.claimsComponent.setSelectedClaims(userClaims);
    }
    this.spinner.hide();
  }

  async onSelectRole() {
    if (this.selectedRoleName == "")
      return;

    this.spinner.show();
    var response = await this.GetApiCallResponse(this.roleClaimService.getByRoleName(this.selectedRoleName));
    console.log("response", response);

    if (response?.length > 0) {
      this.claimsComponent.setSelectedClaims(response);
    }
    this.spinner.hide();
  }


  async save() {
    this.spinner.show();
    var selectedClaims = this.claimsComponent.getSelectedClaims();

    var response = await this.GetApiCallResponse(this.userClaimService.put(this.userId, selectedClaims));
    if (response != null) {
      this.toastr.success("Updated");
      this.spinner.hide();
      this.router.navigateByUrl('/settings/users');
    }
  }
}
