import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioViagem } from './relatorio-viagem';

describe('RelatorioViagem', () => {
  let component: RelatorioViagem;
  let fixture: ComponentFixture<RelatorioViagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioViagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioViagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
