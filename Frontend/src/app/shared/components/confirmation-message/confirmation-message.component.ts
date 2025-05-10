import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-message',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-message.component.html',
  styleUrls: ['./confirmation-message.component.scss']
})
export class ConfirmationMessageComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {
    this.title = "Delete Item !!"
    this.message = "Are you sure you want to delete selected item ? ";
  }

  message: String
  title: String

  ngOnInit(): void { }

  dismiss() {
    this.activeModal.dismiss();
  }

  confirm() {
    this.activeModal.close(true);
  }
}
