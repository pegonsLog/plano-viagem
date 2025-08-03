import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaViagem, NovoDiaViagem, TIPOS_TRANSPORTE } from '../../models/dia-viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { ViagemService } from '../../services/viagem.service';
import { DateService } from '../../utils/date.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';

@Component({
    selector: 'app-formulario-dia-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './formulario-dia-page.component.html',
    styleUrl: './formulario-dia-page.component.scss'
})
export class FormularioDiaPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private diaViagemService = inject(DiaViagemService);
    private viagemService = inject(ViagemService);
    private dateService = inject(DateService);
    private errorHandler = inject(ErrorHandlerService);

    salvando = signal(false);
    dataString = signal('');
    viagemId = signal('');
    diaId = signal<string | null>(null);

    formData = {
        cidade: '',
        transporte: '',
        nomeHospedagem: '',
        enderecoHospedagem: '',
        deslocamentoLocal: '',
        observacoes: ''
    };

    tiposTransporte = TIPOS_TRANSPORTE;

    modoEdicao = computed(() => !!this.diaId());

    diaSemanaCalculado = computed(() => {
        if (this.dataString()) {
            const data = this.dateService.createDateFromInput(this.dataString());
            return this.dateService.getWeekdayName(data);
        }
        return '';
    });

    isFimDeSemana = computed(() => {
        if (this.dataString()) {
            const data = this.dateService.createDateFromInput(this.dataString());
            return this.dateService.isWeekend(data);
        }
        return false;
    });

    ngOnInit() {
        // Obter parâmetros da rota
        this.viagemId.set(this.route.snapshot.paramMap.get('viagemId') || '');
        const diaIdParam = this.route.snapshot.paramMap.get('diaId');
        this.diaId.set(diaIdParam);

        // Obter data da query string ou usar data atual
        const dataParam = this.route.snapshot.queryParamMap.get('data');
        if (dataParam) {
            this.dataString.set(dataParam);
        } else {
            this.dataString.set(this.dateService.formatDateForInput(this.dateService.createBrazilDate()));
        }

        // Se estiver editando, carregar dados do dia
        if (this.modoEdicao() && diaIdParam) {
            this.carregarDadosDia(diaIdParam);
        }
    }

    private async carregarDadosDia(diaId: string) {
        try {
            const dia = await this.diaViagemService.obterDiaPorId(diaId);
            if (dia) {
                this.dataString.set(this.dateService.formatDateForInput(dia.data));
                this.formData = {
                    cidade: dia.cidade,
                    transporte: dia.transporte || '',
                    nomeHospedagem: dia.nomeHospedagem || '',
                    enderecoHospedagem: dia.enderecoHospedagem || '',
                    deslocamentoLocal: dia.deslocamentoLocal || '',
                    observacoes: dia.observacoes || ''
                };
            }
        } catch (error) {
            console.error('Erro ao carregar dados do dia:', error);
            this.errorHandler.showError('Erro ao carregar dados do dia.');
        }
    }

    onDataChange() {
        // O computed já recalcula automaticamente
    }

    async onSubmit() {
        if (this.salvando()) return;

        this.salvando.set(true);

        try {
            const dataForm = this.dateService.createDateFromInput(this.dataString());

            if (this.modoEdicao() && this.diaId()) {
                // Modo edição
                const diaAtualizado: Partial<DiaViagem> = {
                    data: dataForm,
                    cidade: this.formData.cidade,
                    transporte: this.formData.transporte || undefined,
                    nomeHospedagem: this.formData.nomeHospedagem || undefined,
                    enderecoHospedagem: this.formData.enderecoHospedagem || undefined,
                    deslocamentoLocal: this.formData.deslocamentoLocal || undefined,
                    observacoes: this.formData.observacoes || undefined
                };

                await this.diaViagemService.atualizarDia(this.diaId()!, diaAtualizado);
                this.errorHandler.showInfo('Detalhes do dia atualizados com sucesso!');
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

                await this.diaViagemService.adicionarDia(novoDia);
                this.errorHandler.showInfo('Detalhes do dia adicionados com sucesso!');
            }

            // Voltar para a página de detalhes da viagem
            this.voltarParaViagem();
        } catch (error) {
            console.error('Erro ao salvar dia:', error);
            // Erro já tratado no serviço
        } finally {
            this.salvando.set(false);
        }
    }

    voltarParaViagem() {
        this.router.navigate(['/viagem', this.viagemId()]);
    }

    onCancelar() {
        this.voltarParaViagem();
    }
}