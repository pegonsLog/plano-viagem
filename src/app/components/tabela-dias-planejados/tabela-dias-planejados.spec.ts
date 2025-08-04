import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaDiasPlanejados } from './tabela-dias-planejados';

describe('TabelaDiasPlanejados', () => {
  let component: TabelaDiasPlanejados;
  let fixture: ComponentFixture<TabelaDiasPlanejados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaDiasPlanejados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaDiasPlanejados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
