import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistViagem } from './checklist-viagem';

describe('ChecklistViagem', () => {
  let component: ChecklistViagem;
  let fixture: ComponentFixture<ChecklistViagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistViagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistViagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
