import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastCasesComponent } from './past-cases.component';

describe('PastCasesComponent', () => {
  let component: PastCasesComponent;
  let fixture: ComponentFixture<PastCasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PastCasesComponent]
    });
    fixture = TestBed.createComponent(PastCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
