import {
    Component,
    Inject,
    Injector,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    API_BASE_URL,
    AttachmentModelDTO,
    AuthorizationServiceProxy,
    ChoiceDto,
    ClassServiceProxy,
    CreateOrUpdateExam,
    EducationalGroupTreeItem,
    ExamQuestionMainDto,
    ExamSectionDto,
    ExamsServiceProxy,
    IndividualDto,
    MarkConfigurationsServiceProxy,
    PreviewExamDto,
    QuestionBankDto,
    SubjectServiceProxy,
    TeamGroupServiceProxy,
    TenantServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { QuestionControlService } from "./services/question-control.service";
import * as _ from "lodash";
import { SelectionModel } from "@angular/cdk/collections";
import { interval, Subscription } from "rxjs";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatStepper } from "@angular/material";
import { ImportQuestionBanksQuestionsComponent } from "./components/import-question-banks-questions/import-question-banks-questions.component";
import { Location } from "@angular/common";
import { element } from "@angular/core/src/render3";
import { HttpClient } from "@angular/common/http";
import { JusoorService } from "@shared/service-proxies/service-proxy-v3/json/swagger";

@Component({
    selector: "app-assignment-creation",
    templateUrl: "./assignment-creation.component.html",
    styleUrls: ["./assignment-creation.component.css"],
})
export class AssignmentCreationComponent
    extends AppComponentBase
    implements OnInit, OnDestroy
{
    @ViewChild(MatStepper) stepper: MatStepper;
    sectionForm = new FormGroup({});
    index = 0;

    questionTypes = [
        { key: this.l("MultipleChoicesSingleAnswer"), value: "2" },
        { key: this.l("MultipleChoicesMultiAnswer"), value: "3" },
        { key: this.l("Text"), value: "1" },
        { key: this.l("TrueOrFalse"), value: "5" },
        { key: this.l("groupQuestions"), value: "4" },
        { key: this.l("Rating"), value: "10" },
    ];
    PDFTypes = [
        { id: 1, title: "One form" },
        { id: 2, title: "Multiple form" },
        { id: 3, title: "Personalized" },
    ];
    questionsArray = [];
    isJussor: boolean = false;
    isPreview = false;
    grades = [];
    classes: EducationalGroupTreeItem[] = [];
    terms = [];
    subjects = [];
    gradesAndClasses = [];
    selection = new SelectionModel<any>(true, []);
    $selection = Subscription.EMPTY;
    $route = Subscription.EMPTY;
    loading = true;
    examName: string;
    examId: number;
    exam = new PreviewExamDto();
    $router = Subscription.EMPTY;
    today = new Date(Date.now());
    showMoreOptions = false;
    jusoorExpirementId: any;
    fullGroupSelectedData = [];
    fullIndividualsSelectedData = [];
    paperFields = false;
    tenanetInfo;
    experimentValidate: boolean = false;
    teams = [];
    teamsMembers = [];
    classesMembers = [];
    learningOutComes = [];
    saveLoading = false;
    firstTimeCreationEnd = false;
    PDFLink: any;
    isPDFView: boolean;
    PDFLoading: boolean;
    private subscription: Subscription;
    $formValueChange = Subscription.EMPTY;
    autoSaveLoading = false;
    exitLoading = false;
    isClone: boolean;
    programId;
    filesType =
        "audio/*, video/*, image/*, .xlsx,.xls, .doc, .docx, .ppt, .pptx, .txt, .pdf, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf";
    listOfAttahcmentFiles: AttachmentModelDTO[] = [];
    URL: string;
    uploaderAttachmentList = [];
    gradeFilled: boolean = false;
    subjectFilled: boolean = false;
    isJussorAvalible: boolean = false;
    constructor(
        injector: Injector,
        private _qcs: QuestionControlService,
        public dialog: MatDialog,
        private _authorizationService: AuthorizationServiceProxy,
        private _markConfigurationsService: MarkConfigurationsServiceProxy,
        private _subjectService: SubjectServiceProxy,
        private _classService: ClassServiceProxy,
        private sanitizer: DomSanitizer,
        private _examsService: ExamsServiceProxy,
        private _route: ActivatedRoute,
        private location: Location,
        private router: Router,
        private _http: HttpClient,
        private _tenantService: TenantServiceProxy,
        private _teamGroupService: TeamGroupServiceProxy,
        private _JussorService: JusoorService,
        @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        this.URL = baseUrl ? baseUrl : "";
    }

    ngOnInit() {
        this.getTenantInfo();
        this.isClone = this._route.snapshot.data.isClone;
        this.getSubjects();
        this.$route = this._route.params.subscribe((params) => {
            this.examName = params.name;
            this.examId = params.id;
        });

        this.$selection = this.selection.changed.subscribe((res) => {
            this.fullIndividualsSelectedData = [];
            res.source.selected.forEach((ele) => {
                if (
                    this.sectionForm
                        .get("examDetailsForm")
                        .get("isCascadedToMicrosoftTeams").value
                ) {
                    this.teamsMembers.forEach((user) => {
                        if (ele === user.memberId)
                            this.fullIndividualsSelectedData.push({
                                fullName: user.memberFullName,
                                id: user.memberId,
                            });
                    });
                } else {
                    this.classesMembers.forEach((user) => {
                        if (ele === user.id)
                            this.fullIndividualsSelectedData.push(user);
                    });
                }
            });
            this.sectionForm
                .get("examineesForm")
                .get("individuals")
                .setValue(res.source.selected);
        });

        // this.autoSave();
    }
    autoSave() {
        this.subscription = interval(30000).subscribe((x) => {
            const sections = this.sectionForm.get("sections") as FormArray;
            const examineesForm = this.sectionForm.get(
                "examineesForm"
            ) as FormGroup;

            if (
                sections.status !== "INVALID" &&
                !this.autoSaveLoading &&
                !this.isPreview &&
                !this.isPDFView &&
                examineesForm.status !== "INVALID"
            ) {
                this.onSubmit(false);
            }
        });
    }
    jussorAvalibity() {
        const subjectId = this.sectionForm
            .get("examDetailsForm")
            .get("subjectId").value.id;

        const gradeId = this.sectionForm
            .get("examDetailsForm")
            .get("gradeId").value;

        this._JussorService
            .apiJusoorJusoorAvailabilityGet(gradeId, subjectId)
            .subscribe((res) => {
                this.isJussorAvalible = true;
            });
    }
    onClosePreviewClicked() {
        this.isPreview = !this.isPreview;

        this.PDFLink = undefined;
    }
    clearInterval() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    getLearningStrands() {
        this._examsService
            .getLearningStrands(
                this.sectionForm.get("examDetailsForm").get("gradeId").value,
                this.sectionForm.get("examDetailsForm").get("subjectId").value
                    .id,
                undefined,
                undefined,
                undefined
            )
            .subscribe((res) => {
                this.learningOutComes = [...res];
            });
    }

    getExamById(isAfterCreateOrEdit: boolean) {
        const examDetailsForm = this.sectionForm.get(
            "examDetailsForm"
        ) as FormGroup;

        this._examsService
            .getExamById(
                isAfterCreateOrEdit
                    ? examDetailsForm.get("id").value
                    : this.examId
            )
            .subscribe(
                (res) => {
                    this.exam = res;
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    if (isAfterCreateOrEdit) {
                        this.createQuestionsByData();
                    } else {
                        this.fillEdit();
                    }
                }
            );
    }

    getSubjects() {
        this._subjectService.getAllSubjects().subscribe(
            (res) => {
                this.subjects = res.items;
            },
            (error) => {
                console.log(error);
            },
            () => {
                this.sectionForm = this._qcs.addSection();

                if (this.examId) {
                    this.getExamById(false);
                } else {
                    this.loading = false;
                }
                this.sectionForm
                    .get("examDetailsForm")
                    .get("examType")
                    .valueChanges.subscribe((result) => {
                        if (result === 4) {
                            if (!this.examId) {
                                this._qcs.clearSectionsData();
                            }
                            this._qcs.clearSectionsData();
                            this.sectionForm
                                .get("attachment")
                                .clearValidators();
                            this.sectionForm
                                .get("attachment")
                                .updateValueAndValidity();
                            this.sectionForm
                                .get("examDetailsForm")
                                .get("totalMark")
                                .clearValidators();
                            this.sectionForm
                                .get("examDetailsForm")
                                .get("totalMark")
                                .updateValueAndValidity();

                            this.experimentValidate = true;
                        }
                        if (result === 3) {
                            this._qcs.clearSectionsData();



                            this.sectionForm
                                .get("examDetailsForm")
                                .get("totalMark")
                                .setValidators(Validators.required);
                            this.sectionForm
                                .get("examDetailsForm")
                                .get("totalMark")
                                .updateValueAndValidity();
                            this.experimentValidate = false;
                        }

                        if (result === 2) {
                            if (!this.examId) {
                                this._qcs.clearSectionsData();
                            }
                            this.sectionForm
                                .get("attachment")
                                .clearValidators();
                            this.sectionForm
                                .get("attachment")
                                .updateValueAndValidity();
                            this._qcs.addSection();
                            this.sectionForm
                                .get("examDetailsForm")
                                .get("totalMark")
                                .clearValidators();
                            this.sectionForm
                                .get("examDetailsForm")
                                .get("totalMark")
                                .updateValueAndValidity();
                            this.experimentValidate = false;
                        }
                    });

                this.sectionForm
                    .get("examDetailsForm")
                    .get("end")
                    .valueChanges.subscribe((value) => {
                        if (value) {
                            if (
                                !this.sectionForm
                                    .get("examDetailsForm")
                                    .get("closeDate").value
                            ) {
                                this.sectionForm
                                    .get("examDetailsForm")
                                    .get("closeDate")
                                    .setValue(
                                        moment(value).add(1, "day").format()
                                    );
                            }
                        }
                    });
            }
        );
    }
    getAssessmentElements(programId) {
        this._markConfigurationsService
            .getAssessmentElemensByProgramId(programId)
            .subscribe((result) => {
                this.terms = [...result];
            });
    }
    isCascadedToMicrosoftTeamsChange($event) {
        this.clearExaminees();
    }

    clearExaminees() {
        this.sectionForm.get("examineesForm").get("classes").setValue([]);
        this.sectionForm.get("examineesForm").get("individuals").setValue([]);
        this.fullIndividualsSelectedData = [];
        this.fullGroupSelectedData = [];
        this.selection.clear();
    }

    changeSubject(subject: any) {
        this.clearExaminees();
        const subjectId = subject.value ? subject.value.id : subject.id;
        if (subjectId) {
            this.subjectFilled = true;
        } else {
            this.subjectFilled = false;
        }
        const programId = subject.value
            ? subject.value.programId
            : subject.programId;
        this.sectionForm.get("examDetailsForm").get("gradeId").setValue(null);
        this._authorizationService
            .getAcademicsAuthorizedHierarchy(subjectId)
            .subscribe(
                (res) => {
                    this.gradesAndClasses = [...res];
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    this.grades = this.gradesAndClasses.filter(
                        (group) => group.type === 2
                    );
                    this.getAssessmentElements(programId);
                    if (this.examId) {
                        this.changeGrade(this.exam.gradeId);
                        this.fillClasses();
                        this.loading = false;
                        this.$formValueChange =
                            this.sectionForm.valueChanges.subscribe((res) => {
                                this.stepper.linear = true;
                            });
                        setTimeout(() => {
                            if (this.sectionForm.valid) {
                                this.stepper.linear = false;
                                this.index = 2;
                            }
                        }, 1000);
                    }
                }
            );
    }
    getTenantInfo() {
        // this._tenantService.getTenantInfo().subscribe((res) => {
        //     this.isJussor = res.isJusoor;
        // });
    }
    changeGrade(grade: any) {
        this.clearExaminees();
        const gradeId = grade.value ? grade.value : grade;
        if (gradeId) {
            this.gradeFilled = true;
        } else {
            this.gradeFilled = false;
        }
        this.classes = this.gradesAndClasses.filter(
            (group) => group.type === 3 && group.parentId === gradeId
        );
        this.getTeams(gradeId);
        this.getClassesMembers();
        this.getLearningStrands();
        this.jussorAvalibity();
    }

    getClassesMembers() {
        this._classService
            .getClassesMembers(
                this.classes.map((ele) => ele.id),
                this.sectionForm.get("examDetailsForm").get("subjectId").value
                    .id,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                500,
                0
            )
            .subscribe((res) => {
                this.classesMembers = res.items;
                if (this.exam.inividuals) {
                    this.selection.select(
                        ...this.exam.inividuals.map((user) => user.userId)
                    );
                }
            });
    }

    getTeams(gradeId: number) {
        this._teamGroupService
            .getUserAuthorizedGradeSubjectTeams(
                gradeId,
                this.sectionForm.get("examDetailsForm").get("subjectId").value
                    .id,
                this.appSession.userId
            )
            .subscribe(
                (res) => {
                    this.teams = res.map((ele) => ({
                        displayName: ele.name,
                        id: ele.id,
                    }));
                    this.teamsMembers = _.uniqBy(
                        _.flatMap(
                            res.map((team) =>
                                team.members.map((ele) => ({
                                    ...ele,
                                    className: team.name,
                                }))
                            )
                        ),
                        "memberId"
                    );
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    selectionChange($event) {
        this.index = $event.selectedIndex;
        if (this.index === 2) {
            this.sectionForm
                .get("attachment")
                .setValue(this.uploaderAttachmentList);
        }
    }

    getSections(sections: any) {
        this.sectionForm = sections;
    }

    removeSection(index: number) {
        this.message.confirm(this.l("AreYouSure"), (isConfirmed) => {
            if (isConfirmed) {
                const sections = this.sectionForm.get("sections") as FormArray;
                sections.removeAt(index);
                this.questionsArray.splice(index, 1);
            }
        });
    }

    fillClasses() {
        const examineesForm = this.sectionForm.get(
            "examineesForm"
        ) as FormGroup;
        let individuals = [];
        let classesIds = [];
        if (this.exam.inividuals) {
            individuals =
                this.exam.inividuals.length > 0
                    ? this.exam.inividuals.map((user) => user.userId)
                    : [];
        }
        if (this.exam.classes && this.exam.classes.length > 0) {
            if (!this.exam.isCascadedToMicrosoftTeams) {
                this.exam.classes.forEach((ele) => {
                    classesIds.push(ele.classId);
                    this.fullGroupSelectedData.push({
                        displayName: ele.className,
                        id: ele.classId,
                    });
                });
            }
        }

        if (this.exam.teamGroups && this.exam.teamGroups.length > 0) {
            if (this.exam.isCascadedToMicrosoftTeams) {
                this.exam.teamGroups.forEach((ele) => {
                    classesIds.push(ele.teamGroupId);
                    this.fullGroupSelectedData.push({
                        displayName: ele.teamGroupName,
                        id: ele.teamGroupId,
                    });
                });
            }
        }

        examineesForm.patchValue({
            individuals: individuals,
            classes: classesIds,
        });
    }

    fillEdit() {
        this.createQuestionsByData();

        const examDetailsForm = this.sectionForm.get(
            "examDetailsForm"
        ) as FormGroup;
        const selectedSubejct = this.subjects.filter(
            (subject) => subject.id === this.exam.subjectId
        );

        if (this.exam.examType === 1) {
            this.paperFields = true;
            examDetailsForm.get("end").clearValidators();
            examDetailsForm.get("end").reset();
            examDetailsForm.get("end").updateValueAndValidity();

            examDetailsForm
                .get("examPdfType")
                .setValidators(Validators.required);
            examDetailsForm.get("examPdfType").updateValueAndValidity();
        } else {
            this.paperFields = false;
            examDetailsForm.get("end").setValidators(Validators.required);
            examDetailsForm.get("end").updateValueAndValidity();

            examDetailsForm.get("examPdfType").clearValidators();
            examDetailsForm.get("examPdfType").reset();
            examDetailsForm.get("examPdfType").updateValueAndValidity();
        }

        this.changeSubject(selectedSubejct[0]);

        examDetailsForm.patchValue({
            id: !this.isClone ? this.exam.id : null,
            title: this.exam.title,
            totalMark: this.exam.totalMarks,
            closeDate: this.exam.close ? this.exam.close.toDate() : null,
            examType: this.exam.examType,
            gradeId: this.exam.gradeId,
            subjectId: selectedSubejct[0],
            assessmentElementId: this.exam.assessmentElementId,
            start: this.exam.start ? this.exam.start.toDate() : null,
            hasBorder: this.exam.hasBorder,
            end: this.exam.end ? this.exam.end.toDate() : null,
            durationMinutes: this.exam.durationMinutes,
            description: this.exam.htmlContent,
            layout: this.exam.layout,
            isCascadedToMicrosoftTeams: this.exam.isCascadedToMicrosoftTeams,
            isScreenProctored: this.exam.isScreenProctored,
            isCameraProctored: this.exam.isCameraProctored,
            isQuestionsSubmissionScreenshotProctored:
                this.exam.isQuestionsSubmissionScreenshotProctored,
            examPdfType: this.exam.examPdfType,
            numberOfForms: this.exam.numberOfForms,
            isSectionQuestionsShuffled: this.exam.isSectionQuestionsShuffled,
            attachment: this.exam.attachments,
            jusoorExpirementId: this.jusoorExpirementId,
            assignmentType:
                this.exam.attachments && this.exam.attachments.length > 0
                    ? 2
                    : 1,
        });

        this.uploaderAttachmentList = this.exam.attachments;
        console.log(this.sectionForm.get("sections"));
        examDetailsForm.get("subjectId").disable();
        examDetailsForm.get("gradeId").disable();
        examDetailsForm.get("examType").disable();
    }

    createQuestionsByData() {
        this.questionsArray = [];
        this._qcs.clearSectionsData();
        this.exam.sections.forEach((section, index) => {
            this.sectionForm = this._qcs.addSection(section);
            this.questionsArray.push(section.questions);
            this._qcs.questionsToForm(this.questionsArray[index], index);
        });
    }

    importFromQuestionsBank(sectionIndex: number) {
        const dialogRef = this.dialog.open(
            ImportQuestionBanksQuestionsComponent,
            {
                width: "60%",
                data: {
                    gradeId: this.sectionForm
                        .get("examDetailsForm")
                        .get("gradeId").value,
                    subjectId: this.sectionForm
                        .get("examDetailsForm")
                        .get("subjectId").value.id,
                },
            }
        );

        dialogRef.afterClosed().subscribe((res: QuestionBankDto[]) => {
            if (res) {
                res.forEach((question) => {
                    this.addNewQuestion(
                        question.questionType.toString(),
                        sectionIndex,
                        question
                    );
                });
            }
        });
    }

    addNewQuestion(
        data: string,
        sectionIndex: number,
        question?: QuestionBankDto
    ) {
        const questions: ExamQuestionMainDto[] = [];
        if (parseInt(data) === 7) {
            this._qcs.addSection();
        } else {
            const examQuestionMainDto = new ExamQuestionMainDto();
            examQuestionMainDto.index =
                this.questionsArray[sectionIndex] &&
                this.questionsArray[sectionIndex].length > 0
                    ? this.questionsArray[sectionIndex][
                          this.questionsArray[sectionIndex].length - 1
                      ].index + 1
                    : 1;
            if (question) {
                // examQuestionMainDto.numofStars = question.numofStars; // need to be added by Roaa
                examQuestionMainDto.bloomsTaxonomy = question.bloomsTaxonomy;
                examQuestionMainDto.difficulty = question.difficulty;
                examQuestionMainDto.htmlContent = question.htmlContent;
                examQuestionMainDto.htmlIdealAnswer = question.htmlIdealAnswer;
                examQuestionMainDto.choices = question.choices;
                if (question.childrenQuestions) {
                    question.childrenQuestions.forEach((child, index) => {
                        const childQuestion = new ExamQuestionMainDto();
                        childQuestion.questionType = child.questionType;
                        childQuestion.index = index + 1;
                        childQuestion.choices = child.choices;
                        childQuestion.difficulty = child.difficulty;
                        childQuestion.originalQuestionId = child.id;
                        childQuestion.markValue = null;
                        childQuestion.htmlContent = child.htmlContent;
                        childQuestion.bloomsTaxonomy = child.bloomsTaxonomy;
                        childQuestion.htmlIdealAnswer = child.htmlIdealAnswer;
                        childQuestion.isMandatory = false;
                        childQuestion.areChoicesHorizental = false;
                        childQuestion.canReturnToQuestion = false;
                        childQuestion.timeInSeconds = 0;
                        childQuestion.isChoicesShuffled = false;
                        childQuestion.canUploadAttachmentAnswer = false;
                        childQuestion.numberOfAttachmentsAllowed = 1;
                        childQuestion.learningObjectives =
                            child.learningObjectives;
                        examQuestionMainDto.childrenQuestions = [];
                        examQuestionMainDto.childrenQuestions.push(
                            childQuestion
                        );
                    });
                }
                examQuestionMainDto.originalQuestionId = question.id;
                examQuestionMainDto.learningObjectives =
                    question.learningObjectives;
            }

            switch (parseInt(data)) {
                case 1:
                    examQuestionMainDto.questionType = 1;
                    questions.push(examQuestionMainDto);
                    break;

                case 2:
                    examQuestionMainDto.questionType = 2;
                    questions.push(examQuestionMainDto);
                    break;
                case 3:
                    examQuestionMainDto.questionType = 3;
                    questions.push(examQuestionMainDto);
                    break;
                case 4:
                    examQuestionMainDto.questionType = 4;
                    questions.push(examQuestionMainDto);
                    break;

                case 5:
                    examQuestionMainDto.questionType = 5;
                    questions.push(examQuestionMainDto);
                    break;
                case 10:
                    examQuestionMainDto.questionType = 10;
                    examQuestionMainDto.difficulty = 1;
                    questions.push(examQuestionMainDto);
                    break;
            }

            if (!this.questionsArray[sectionIndex]) {
                this.questionsArray[sectionIndex] = [];
            }
            this.questionsArray[sectionIndex].push(...questions);
            this._qcs.toFormGroup(
                this.questionsArray[sectionIndex],
                sectionIndex
            );
        }
    }

    isQuestionMoved(questions: any[], index: number) {
        this.questionsArray[index] = [...questions];
    }

    trackByFn(index, item) {
        return item.index;
    }

    changePDFType($event: any) {
        const examDetailsForm = this.sectionForm.get(
            "examDetailsForm"
        ) as FormGroup;
        if ($event.value === 2) {
            examDetailsForm
                .get("numberOfForms")
                .setValidators([Validators.required, Validators.min(2)]);
            examDetailsForm.get("numberOfForms").updateValueAndValidity();
        } else {
            examDetailsForm.get("numberOfForms").clearValidators();
            examDetailsForm.get("numberOfForms").reset();
            examDetailsForm.get("numberOfForms").updateValueAndValidity();
        }
    }

    changeExamType($event: any) {
        const examDetailsForm = this.sectionForm.get(
            "examDetailsForm"
        ) as FormGroup;
        console.log("examDetailsForm", examDetailsForm);
        console.log("event", $event.value);
        if ($event.value === 1) {
            this.questionTypes = [
                { key: this.l("MultipleChoicesSingleAnswer"), value: "2" },
                { key: this.l("MultipleChoicesMultiAnswer"), value: "3" },
                { key: this.l("Text"), value: "1" },
                { key: this.l("TrueOrFalse"), value: "5" },
                { key: this.l("groupQuestions"), value: "4" },
            ];
            this.paperFields = true;
            examDetailsForm.get("isSectionQuestionsShuffled").setValue(false);
            examDetailsForm
                .get("examPdfType")
                .setValidators(Validators.required);
            examDetailsForm.get("examPdfType").updateValueAndValidity();
            examDetailsForm.get("end").clearValidators();
            examDetailsForm.get("end").reset();
            examDetailsForm.get("end").updateValueAndValidity();
            this.isJussor=false;

        }if($event.value === 4){
            this.isJussor=true;
        } else {
            this.questionTypes = [
                { key: this.l("MultipleChoicesSingleAnswer"), value: "2" },
                { key: this.l("MultipleChoicesMultiAnswer"), value: "3" },
                { key: this.l("Text"), value: "1" },
                { key: this.l("TrueOrFalse"), value: "5" },
                { key: this.l("groupQuestions"), value: "4" },
                { key: this.l("Rating"), value: "10" },
            ];
            this.paperFields = false;
            examDetailsForm.get("isSectionQuestionsShuffled").setValue(true);
            examDetailsForm.get("examPdfType").clearValidators();
            examDetailsForm.get("examPdfType").reset();
            examDetailsForm.get("examPdfType").updateValueAndValidity();
            examDetailsForm.get("end").setValidators(Validators.required);
            examDetailsForm.get("end").updateValueAndValidity();
            this.isJussor=false;

        }
    }

    showPDF() {
        this.isPDFView = !this.isPDFView;
        const createOrUpdateExam = this.createExamDTO();
        if (this.isPDFView && this.sectionForm.valid) {
            this.PDFLoading = true;
            this._examsService
                .generatePdfForPreview(createOrUpdateExam)
                .subscribe(
                    (res) => {
                        this.PDFLink =
                            this.sanitizer.bypassSecurityTrustResourceUrl(
                                res + "#toolbar=0&navpanes=0"
                            );
                    },
                    (error) => {
                        this.PDFLoading = false;
                    },
                    () => {
                        this.PDFLoading = false;
                    }
                );
        }
    }

    createExamDTO() {
        // Exam forms

        const examDetailsForm = this.sectionForm.get(
            "examDetailsForm"
        ) as FormGroup;
        const examineesForm = this.sectionForm.get(
            "examineesForm"
        ) as FormGroup;
        const sections = this.sectionForm.get("sections") as FormArray;
        const attachment = this.sectionForm.get("attachment") as FormControl;

        const createOrUpdateExam = new CreateOrUpdateExam();
        createOrUpdateExam.id = examDetailsForm.get("id").value;
        createOrUpdateExam.totalMarks = examDetailsForm.get("totalMark").value;
        createOrUpdateExam.close = moment(
            examDetailsForm.get("closeDate").value
        );

        createOrUpdateExam.hasBorder = examDetailsForm.get("hasBorder").value;
        createOrUpdateExam.description =
            examDetailsForm.get("description").value;
        createOrUpdateExam.isCascadedToMicrosoftTeams = examDetailsForm.get(
            "isCascadedToMicrosoftTeams"
        ).value;
        createOrUpdateExam.assessmentElementId = examDetailsForm.get(
            "assessmentElementId"
        ).value;
        createOrUpdateExam.gradeId = examDetailsForm.get("gradeId").value;
        createOrUpdateExam.durationMinutes =
            examDetailsForm.get("durationMinutes").value;
        createOrUpdateExam.isCameraProctored =
            examDetailsForm.get("isCameraProctored").value;
        createOrUpdateExam.isQuestionsSubmissionScreenshotProctored = true;
        createOrUpdateExam.isScreenProctored = true;
        createOrUpdateExam.isSectionQuestionsShuffled = examDetailsForm.get(
            "isSectionQuestionsShuffled"
        ).value;
        createOrUpdateExam.assessmentDefinitionId = 2;
        createOrUpdateExam.numberOfForms =
            examDetailsForm.get("numberOfForms").value;
        createOrUpdateExam.examPdfType =
            examDetailsForm.get("examPdfType").value;

        createOrUpdateExam.start = examDetailsForm.get("start").value;
        createOrUpdateExam.end = examDetailsForm.get("end").value;
        createOrUpdateExam.examType = examDetailsForm.get("examType").value;

        createOrUpdateExam.title = examDetailsForm.get("title").value;
        createOrUpdateExam.subjectId =
            examDetailsForm.get("subjectId").value.id;
        createOrUpdateExam.layout = examDetailsForm.get("layout").value;
        createOrUpdateExam.teamGroups = [];
        createOrUpdateExam.classes = [];
        createOrUpdateExam.attachments = [];
        createOrUpdateExam.attachments = attachment.value;
        createOrUpdateExam.jusoorExpirementId = this.jusoorExpirementId;
        if (
            this.sectionForm
                .get("examDetailsForm")
                .get("isCascadedToMicrosoftTeams").value
        ) {
            createOrUpdateExam.teamGroups = examineesForm.get("classes").value;
        } else {
            createOrUpdateExam.classes = examineesForm.get("classes").value;
        }

        const allIndividuals: IndividualDto[] = [];

        if (examineesForm.get("individuals").value) {
            examineesForm.get("individuals").value.forEach((individualId) => {
                const individualDto = new IndividualDto();
                if (
                    this.sectionForm
                        .get("examDetailsForm")
                        .get("isCascadedToMicrosoftTeams").value
                ) {
                    this.teamsMembers.forEach((teamEle) => {
                        if (teamEle.memberId === individualId) {
                            individualDto.teamGroupId = teamEle.teamGroupId;
                            individualDto.userId = individualId;
                            allIndividuals.push(individualDto);
                        }
                    });
                } else {
                    this.classesMembers.forEach((classEle) => {
                        if (classEle.id === individualId) {
                            individualDto.teamGroupId = null;
                            individualDto.userId = individualId;
                            allIndividuals.push(individualDto);
                        }
                    });
                }
            });
        }
        createOrUpdateExam.inividuals = allIndividuals;
        createOrUpdateExam.sections = [];
        let sectionIndex = 0;
        sections.value.forEach((section) => {
            sectionIndex++;
            const examSectionDto = new ExamSectionDto();
            examSectionDto.index = sectionIndex;
            examSectionDto.title = section.title;

            const parentQuestions: ExamQuestionMainDto[] = [];
            // questions
            let questionIndex = 0;
            section.questions.forEach((question) => {
                questionIndex++;
                const examQuestionMainDto = new ExamQuestionMainDto(
                    ...question
                );
                examQuestionMainDto.index = questionIndex;
                // choices
                examQuestionMainDto.choices = [];
                question.choices.forEach((ele) => {
                    const choicesDTO = new ChoiceDto(...ele);
                    examQuestionMainDto.choices.push(choicesDTO);
                });

                // childrenQuestions
                examQuestionMainDto.childrenQuestions = [];
                let childrenQuestionsIndex = 0;

                question.childrenQuestions.forEach((element) => {
                    childrenQuestionsIndex++;
                    const examQuestionMainDto2 = new ExamQuestionMainDto(
                        ...element
                    );
                    examQuestionMainDto2.index = childrenQuestionsIndex;
                    // children questions choices
                    examQuestionMainDto2.choices = [];
                    element.choices.forEach((ele) => {
                        const choicesDTO = new ChoiceDto(...ele);
                        examQuestionMainDto2.choices.push(choicesDTO);
                    });

                    examQuestionMainDto.childrenQuestions.push(
                        examQuestionMainDto2
                    );
                });

                parentQuestions.push(examQuestionMainDto);
            });

            examSectionDto.questions = parentQuestions;
            createOrUpdateExam.sections.push(examSectionDto);
        });

        return createOrUpdateExam;
    }

    onSubmit(navigate) {
        this.exitLoading = navigate;

        this.autoSaveLoading = !navigate;
        if (this.sectionForm.get("attachment").value) {
            this.upload().then(() => {
                this.sectionForm
                    .get("attachment")
                    .setValue(this.listOfAttahcmentFiles);
                this.sectionForm.get("attachment").updateValueAndValidity();
                const createOrUpdateExam = this.createExamDTO();
                const examDetailsForm = this.sectionForm.get(
                    "examDetailsForm"
                ) as FormGroup;

                if (examDetailsForm.get("id").value) {
                    this.editExam(createOrUpdateExam, navigate);
                    return;
                }

                this.createExam(createOrUpdateExam, navigate);
            });
        } else {
            const createOrUpdateExam = this.createExamDTO();
            const examDetailsForm = this.sectionForm.get(
                "examDetailsForm"
            ) as FormGroup;

            if (examDetailsForm.get("id").value) {
                this.editExam(createOrUpdateExam, navigate);
                return;
            }

            this.createExam(createOrUpdateExam, navigate);
        }
    }
    createExam(createOrUpdateExam, navigate) {
        this.saveLoading = true;
        this._examsService.createExam(createOrUpdateExam).subscribe(
            (res) => {
                const examDetailsForm = this.sectionForm.get(
                    "examDetailsForm"
                ) as FormGroup;
                examDetailsForm.get("id").setValue(res);
            },
            (error) => {
                this.saveLoading = false;
                this.autoSaveLoading = false;
                this.exitLoading = false;

                this.notify.error(error);
            },
            () => {
                setTimeout(() => {
                    this.saveLoading = false;
                    this.autoSaveLoading = false;
                    this.exitLoading = false;
                    this.getExamById(true);
                }, 3000);

                if (navigate) {
                    this.navigation();
                    this.notify.success(this.l("DoneSuccessfully"));
                }
                console.log(this.sectionForm.valid);
            }
        );
    }
    editExam(createOrUpdateExam, navigate) {
        this.saveLoading = true;
        this._examsService.editExam(createOrUpdateExam).subscribe(
            (res) => {},
            (error) => {
                this.saveLoading = false;
                this.autoSaveLoading = false;
                this.exitLoading = false;
                this.notify.error(error);
            },
            () => {
                setTimeout(() => {
                    this.saveLoading = false;
                    this.autoSaveLoading = false;
                    this.exitLoading = false;
                }, 3000);

                this.getExamById(true);

                if (navigate) {
                    this.navigation();
                    this.notify.success(this.l("DoneSuccessfully"));
                }
            }
        );
    }
    changeStartEndDate($event) {
        const start = this.sectionForm
            .get("examDetailsForm")
            .get("start").value;
        const end = this.sectionForm.get("examDetailsForm").get("end").value;
        if (end && start) {
            this.sectionForm
                .get("examDetailsForm")
                .get("durationMinutes")
                .setValue(
                    Math.round(
                        moment
                            .duration(moment(end).diff(moment(start)))
                            .asMinutes()
                    )
                );
        }
    }
    getListOfAttachment($event) {
        this.sectionForm.get("attachment").setValue($event);
        this.uploaderAttachmentList = $event;
    }

    upload() {
        let allAttachmentPromises: Promise<any>[] = [];
        this.listOfAttahcmentFiles = [];
        this.sectionForm.get("attachment").value.forEach((file) => {
            const formData = new FormData();
            if (file.fileURL) {
                this.listOfAttahcmentFiles.push(file);
            } else {
                formData.append(file.file.name, file.file.rawFile);
                let promise = this._http
                    .post(this.URL + "/api/Upload/UploadFile", formData, {
                        reportProgress: true,
                    })
                    .toPromise()
                    .then((result) => {
                        let uploadedFile = result["result"];
                        let attachmentFile = new AttachmentModelDTO();
                        attachmentFile.fileExtension =
                            uploadedFile.fileExtension;
                        attachmentFile.fileType = uploadedFile.fileType;
                        attachmentFile.fileContentType =
                            uploadedFile.fileContentType;

                        attachmentFile.fileName = uploadedFile.fileName
                            .trim()
                            .replace(/\s/g, "");
                        attachmentFile.fileURL = uploadedFile.fileURL;
                        attachmentFile.fileUploadName =
                            uploadedFile.fileUploadName;
                        attachmentFile.fileSizeInBytes =
                            uploadedFile.fileSizeInBytes;
                        attachmentFile.fileThumbnailURL =
                            uploadedFile.fileThumbnailURL;

                        this.listOfAttahcmentFiles.push(attachmentFile);
                    });
                allAttachmentPromises.push(promise);
            }
        });

        return Promise.all(allAttachmentPromises);
    }

    navigation() {
        this.router.navigate(["/app/assignment/details"]);
    }
    onExperimentSelected($event: any) {
        this.jusoorExpirementId = $event;
        if (this.jusoorExpirementId === null) {
            this.experimentValidate = true;
        } else {
            this.experimentValidate = false;
        }
        console.log("parent Exp id", this.jusoorExpirementId);
    }
    ngOnDestroy() {
        this._qcs.ngOnDestroy();
        if (this.$selection) this.$selection.unsubscribe();
        if (this.$route) this.$route.unsubscribe();
        if (this.$formValueChange) this.$formValueChange.unsubscribe();
        this.clearInterval();
    }
}
