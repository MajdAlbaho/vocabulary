import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '../../shared/components/BaseComponent';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAssessmentService } from '../../services/user.assessment.service';
import { InputStepComponent } from '../../shared/components/input-step/input-step.component';
import { ConfirmationMessageComponent } from '../../shared/components/confirmation-message/confirmation-message.component';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [TranslateModule, InputStepComponent],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent extends BaseComponent implements OnInit {
  @ViewChild(InputStepComponent) inputStepComponent!: InputStepComponent;

  constructor(toastr: ToastrService,
    private userAssessmentService: UserAssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    public modalService: NgbModal,
  ) {
    super(toastr);
  }

  assessment: any;
  private taskStartDate: Date;
  elapsedTime: string = '00:00:00';


  ngOnInit(): void {
    var id = this.route.snapshot.params['id'];
    this.CallApi(this.userAssessmentService.get(id), (assessment: any) => {
      this.assessment = assessment;
      var questions = assessment.userAssessmentQuestions.map((e: any) => ({
        id: e.id,
        name: e.question,
        nameDesc: e.questionLanguage,
        valueDesc: e.answerLanguage,
        value: ''
      }));

      this.inputStepComponent.inputList = questions;
      this.taskStartDate = new Date(assessment.startDateTime);
      setInterval(() => {
        this.updateElapsedTime();
      }, 1000);
    });
  }

  updateElapsedTime(): void {
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime.getTime() - this.taskStartDate.getTime();

    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.elapsedTime = this.formatTime(hours, minutes, seconds);
  }

  formatTime(hours: number, minutes: number, seconds: number): string {
    return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  padTime(time: number): string {
    return time < 10 ? '0' + time : time.toString();
  }


  async submit() {
    if (this.inputStepComponent.isCompleted()) {
      await this.submitInternal();
      return;
    }

    var modal = this.modalService.open(ConfirmationMessageComponent);
    modal.componentInstance.title = "Submit assessment ?";
    modal.componentInstance.message = "Inputs are not completed, Continue ?";
    modal.result.then(
      async () => {
        await this.submitInternal();
      }
    );
  }

  async submitInternal() {
    var userInputs = this.inputStepComponent.inputList;
    var param = {
      "AssessmentId": this.assessment.id,
      "Answers": userInputs.map((e: any) => ({
        id: e.id,
        answer: e.value
      }))
    }

    var assessmentId = await this.GetApiCallResponse(this.userAssessmentService.submit(param));
    if (assessmentId != null) {
      this.router.navigateByUrl(`/assessment/assessment-result/${assessmentId}`);
    }
  }
}
