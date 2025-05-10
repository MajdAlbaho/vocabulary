import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../shared/components/BaseComponent';
import { ApiKeyService } from '../../../../services/api-key.service';
import { ClaimsComponent } from '../../../../shared/components/claims/claims.component';

@Component({
    selector: 'app-api-key-editor',
    templateUrl: './api-key-editor.component.html',
    styleUrls: ['./api-key-editor.component.scss']
})
export class ApiKeyEditorComponent extends BaseComponent implements OnInit {
    @ViewChild(ClaimsComponent) claimsComponent!: ClaimsComponent;

    @Input() inputApiKeyId: number = 0;
    apiKeyForm!: FormGroup;

    forbidden: boolean = false;

    constructor(
        private apiKeyService: ApiKeyService,
        private spinner: NgxSpinnerService,
        private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private toastr: ToastrService) {
        super(toastr);
    }

    ngOnInit(): void {
        if (this.forbidden)
            return;

        this.apiKeyForm = this.fb.group({
            displayName: ['', [Validators.required]],
            expirationDate: ['', Validators.required]
        });

        if (this.inputApiKeyId > 0) {
            this.CallApi(this.apiKeyService.get(this.inputApiKeyId), (response: any) => {
                const formattedDate = new Date(response.expirationDate).toISOString().slice(0, 16);

                this.apiKeyForm.patchValue({
                    displayName: response.displayName,
                    expirationDate: formattedDate
                });

                this.claimsComponent.setSelectedClaims(response.apiKeyClaims)
                this.spinner.hide();
            });
        }
    }

    async save() {
        if (!this.apiKeyForm.valid) {
            this.toastr.error("Invalid inputs, make sure you follow the instructions")
            return;
        }

        this.spinner.show();
        const apiRequest = {
            id: this.inputApiKeyId.toString(),
            displayName: this.apiKeyForm.get('displayName')?.value,
            expirationDate: this.apiKeyForm.get('expirationDate')?.value,
            apiKeyClaims: this.claimsComponent.getSelectedClaims()
        };

        if (this.inputApiKeyId == 0) {
            var response = await this.GetApiCallResponse(this.apiKeyService.post(apiRequest));
            if (response != null) {
                this.toastr.warning('API Key created');
                this.spinner.hide();
                this.activeModal.close(response);
            }
        } else {
            var response = await this.GetApiCallResponse(this.apiKeyService.put(apiRequest));
            if (response != null) {
                this.toastr.warning('API Key updated');
                this.spinner.hide();
                this.activeModal.close(response);
            }
        }
    }

    dismiss() {
        this.activeModal.dismiss();
    }
}
