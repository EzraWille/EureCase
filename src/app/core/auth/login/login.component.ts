import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { PasswordEncryptionService } from '../../services/auth/password-encryption.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  hide = true;
  encryptedPassword: string = '';
  private readonly unsubscribe$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _auth: AuthenticationService,
    private _passwordEncrypter: PasswordEncryptionService
  ) {}

  ngOnInit() {
    this.form();
  }

  togglePasswordVisibility($event: Event) {
    $event.preventDefault();
    this.hide = !this.hide;
  }

  form() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  submit() {
    this.loading = true;

    this.encryptedPassword = this._passwordEncrypter.encrypt(
      '3c7be2ceafca4b8595758e8bfd3e251d',
      this.password.value
    );

    this._auth
      .login(this.email.value, this.encryptedPassword)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.loading = false;
          if (data.status.code === '0' && data.result) {
            this.router.navigate(['/welcome']);
          }
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
