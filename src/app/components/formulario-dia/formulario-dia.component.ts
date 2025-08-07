import { Component, input, output, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiaViagem, NovoDiaViagem, TIPOS_TRANSPORTE, FORMAS_PAGAMENTO } from '../../models/dia-viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-formulario-dia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './formulario-dia.component.html',
  styleUrl: './formulario-dia.component.scss'
})
export class FormularioDiaComponent implements OnInit {
  diaViagem = input<DiaViagem>();
  data = input.required<Date>();
  viagemId = input.required<string>();

  salvar = output<NovoDiaViagem | DiaViagem>();
  cancelar = output<void>();

  private diaViagemService = inject(DiaViagemService);
  private dateService = inject(DateService);
  private fb = inject(FormBuilder);

  salvando = signal(false);
  dataString = signal('');

  formulario: FormGroup = this.fb.group({
    cidade: ['', [Validators.required]],
    transporte: ['', [Validators.required]],
    nomeHospedagem: ['', [Validators.required]],
    enderecoHospedagem: ['', [Validators.required]],
    contatoHospedagem: [''],
    numeroReserva: [''],
    horarioChecks: [''],
    linkHospedagem: [''],
    deslocamentoLocal: ['', [Validators.required]],
    detalhesVoo: [''],
    observacoes: [''],
    formaPagamento: [''],
    formaPagamentoTransporte: [''],
    titularCartao: [''],
    finalCartao: [''],
    quantidadeParcelas: [null],
    temPendencia: [false],
    motivoPendencia: ['']
  });

  tiposTransporte = TIPOS_TRANSPORTE;
  formasPagamento = FORMAS_PAGAMENTO;

  modoEdicao = computed(() => !!this.diaViagem());

  diaSemanaCalculado = computed(() => {
    if (this.dataString()) {
      const data = this.dateService.createDateFromInput(this.dataString());
      return this.dateService.getWeekdayName(data);
    }
    return this.dateService.getWeekdayName(this.data());
  });

  isFimDeSemana = computed(() => {
    if (this.dataString()) {
      const data = this.dateService.createDateFromInput(this.dataString());
      return this.dateService.isWeekend(data);
    }
    return this.dateService.isWeekend(this.data());
  });

  ngOnInit() {
    // Configurar data inicial
    const dataInicial = this.diaViagem()?.data || this.data();
    this.dataString.set(this.dateService.formatDateForInput(dataInicial));

    // Se estiver editando, preencher formulário
    if (this.diaViagem()) {
      const dia = this.diaViagem()!;
      this.formulario.patchValue({
        cidade: dia.cidade,
        transporte: dia.transporte || '',
        nomeHospedagem: dia.nomeHospedagem || '',
        enderecoHospedagem: dia.enderecoHospedagem || '',
        contatoHospedagem: dia.contatoHospedagem || '',
        numeroReserva: dia.numeroReserva || '',
        horarioChecks: dia.horarioChecks || '',
        linkHospedagem: dia.linkHospedagem || '',
        deslocamentoLocal: dia.deslocamentoLocal || '',
        detalhesVoo: dia.detalhesVoo || '',
        observacoes: dia.observacoes || '',
        formaPagamento: dia.formaPagamento || '',
        formaPagamentoTransporte: dia.formaPagamentoTransporte || '',
        titularCartao: dia.titularCartao || '',
        finalCartao: dia.finalCartao || '',
        quantidadeParcelas: dia.quantidadeParcelas,
        temPendencia: dia.status === 'Pendente',
        motivoPendencia: dia.motivoPendencia || ''
      });
    }
  }

  onDataChange() {
    // Recalcular dia da semana quando data muda
    // O computed já fará isso automaticamente
  }

