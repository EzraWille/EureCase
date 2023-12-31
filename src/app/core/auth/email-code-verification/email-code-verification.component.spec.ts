import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCodeVerificationComponent } from './email-code-verification.component';

describe('EmailCodeVerificationComponent', () => {
  let component: EmailCodeVerificationComponent;
  let fixture: ComponentFixture<EmailCodeVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailCodeVerificationComponent]
    });
    fixture = TestBed.createComponent(EmailCodeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
