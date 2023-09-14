import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRequirementsComponent } from './case-requirements.component';

describe('CaseRequirementsComponent', () => {
  let component: CaseRequirementsComponent;
  let fixture: ComponentFixture<CaseRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaseRequirementsComponent]
    });
    fixture = TestBed.createComponent(CaseRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
