import { Component, input, output, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaViagem, NovoDiaViagem, TIPOS_TRANSPORTE } from '../../models/dia-viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-formulario-dia',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  salvando = signal(false);
  dataString = signal('');

  formData = {
    cidade: '',
    transporte: '',
    nomeHospedagem: '',
    enderecoHospedagem: '',
    deslocamentoLocal: '',
    detalhesVoo: '',
    observacoes: '',
    formaPagamento: '',
    titularCartao: '',
    finalCartao: '',
    quantidadeParcelas: undefined as number | undefined
  };

  tiposTransporte = TIPOS_TRANSPORTE;

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
      this.formData = {
        cidade: dia.cidade,
        transporte: dia.transporte || '',
        nomeHospedagem: dia.nomeHospedagem || '',
        enderecoHospedagem: dia.enderecoHospedagem || '',
        deslocamentoLocal: dia.deslocamentoLocal || '',
        detalhesVoo: dia.detalhesVoo || '',
        observacoes: dia.observacoes || '',
        formaPagamento: dia.formaPagamento || '',
        titularCartao: dia.titularCartao || '',
        finalCartao: dia.finalCartao || '',
        quantidadeParcelas: dia.quantidadeParcelas
      };
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

    this.salvando.set(true);

    try {
      const dataForm = this.dateService.createDateFromInput(this.dataString());

      if (this.modoEdicao()) {
        // Modo edição
        const dadosLimpos = this.limparCamposVazios({
          transporte: this.formData.transporte,
          nomeHospedagem: this.formData.nomeHospedagem,
          enderecoHospedagem: this.formData.enderecoHospedagem,
          deslocamentoLocal: this.formData.deslocamentoLocal,
          detalhesVoo: this.formData.detalhesVoo,
          observacoes: this.formData.observacoes,
          formaPagamento: this.formData.formaPagamento,
          titularCartao: this.formData.titularCartao,
          finalCartao: this.formData.finalCartao,
          quantidadeParcelas: this.formData.quantidadeParcelas
        });

        const diaAtualizado: DiaViagem = {
          ...this.diaViagem()!,
          data: dataForm,
          cidade: this.formData.cidade,
          ...dadosLimpos
        };
        this.salvar.emit(diaAtualizado);
      } else {
        // Modo criação
        const dadosLimpos = this.limparCamposVazios({
          transporte: this.formData.transporte,
          nomeHospedagem: this.formData.nomeHospedagem,
          enderecoHospedagem: this.formData.enderecoHospedagem,
          deslocamentoLocal: this.formData.deslocamentoLocal,
          detalhesVoo: this.formData.detalhesVoo,
          observacoes: this.formData.observacoes,
          formaPagamento: this.formData.formaPagamento,
          titularCartao: this.formData.titularCartao,
          finalCartao: this.formData.finalCartao,
          quantidadeParcelas: this.formData.quantidadeParcelas
        });

        const novoDia: NovoDiaViagem = {
          viagemId: this.viagemId(),
          data: dataForm,
          cidade: this.formData.cidade,
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

  async preencherIdem(campo: string) {
    try {
      // Buscar o dia anterior baseado na data atual do formulário
      const dataAtual = this.dateService.createDateFromInput(this.dataString());
      const diaAnterior = await this.diaViagemService.buscarDiaAnterior(this.viagemId(), dataAtual);

      if (diaAnterior && diaAnterior[campo as keyof DiaViagem]) {
        const valor = diaAnterior[campo as keyof DiaViagem];
        if (valor !== undefined && valor !== null && valor !== '') {
          (this.formData as any)[campo] = valor;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dia anterior:', error);
    }
  }
}