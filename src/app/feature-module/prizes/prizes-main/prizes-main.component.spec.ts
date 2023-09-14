import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesMainComponent } from './prizes-main.component';

describe('PrizesMainComponent', () => {
  let component: PrizesMainComponent;
  let fixture: ComponentFixture<PrizesMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrizesMainComponent]
    });
    fixture = TestBed.createComponent(PrizesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