  private limparCamposVazios(obj: any): any {
    const resultado: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== '' && value !== null && value !== undefined) {
        resultado[key] = value;
      }
    }
    return resultado;
  }

  onSubmit() {
    if (this.salvando()) return;

    // Validar formulário
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);

    try {
      const dataForm = this.dateService.createDateFromInput(this.dataString());
      const formValue = this.formulario.value;

      if (this.modoEdicao()) {
        // Modo edição
        const dadosLimpos = this.limparCamposVazios({
          transporte: formValue.transporte,
          nomeHospedagem: formValue.nomeHospedagem,
          enderecoHospedagem: formValue.enderecoHospedagem,
          contatoHospedagem: formValue.contatoHospedagem,
          numeroReserva: formValue.numeroReserva,
          horarioChecks: formValue.horarioChecks,
          linkHospedagem: formValue.linkHospedagem,
          deslocamentoLocal: formValue.deslocamentoLocal,
          detalhesVoo: formValue.detalhesVoo,
          observacoes: formValue.observacoes,
          formaPagamento: formValue.formaPagamento,
          formaPagamentoTransporte: formValue.formaPagamentoTransporte,
          titularCartao: formValue.titularCartao,
          finalCartao: formValue.finalCartao,
          quantidadeParcelas: formValue.quantidadeParcelas,
          status: formValue.temPendencia ? 'Pendente' : 'Concluído',
          motivoPendencia: formValue.temPendencia ? formValue.motivoPendencia : ''
        });

        const diaAtualizado: DiaViagem = {
          ...this.diaViagem()!,
          data: dataForm,
          cidade: formValue.cidade,
          ...dadosLimpos
        };
        this.salvar.emit(diaAtualizado);
      } else {
        // Modo criação
        const dadosLimpos = this.limparCamposVazios({
          transporte: formValue.transporte,
          nomeHospedagem: formValue.nomeHospedagem,
          enderecoHospedagem: formValue.enderecoHospedagem,
          contatoHospedagem: formValue.contatoHospedagem,
          numeroReserva: formValue.numeroReserva,
          horarioChecks: formValue.horarioChecks,
          linkHospedagem: formValue.linkHospedagem,
          deslocamentoLocal: formValue.deslocamentoLocal,
          detalhesVoo: formValue.detalhesVoo,
          observacoes: formValue.observacoes,
          formaPagamento: formValue.formaPagamento,
          formaPagamentoTransporte: formValue.formaPagamentoTransporte,
          titularCartao: formValue.titularCartao,
          finalCartao: formValue.finalCartao,
          quantidadeParcelas: formValue.quantidadeParcelas,
          status: formValue.temPendencia ? 'Pendente' : 'Concluído',
          motivoPendencia: formValue.temPendencia ? formValue.motivoPendencia : ''
        });

        const novoDia: NovoDiaViagem = {
          viagemId: this.viagemId(),
          data: dataForm,
          cidade: formValue.cidade,
          ...dadosLimpos
        };
        this.salvar.emit(novoDia);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      this.salvando.set(false);
    }
  }

  onCancelar() {
    this.cancelar.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onCancelar();
    }
  }

  async copiarCidadeAnterior() {
    try {
      // Buscar o dia anterior baseado na data atual do formulário
      const dataAtual = this.dateService.createDateFromInput(this.dataString());
      const diaAnterior = await this.diaViagemService.buscarDiaAnterior(this.viagemId(), dataAtual);

      if (diaAnterior && diaAnterior.cidade) {
        this.formulario.patchValue({ cidade: diaAnterior.cidade });
      }
    } catch (error) {
      console.error('Erro ao buscar dia anterior:', error);
    }
  }

  async preencherIdem(campo: string) {
    try {
      // Buscar o dia anterior baseado na data atual do formulário
      const dataAtual = this.dateService.createDateFromInput(this.dataString());
      const diaAnterior = await this.diaViagemService.buscarDiaAnterior(this.viagemId(), dataAtual);

      if (diaAnterior && diaAnterior[campo as keyof DiaViagem]) {
        const valor = diaAnterior[campo as keyof DiaViagem];
        if (valor !== undefined && valor !== null && valor !== '') {
          this.formulario.patchValue({ [campo]: valor });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dia anterior:', error);
    }
  }
}