import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseParticipantsComponent } from './choose-participants.component';

describe('ChooseParticipantsComponent', () => {
  let component: ChooseParticipantsComponent;
  let fixture: ComponentFixture<ChooseParticipantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseParticipantsComponent]
    });
    fixture = TestBed.createComponent(ChooseParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
