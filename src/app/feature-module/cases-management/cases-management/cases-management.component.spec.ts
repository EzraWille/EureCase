import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesManagementComponent } from './cases-management.component';

describe('CasesManagementComponent', () => {
  let component: CasesManagementComponent;
  let fixture: ComponentFixture<CasesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CasesManagementComponent]
    });
    fixture = TestBed.createComponent(CasesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
