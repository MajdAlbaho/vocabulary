import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../shared/components/BaseComponent';
import { UserAssessmentService } from '../../../services/user.assessment.service';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start-assessment',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './start-assessment.component.html',
  styleUrl: './start-assessment.component.scss'
})
export class StartAssessmentComponent extends BaseComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private userAssessmentService: UserAssessmentService,
    toastr: ToastrService) {
    super(toastr);
  }

  ngOnInit(): void { }

  assessments = [
    {
      title: 'Quick Knowledge Check',
      colorClass: 'primary',
      name: 'Quick',
      questions: 25,
      description: 'A brief assessment to test your basic understanding of key concepts.',
      value: 25
    },
    {
      title: 'Intermediate Proficiency Test',
      colorClass: 'secondary',
      name: 'Intermediate',
      questions: 50,
      description: 'A mid-level test to evaluate your grasp of more detailed material.',
      value: 50
    },
    {
      title: 'Comprehensive Mastery Exam',
      name: 'Comprehensive',
      colorClass: 'success',
      questions: 100,
      description: 'A thorough exam to assess your overall mastery of the subject.',
      value: 100
    }
  ];
  selectedAssessment: number;

  async save() {
    if (!this.selectedAssessment)
      return;

    var userId = this.localStorageService.getItem("userId");
    var assessment = await this.GetApiCallResponse(this.userAssessmentService.post(userId, this.selectedAssessment));
    this.activeModal.close(assessment);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
