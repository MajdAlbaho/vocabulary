import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { ApplicationClaimService } from '../../../services/application_claim.service';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent extends BaseComponent implements OnInit {

  allClaims: any[] = [];
  groupedClaims: any[] = [];
  claimValues: string[] = [];
  claimTypeChecked: string[] = [];

  constructor(
    toastr: ToastrService,
    private applicationClaimService: ApplicationClaimService
  ) {
    super(toastr);
  }

  async ngOnInit(): Promise<void> {
    this.allClaims = await this.GetApiCallResponse(this.applicationClaimService.get());
    this.groupedClaims = this.groupBy(this.allClaims, (claim: any) => claim.groupName);
  }

  setSelectedClaims(userClaims: any[]): void {
    this.claimValues = userClaims.map(claim => claim.claimType + claim.claimValue);
    this.updateParentSelection();
  }

  getSelectedClaims(): any[] {
    return this.allClaims.filter(claim => this.claimValues.includes(claim.claimType + claim.claimValue));
  }

  private updateParentSelection(): void {
    this.groupedClaims.forEach(groupedClaim => {
      const allSelected = groupedClaim.every((claim: any) => this.claimValues.includes(claim.claimType + claim.claimValue));
      const groupType = groupedClaim[0].claimType;

      if (allSelected && !this.claimTypeChecked.includes(groupType)) {
        this.claimTypeChecked.push(groupType);
      } else if (!allSelected && this.claimTypeChecked.includes(groupType)) {
        this.claimTypeChecked = this.claimTypeChecked.filter(type => type !== groupType);
      }
    });
  }

  protected onGroupClaimSelected(groupedClaimList: any[]): void {
    const allSelected = groupedClaimList.every(groupedClaim =>
      this.claimValues.includes(groupedClaim.claimType + groupedClaim.claimValue)
    );

    if (allSelected) {
      this.deselectGroup(groupedClaimList);
    } else {
      this.selectGroup(groupedClaimList);
    }
  }

  private deselectGroup(groupedClaimList: any[]): void {
    groupedClaimList.forEach(groupedClaim => {
      this.claimValues = this.claimValues.filter(value => value !== groupedClaim.claimType + groupedClaim.claimValue);
    });
    const groupType = groupedClaimList[0].claimType;
    this.claimTypeChecked = this.claimTypeChecked.filter(type => type !== groupType);
  }

  private selectGroup(groupedClaimList: any[]): void {
    groupedClaimList.forEach(groupedClaim => {
      if (!this.claimValues.includes(groupedClaim.claimType + groupedClaim.claimValue)) {
        this.claimValues.push(groupedClaim.claimType + groupedClaim.claimValue);
      }
    });

    const groupType = groupedClaimList[0].claimType;
    if (!this.claimTypeChecked.includes(groupType)) {
      this.claimTypeChecked.push(groupType);
    }
  }

  protected onClaimSelected(claim: any): void {
    const isSelected = this.claimValues.includes(claim.claimType + claim.claimValue);

    if (isSelected) {
      this.claimValues = this.claimValues.filter(value => value !== claim.claimType + claim.claimValue);
    } else {
      this.claimValues.push(claim.claimType + claim.claimValue);
    }

    this.updateParentSelection();
  }

  protected isClaimSelected(claim: any): boolean {
    return this.claimValues.includes(claim.claimType + claim.claimValue);
  }

  protected isGroupSelected(groupedClaim: any[]): boolean {
    return groupedClaim.every(claim => this.claimValues.includes(claim.claimType + claim.claimValue));
  }

  private groupBy<T, K>(list: T[], getKey: (item: T) => K): T[][] {
    const map = new Map<K, T[]>();
    list.forEach(item => {
      const key = getKey(item);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(item);
    });

    return Array.from(map.values());
  }
}
