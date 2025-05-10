import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from '../../shared/services/localStorage.service';

@Injectable()
export class RoleGuardService implements CanActivate {
    constructor(private injector: Injector) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        var toastr = this.injector.get(ToastrService);
        const expectedClaims = route.data['expectedClaims'];

        if (!expectedClaims)
            return true;

        if (!this.hasAccess(expectedClaims)) {
            toastr.error('You are not authorized, Contact The System Administrator', 'Access Denied');
            return false;
        }
        return true;
    }


    public hasAccess(allowedClaims: any): boolean {
        if (allowedClaims == null) return true;

        var localStorageService = this.injector.get(LocalStorageService);
        const storageClaims = localStorageService.getItem('claims');
        if (storageClaims == null) return false;

        const userClaims = JSON.parse(storageClaims);
        return allowedClaims.some((allowedClaim: any) =>
            userClaims.some((userClaim: any) =>
                userClaim.type === allowedClaim.type && userClaim.value === allowedClaim.value
            )
        );
    }
}