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
    observacoes: ''
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
        observacoes: dia.observacoes || ''
      };
    }
  }

  onDataChange() {
    // Recalcular dia da semana quando data muda
    // O computed já fará isso automaticamente
  }

  onSubmit() {
    if (this.salvando()) return;

    this.salvando.set(true);

    try {
      const dataForm = this.dateService.createDateFromInput(this.dataString());

      if (this.modoEdicao()) {
        // Modo edição
        const diaAtualizado: DiaViagem = {
          ...this.diaViagem()!,
          data: dataForm,
          cidade: this.formData.cidade,
          transporte: this.formData.transporte || undefined,
          nomeHospedagem: this.formData.nomeHospedagem || undefined,
          enderecoHospedagem: this.formData.enderecoHospedagem || undefined,
          deslocamentoLocal: this.formData.deslocamentoLocal || undefined,
          observacoes: this.formData.observacoes || undefined
        };
        this.salvar.emit(diaAtualizado);
      } else {
        // Modo criação
        const novoDia: NovoDiaViagem = {
          viagemId: this.viagemId(),
          data: dataForm,
          cidade: this.formData.cidade,
          transporte: this.formData.transporte || undefined,
          nomeHospedagem: this.formData.nomeHospedagem || undefined,
          enderecoHospedagem: this.formData.enderecoHospedagem || undefined,
          deslocamentoLocal: this.formData.deslocamentoLocal || undefined,
          observacoes: this.formData.observacoes || undefined
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


}