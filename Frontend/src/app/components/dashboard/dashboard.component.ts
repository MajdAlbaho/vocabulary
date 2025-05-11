import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '../../shared/components/BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StartAssessmentComponent } from '../assessment/start-assessment/start-assessment.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {
  constructor(private toastr: ToastrService,
    private router: Router,
    public modalService: NgbModal,
  ) {
    super(toastr);
  }


  ngOnInit(): void {
    
  }

  startTest() {
    var modal = this.modalService.open(StartAssessmentComponent);
    modal.result.then(
      (result) => {
        this.router.navigateByUrl(`assessment/${result.id}`);
      }
    );
  }
}
