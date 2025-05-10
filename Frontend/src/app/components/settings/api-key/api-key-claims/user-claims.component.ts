import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { ApplicationUserClaimService } from '../../../../services/user_claim.service';
import { ApplicationClaimService } from '../../../../services/application_claim.service';
import { RoleService } from '../../../../services/role.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { BaseComponent } from '../../../../shared/components/BaseComponent';

@Component({
  selector: 'app-user-claims',
  templateUrl: './user-claims.component.html',
  styleUrls: ['./user-claims.component.scss']
})
export class UserClaimsComponent extends BaseComponent implements OnInit {

  public allRoles: any[] = [];
  rolesList: any[] = [];

  role: any = [];
  allClaims: any = [];
  allClaimsNew: any = [];
  claimTypeChecked: any = [];
  userClaims: any = [];
  userClaimValues: any = [];
  userId: any;
  groupedClaims: any = [];
  roleClaimValues: any[] = [];

  selectedRoleId: any;
  forbidden: boolean = false;


  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public roleService: RoleService,
    private authService: AuthService,
    private applicationUserClaimService: ApplicationUserClaimService,
    private applicationClaimService: ApplicationClaimService,
    private router: Router,
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
    this.allClaims = await this.GetApiCallResponse(this.applicationClaimService.get());
    this.groupedClaims = this.groupBy(this.allClaims, (claim: any) => claim.groupName);
    var userClaims = await this.GetApiCallResponse(this.applicationUserClaimService.getByUserId(this.userId));

    if (userClaims.length > 0) {
      this.userClaimValues = userClaims.map((e: any) => e.claimValue);
      this.checkParent();
    }
    this.spinner.hide();
  }

  checkParent() {
    // Step 1: Iterate through each group of claims in groupedClaims array.
    this.groupedClaims.forEach((groupedClaim: any) => {
      // Step 2: Check if all claims in the current group are selected.
      if (groupedClaim.every((item: any) => this.userClaimValues.includes(item.claimValue))) {
        // Step 3: If all claims in the group are selected, add the claimType to claimTypeChecked array.
        this.claimTypeChecked.push(groupedClaim[0].claimType);
      }
    });
  }

  onGroupClaimSelected(groupedClaimList: any) {
    var allSelected = true;

    // Step 1: Check if all claims in groupedClaimList are already selected.
    groupedClaimList.forEach((groupedClaim: any) => {
      if (this.userClaimValues.indexOf(groupedClaim.claimValue) == -1)
        allSelected = false;
    });

    // Step 2: If all claims are already selected, deselect them and update claimTypeChecked.
    if (allSelected) {
      groupedClaimList.forEach((groupedClaim: any) => {
        var indexInroleClaimValue = this.userClaimValues.indexOf(groupedClaim.claimValue);
        if (indexInroleClaimValue != -1) {
          this.userClaimValues.splice(indexInroleClaimValue, 1);
        }
      });

      var indexOfGroupItem = this.claimTypeChecked.indexOf(groupedClaimList[0].claimType);
      this.claimTypeChecked.splice(indexOfGroupItem, 1);
    } else {
      // Step 3: If all claims are not selected, select them and update claimTypeChecked.
      groupedClaimList.forEach((groupedClaimItem: any) => {
        var indexInroleClaimValue = this.userClaimValues.indexOf(groupedClaimItem.claimValue);
        if (indexInroleClaimValue == -1) {
          this.userClaimValues.push(groupedClaimItem.claimValue);
        }
      });

      this.claimTypeChecked.push(groupedClaimList[0].claimType);
    }
  }

  onClaimSelected(claim: any) {

    // Step 1: Check if the claimValue is already present in the userClaimValues array.
    const isChildChecked = this.userClaimValues.includes(claim.claimValue);

    // Step 2: If the presence of the claimValue in the userClaimValues array.
    if (isChildChecked) {
      // If claimValue is already in the array, remove it.
      this.userClaimValues = this.userClaimValues.filter((value: any) => value !== claim.claimValue);
    } else {
      // If claimValue is not in the array, add it.
      this.userClaimValues.push(claim.claimValue);
    }

    // Check if all the items in this group selected and update the parent
    const groupedClaimList = this.groupedClaims.filter((e: any) => e[0].claimType === claim.claimType);

    // Step 3: Check if all child checkboxes within the group are checked.
    let allSelected = true;
    for (let i = 0; i < groupedClaimList.length; i++) {
      const groupedClaim = groupedClaimList[i];
      for (let l = 0; l < groupedClaim.length; l++) {
        // If any claim of the same claimType is not in the roleClaimValues array, set allSelected to false.
        if (!this.userClaimValues.includes(groupedClaim[l].claimValue)) {
          allSelected = false;
          break;
        }
      }
    }

    // Step 4: Update the claimTypeChecked array based on allSelected.
    const parentClaimTypeIndex = this.claimTypeChecked.indexOf(claim.claimType);
    if (allSelected && parentClaimTypeIndex === -1) {
      // If all claims of the same claimType are selected and the claimType is not in claimTypeChecked, add it.
      this.claimTypeChecked.push(claim.claimType);
    } else if (!allSelected && parentClaimTypeIndex !== -1) {
      // If not all claims of the same claimType are selected and the claimType is in claimTypeChecked, remove it.
      let resultArray: string[] = this.removeSameValueFromArray(this.claimTypeChecked, claim.claimType); // the removeSameValueFromArray is use for remove duplicate selected index from arraye and assign in new array.
      resultArray.splice(parentClaimTypeIndex, 1);
    }
  }

  groupBy<T, K>(list: T[], getKey: (item: T) => K) {
    const map = new Map<K, T[]>();
    list.forEach((item) => {
      const key = getKey(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return Array.from(map.values());
  }

  async save() {
    this.spinner.show();
    var selectedUserClaims: any[] = [];
    this.userClaimValues.forEach((claim: any) => {
      var index = this.allClaims.map((c: any) => c.claimValue).indexOf(claim);
      if (index != -1) {
        var claim = this.allClaims[index];
        claim.userId = this.userId;

        selectedUserClaims.push(this.allClaims[index]);
      }
    });

    var response = await this.GetApiCallResponse(this.userService.updateUserClaims(selectedUserClaims));
    if (response != null) {
      this.toastr.success("Updated");
      this.spinner.hide();
    }

    // this.userService.updateUserClaims(this.userId, this.selectedRoleId, selectedUserClaims).subscribe({
    //   next: (result) => {
    //     this.router.navigate(['/settings/users']);
    //     this.spinner.hide();
    //   }
    // });
  }

  //remove duplicate index/value from array
  removeSameValueFromArray(arr: string[], value: string): string[] {
    const indicesToRemove: number[] = [];

    // Find all indices of the value in the array
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        indicesToRemove.push(i);
      }
    }

    // Remove all the values from the array except one
    if (indicesToRemove.length > 1) {
      indicesToRemove.shift(); // Keep the first occurrence and remove the rest
      for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        arr.splice(indicesToRemove[i], 1);
      }
    }
    return arr;
  }

  async onSelectRole() {
    if (this.selectedRoleId != null) {
      this.spinner.show();
      var response = await this.GetApiCallResponse(this.roleService.getRoleClaims(this.selectedRoleId));
      if (response?.length > 0) {
        this.claimTypeChecked = [];
        this.userClaimValues = response.map((e: any) => e.claimValue);
        this.checkParent();
      }
      this.spinner.hide();
    }
  }

}
