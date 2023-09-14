import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyQuartarlyComponent } from './monthly-quartarly.component';

describe('MonthlyQuartarlyComponent', () => {
  let component: MonthlyQuartarlyComponent;
  let fixture: ComponentFixture<MonthlyQuartarlyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyQuartarlyComponent]
    });
    fixture = TestBed.createComponent(MonthlyQuartarlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
