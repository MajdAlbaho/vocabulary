import { Component, OnInit } from '@angular/core';
import { BaseComponent, BaseDataTableComponent } from '../../../shared/components/BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { UserAssessmentService } from '../../../services/user.assessment.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assessment-result',
  standalone: true,
  imports: [DataTablesModule, CommonModule, RouterModule],
  templateUrl: './assessment-result.component.html',
  styleUrl: './assessment-result.component.scss'
})
export class AssessmentResultComponent extends BaseDataTableComponent implements OnInit {
  constructor(toastr: ToastrService,
    private userAssessmentService: UserAssessmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    super(toastr, 'answersTable');
  }

  assessment: any;

  ngOnInit(): void {
    var id = this.route.snapshot.params['id'];
    this.CallApi(this.userAssessmentService.get(id), (assessment: any) => {
      this.assessment = assessment;
    });
  }

  getAssessmentStartDate() {
    return this.datePipe.transform(this.assessment?.startDateTime, 'medium');
  }

  getAssessmentEndDate() {
    return this.datePipe.transform(this.assessment?.endDateTime, 'medium');
  }

  getAssessmentScorePercentage(score: number) {
    return (score / this.assessment?.maxScore) * 100;
  }

  getAssessmentTotalTime(): string {
    const hours = Math.floor(this.assessment?.totalTimeSeconds / 3600);
    const minutes = Math.floor((this.assessment?.totalTimeSeconds % 3600) / 60);
    const remainingSeconds = Math.ceil(this.assessment?.totalTimeSeconds % 60);

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
