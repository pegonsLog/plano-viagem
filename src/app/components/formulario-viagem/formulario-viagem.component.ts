import { Component, inject, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViagemService } from '../../services/viagem.service';
import { NovaViagem, Viagem } from '../../models/viagem.model';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-formulario-viagem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-viagem.component.html',
  styleUrl: './formulario-viagem.component.scss'
})
export class FormularioViagemComponent implements OnInit {
  private viagemService = inject(ViagemService);
  private dateService = inject(DateService);

  viagemParaEditar = input<Viagem | null>(null);
  viagemCriada = output<void>();
  viagemAtualizada = output<void>();
  cancelar = output<void>();

  viagem: NovaViagem = {
    titulo: '',
    destino: '',
    dataInicio: this.dateService.createBrazilDate(),
    dataFim: this.dateService.createBrazilDate(),
    orcamento: 0,
    descricao: '',
    lembretesImportantes: '',
    observacoesViagem: ''
  };

  dataInicioString = '';
  dataFimString = '';
  isEdicao = false;

  ngOnInit() {
    const viagemEdicao = this.viagemParaEditar();
    if (viagemEdicao) {
      this.isEdicao = true;
      this.viagem = {
        titulo: viagemEdicao.titulo,
        destino: viagemEdicao.destino,
        dataInicio: viagemEdicao.dataInicio,
        dataFim: viagemEdicao.dataFim,
        orcamento: viagemEdicao.orcamento,
        descricao: viagemEdicao.descricao || '',
        lembretesImportantes: viagemEdicao.lembretesImportantes || '',
        observacoesViagem: viagemEdicao.observacoesViagem || ''
      };
      this.dataInicioString = this.dateService.formatDateForInput(viagemEdicao.dataInicio);
      this.dataFimString = this.dateService.formatDateForInput(viagemEdicao.dataFim);
    }
  }

  async onSubmit() {
    if (this.dataInicioString && this.dataFimString) {
      try {
        this.viagem.dataInicio = this.dateService.createDateFromInput(this.dataInicioString);
        this.viagem.dataFim = this.dateService.createDateFromInput(this.dataFimString);

        if (this.isEdicao && this.viagemParaEditar()) {
          await this.viagemService.atualizarViagem(this.viagemParaEditar()!.id, this.viagem);
          this.resetForm();
          this.viagemAtualizada.emit();
        } else {
          await this.viagemService.adicionarViagem(this.viagem);
          this.resetForm();
          this.viagemCriada.emit();
        }
      } catch (error) {
        // Erro já tratado no serviço
        console.error('Erro ao salvar viagem:', error);
      }
    }
  }

  onCancelar() {
    this.resetForm();
    this.cancelar.emit();
  }

  private resetForm() {
    this.viagem = {
      titulo: '',
      destino: '',
      dataInicio: this.dateService.createBrazilDate(),
      dataFim: this.dateService.createBrazilDate(),
      orcamento: 0,
      descricao: '',
      lembretesImportantes: '',
      observacoesViagem: ''
    };
    this.dataInicioString = '';
    this.dataFimString = '';
    this.isEdicao = false;
  }


}