import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordEncryptionService } from '../../services/auth/password-encryption.service';
import { AlertsService } from '../../services/alert/alerts.service';
enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}
@Component({
  selector: 'app-email-code-verification',
  templateUrl: './email-code-verification.component.html',
  styleUrls: ['./email-code-verification.component.scss'],
})
export class EmailCodeVerificationComponent implements OnInit{
  verificationForm!: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading: boolean = false;
  encryptedEmail: string | null = '';
  fullName: string | null = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _encryption: PasswordEncryptionService,
    private route: ActivatedRoute,
    private _alert: AlertsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe((param) => {
      this.encryptedEmail = param['email'];
      this.fullName = param['fullName'];
    });
    this.email = this._encryption.decrypt(
      '3c7be2ceafca4b8595758e8bfd3e251d',
      this.encryptedEmail
    );
    console.log('email', this.email);
    console.log('fullName', this.fullName);
    this.sendVerificationEmail();
  }

  sendVerificationEmail() {
    if (this.email && this.fullName) {
      this._authService
        .sendVerificationEmail(this.email, this.fullName)
        .subscribe((response) => {
          if (response.status.code !== '0') {
            this._alert
              .error('', 'Unexpected error occured. Please try again later')
              .then(() => this.router.navigate(['/auth']));
          }
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.verificationForm.controls;
  }

  initForm() {
    this.verificationForm = this.fb.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
    });
  }

  verifyOTP() {
    this.isLoading = true;
    const verificationCode = Object.values(this.verificationForm.value).join(
      ''
    );
    this._authService
      .sendVerificationCode(this.email, verificationCode)
      .subscribe((response) => {
        if (response.status.code === '0') {
          this.isLoading = false;

          this._alert
            .success(
              'Registraion Completed.',
              'Please await approval for access to your account.'
            )
            .then(() => {
              this.router.navigate(['/auth']);
            });
        } else {
          this.isLoading = false;
          this._alert.error('', `${response.status.description}`).then(() => {
            this.verificationForm.reset();
          });
        }
      });
  }
}
