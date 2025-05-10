import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom, Observable } from "rxjs";

export class BaseComponent {
    private toastrService: ToastrService;

    constructor(toastr: ToastrService) {
        this.toastrService = toastr;
    }

    CallApi(request: Observable<any>, onSuccess: (result: any) => void, onFailed?: () => void) {
        request.subscribe({
            next: (result: any) => {
                onSuccess(result);
            },
            error: (error) => {
                if (error?.status == 403) {
                    this.toastrService.error('Forbidden', 'Oops :(');
                    if (onFailed)
                        onFailed();

                    return;
                }

                var message = error.error.message;
                if (!message) {
                    message = error.message;
                    if (!message)
                        message = "Unknown error occurred, Contact The System Administrator";
                }
                if (onFailed)
                    onFailed();
            }
        });
    }

    async GetApiCallResponse(request: Observable<any>): Promise<any> {
        try {
            var result = await firstValueFrom(request);
            if(result == null)
                result = true;

            return result;
        } catch (error: any) {
            if (error?.status == 403) {
                this.toastrService.error('Forbidden', 'Oops :(');
                return null;
            }

            var message = error.error.message;
            if (!message) {
                message = error.message;
                if (!message)
                    message = "Unknown error occurred, Contact The System Administrator";
            }

            this.toastrService.error(message, 'Oops :(');
            return null;
        } finally {
        }
    }
}

export class BaseDataTableComponent extends BaseComponent {
    constructor(toastrService: ToastrService, private dataTableId: string) {
        super(toastrService);
    }

    AddRow(newData: any) {
        const table = $(`#${this.dataTableId}`).DataTable();
        table.row.add(newData).draw(false);
    }

    EditRow(rowId: any, updatedData: any) {
        this.DeleteRow(rowId);
        this.AddRow(updatedData);
    }

    DeleteRow(rowId: any) {
        const table = $(`#${this.dataTableId}`).DataTable();
        const row = table.row(`#${rowId}`);
        row.remove().draw(false);
    }

    GetRowId(roleName: any): number {
        const table = $(`#${this.dataTableId}`).DataTable();
        const rowIndex = table.rows().data().toArray().findIndex((row: any) => row.name === roleName);
        return rowIndex;
    }

    ReloadDataTable() {
        const table = $(`#${this.dataTableId}`).DataTable();
        table.draw(true);
    }
}