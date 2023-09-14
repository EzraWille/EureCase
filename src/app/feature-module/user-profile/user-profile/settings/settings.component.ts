import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  profileSettings!: FormGroup;
  imgURL: any =
    'https://image-cdn.essentiallysports.com/wp-content/uploads/robert-pattinson-the-batman-96x96.jpg';
  isInvalidImageFormat: boolean = false;
  profileImage!: File;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.profileSettingsForm();
    this.initSigninMethods();
  }

  profileSettingsForm() {
    this.profileSettings = this.fb.group({
      //the default data should be retrieved from the getProfileData
      fullName: { value: 'Ahmed Ali', disabled: true },
      email: { value: 'Ahmad@gmail.com', disabled: true },
      accountType: { value: 'Researcher', disabled: true },
      registrationNumber: { value: '2222222', disabled: true },
      academicNumber: { value: '2222222', disabled: true },
      sector: ['private', Validators.required],
      institute: ['Zid System', Validators.required],
      phone: ['044 3276 454 935'],
      website: ['keenthemes.com'],
      country: ['', Validators.required],
      city: ['California', Validators.required],
      PObox: ['22222', Validators.required],
      zipCode: ['22222', Validators.required],
      fax: ['22222', Validators.required],
      addressLine: ['Freedom St', Validators.required],
    });
  }
  profilePicSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      this.isInvalidImageFormat = false;
      this.previewImage(file);
      this.profileImage = file;
    } else {
      this.isInvalidImageFormat = true;
      this.imgURL = null;
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imgURL = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.profileSettings.valid) {
      console.log(this.profileSettings.value);
    }
  }

  private initSigninMethods(): void {
    const t = document.getElementById('kt_signin_email');
    const e = document.getElementById('kt_signin_email_edit');
    const n = document.getElementById('kt_signin_password');
    const o = document.getElementById('kt_signin_password_edit');
    const i = document.getElementById('kt_signin_email_button');
    const s = document.getElementById('kt_signin_cancel');
    const r = document.getElementById('kt_signin_password_button');
    const a = document.getElementById('kt_password_cancel');

    i?.querySelector('button')?.addEventListener('click', () => {
      this.toggleEmailForm();
    });

    s?.addEventListener('click', () => {
      this.toggleEmailForm();
    });

    r?.querySelector('button')?.addEventListener('click', () => {
      this.togglePasswordForm();
    });

    a?.addEventListener('click', () => {
      this.togglePasswordForm();
    });

    // ... FormValidation initialization and handling ...
  }

  private toggleEmailForm(): void {
    const emailForm = document.getElementById('kt_signin_email');
    const emailEdit = document.getElementById('kt_signin_email_edit');
    const emailButton = document.getElementById('kt_signin_email_button');
    emailForm?.classList.toggle('d-none');
    emailButton?.classList.toggle('d-none');
    emailEdit?.classList.toggle('d-none');
  }

  private togglePasswordForm(): void {
    const passwordForm = document.getElementById('kt_signin_password');
    const passwordEdit = document.getElementById('kt_signin_password_edit');
    const passwordButton = document.getElementById('kt_signin_password_button');
    passwordForm?.classList.toggle('d-none');
    passwordButton?.classList.toggle('d-none');
    passwordEdit?.classList.toggle('d-none');
  }
}
